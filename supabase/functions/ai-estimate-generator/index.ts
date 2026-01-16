import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's organization
    const { data: userData } = await supabaseClient
      .from('users')
      .select('organization_id')
      .eq('auth_user_id', user.id)
      .single();

    const body = await req.json();
    let { description, serviceType, location, urgency = 'standard', customerInfo = {} } = body;
    
    // Input validation - description
    if (!description || typeof description !== 'string') {
      throw new Error('Service description is required and must be a string');
    }
    
    // Limit description length
    if (description.length > 2000) {
      description = description.substring(0, 2000);
    }
    
    // Sanitize description
    description = description.replace(/[<>]/g, '');
    
    // Validate serviceType with whitelist
    const validServiceTypes = ['plumbing', 'hvac', 'electrical', 'general', 'maintenance', 'other', ''];
    if (serviceType && typeof serviceType === 'string') {
      if (!validServiceTypes.includes(serviceType.toLowerCase())) {
        serviceType = 'other';
      }
      serviceType = serviceType.substring(0, 50);
    } else {
      serviceType = '';
    }
    
    // Validate location
    if (location && typeof location === 'string') {
      location = location.substring(0, 200).replace(/[<>]/g, '');
    } else {
      location = '';
    }
    
    // Validate urgency with whitelist
    const validUrgencies = ['standard', 'urgent', 'emergency'];
    if (!validUrgencies.includes(urgency)) {
      urgency = 'standard';
    }
    
    // Sanitize customerInfo - only allow specific fields
    const allowedCustomerFields = ['name', 'email', 'phone', 'address'];
    const sanitizedCustomerInfo: Record<string, string> = {};
    if (customerInfo && typeof customerInfo === 'object') {
      for (const key of allowedCustomerFields) {
        if (customerInfo[key] && typeof customerInfo[key] === 'string') {
          sanitizedCustomerInfo[key] = customerInfo[key].substring(0, 100).replace(/[<>]/g, '');
        }
      }
    }
    customerInfo = sanitizedCustomerInfo;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    // System prompt for estimate generation
    const systemPrompt = `You are an AI estimate generator for Bravo Service Suite, a professional service business. Generate detailed, accurate estimates based on customer descriptions.

    STANDARD RATES:
    Labor Rates:
    - Apprentice: $45/hour
    - Journeyman: $65/hour  
    - Master Technician: $85/hour
    - Emergency (after hours): $125/hour

    Common Services & Base Pricing:
    PLUMBING:
    - Drain cleaning: $150-250
    - Toilet repair: $100-200
    - Faucet installation: $150-300
    - Water heater repair: $200-400
    - Emergency plumbing: +50% markup

    HVAC:
    - AC tune-up: $150-200
    - Furnace inspection: $100-150
    - Duct cleaning: $300-500
    - System repair: $200-600

    ELECTRICAL:
    - Outlet installation: $100-150
    - Breaker replacement: $150-250
    - Wiring repair: $200-400
    - Panel upgrade: $800-1500

    MARKUP STRUCTURE:
    - Materials: 100% markup on cost
    - Overhead: 15% of total
    - Profit margin: 20% of total

    OUTPUT FORMAT:
    Return a JSON object with:
    {
      "estimateNumber": "EST-[random-6-digits]",
      "serviceType": "extracted service type",
      "urgency": "standard/urgent/emergency", 
      "lineItems": [
        {
          "description": "Work description",
          "category": "labor/material/equipment",
          "quantity": number,
          "unit": "hours/each/linear_ft",
          "unitPrice": number,
          "total": number
        }
      ],
      "laborHours": number,
      "materialCosts": number,
      "subtotal": number,
      "overhead": number,
      "total": number,
      "validUntil": "date 30 days from now",
      "notes": "Additional recommendations or notes",
      "estimatedDuration": "time estimate for completion"
    }

    Be realistic and professional. Include appropriate line items for labor, materials, and any equipment needed.`;

    const userPrompt = `Generate a detailed estimate for this service request:

    Description: ${description}
    Service Type: ${serviceType || 'Not specified'}
    Location: ${location || 'Not specified'}
    Urgency: ${urgency}
    
    Please analyze the request and provide a comprehensive estimate with realistic pricing.`;

    console.log('Generating estimate for user:', user.id, { description, serviceType, location, urgency });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', errorText);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add more credits to your workspace.');
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI Gateway response received');

    const estimateData = JSON.parse(data.choices[0]?.message?.content || '{}');
    
    if (!estimateData.estimateNumber) {
      throw new Error('Failed to generate estimate');
    }

    // Add timestamp
    estimateData.createdAt = new Date().toISOString();
    estimateData.customerInfo = customerInfo;

    // Log usage with service role
    if (userData?.organization_id) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      await supabaseAdmin.from('ai_usage_logs').insert({
        organization_id: userData.organization_id,
        user_id: user.id,
        feature: 'estimate-generator',
        model: 'gemini-2.5-flash',
        tokens_used: Math.ceil((description.length + JSON.stringify(estimateData).length) / 4),
        cost_usd: 0.002
      });
    }

    return new Response(JSON.stringify(estimateData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-estimate-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate estimate' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
