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
    const { message, conversationHistory = [] } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    // System prompt for customer service
    const systemPrompt = `You are an AI customer service assistant for Bravo Service Suite, a professional service business management platform. You help customers with:

    SERVICES AVAILABLE:
    - Plumbing repairs and installations
    - HVAC maintenance and repairs  
    - Electrical work
    - General maintenance services
    - Emergency services (24/7)

    CAPABILITIES:
    - Schedule service appointments
    - Provide service estimates
    - Check job status and updates
    - Answer billing questions
    - Provide service recommendations
    - Handle emergency requests

    BUSINESS HOURS:
    - Regular: Monday-Friday 8AM-6PM, Saturday 9AM-4PM
    - Emergency: 24/7 available
    - Response time: Within 2 hours for regular, 30 minutes for emergencies

    PERSONALITY:
    - Professional but friendly
    - Helpful and solution-oriented
    - Knowledgeable about services
    - Empathetic to customer needs
    - Always offer to connect with human technician if needed

    If a customer wants to:
    1. Schedule service - Ask for their contact info, service type, and preferred time
    2. Get estimate - Ask about the specific issue/project details
    3. Check status - Ask for their job reference number or contact info
    4. Emergency - Prioritize and get location/contact info immediately
    5. Billing - Direct to billing department but offer basic help

    Always be helpful and aim to resolve their issue or connect them with the right person.`;

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending request to Lovable AI Gateway with messages:', messages);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
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
      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Lovable AI Gateway response:', data);

    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: crypto.randomUUID()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-customer-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});