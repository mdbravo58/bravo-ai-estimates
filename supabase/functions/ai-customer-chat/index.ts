import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Software documentation for the AI to reference
const softwareGuide = `
BRAVO SERVICE SUITE - SOFTWARE GUIDE

NAVIGATION:
- Dashboard (/) - Overview of your business: revenue, jobs, and key metrics
- Estimates (/estimates) - Create and manage service estimates for customers
- Jobs (/jobs) - Track all your jobs from start to finish
- Customers (/customers) - Manage your customer database
- Scheduling (/scheduling) - View and manage your team's schedule
- GPS Tracking (/gps-tracking) - Real-time location of your technicians
- Reviews (/reviews) - Monitor and respond to customer reviews
- Team (/team) - Manage employees, roles, and permissions
- Price Books (/price-books) - Set up your service pricing
- Calculator (/calculator) - Calculate job costs and profits
- Reports (/reports) - View business analytics and reports
- Billing (/billing) - Manage invoices and payments
- Settings (/settings) - Configure your organization
- AI Assistant (/ai) - AI-powered tools for estimates, analytics, and voice
- AI Usage (/ai-usage) - Monitor your AI feature usage
- GoHighLevel (/ghl) - CRM and marketing automation integration
- QuickBooks (/quickbooks) - Full accounting integration

HOW TO CREATE AN ESTIMATE:
1. Go to Estimates from the sidebar
2. Click "New Estimate" button
3. Select or add a customer
4. Add line items with services/materials
5. Set pricing and markup
6. Preview and send to customer

HOW TO ADD A CUSTOMER:
1. Go to Customers from the sidebar
2. Click "Add Customer" button
3. Fill in name, email, phone, and address
4. Save the customer record

HOW TO CREATE A JOB:
1. Go to Jobs from the sidebar
2. Click "Create Job" button
3. Link to an existing estimate or create standalone
4. Assign a technician and set schedule
5. Add job details and notes

HOW TO SCHEDULE:
1. Go to Scheduling from the sidebar
2. View the calendar with all appointments
3. Click on a time slot to add new appointment
4. Drag and drop to reschedule

HOW TO USE GPS TRACKING:
1. Go to GPS Tracking from the sidebar
2. View real-time locations of all technicians
3. Click on a tech to see their current job
4. Track drive times and optimize routes

HOW TO CONNECT GOHIGHLEVEL:
1. Go to GoHighLevel from the sidebar
2. Enter your GHL Location ID
3. Enter your Access Token (JWT)
4. Test the connection
5. Sync contacts and set up workflows

HOW TO CONNECT QUICKBOOKS:
1. Go to QuickBooks from the sidebar
2. Enter your Client ID and Secret from Intuit Developer
3. Click Connect to authorize
4. Configure sync settings for invoices, expenses, payments

FEATURES BY PAGE:
- Estimates: AI-powered estimate generation, templates, customer approval
- Jobs: Progress tracking, time entries, material tracking, photos
- Scheduling: Calendar view, drag-drop scheduling, tech assignments
- Reports: Revenue, job completion, technician performance
- Price Books: Service catalog, pricing tiers, markup rules
- AI Tools: Voice assistant, estimate generator, analytics dashboard
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], currentPage = '/' } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    // System prompt for software help assistant
    const systemPrompt = `You are a helpful in-app assistant for Bravo Service Suite, a field service management software. Your ONLY job is to help users learn how to use the software.

${softwareGuide}

CURRENT PAGE: ${currentPage}

YOUR ROLE:
- Help users navigate the software
- Explain features and how to use them
- Provide step-by-step instructions
- Answer questions about functionality
- Give tips for using features effectively

RESPONSE STYLE:
- Be concise and helpful
- Use numbered steps for instructions
- Reference specific menu items and buttons
- If the user is on a specific page, give context-aware help
- Use simple, non-technical language

DO NOT:
- Answer questions unrelated to the software
- Provide business advice or industry tips
- Discuss pricing or subscription plans
- Make promises about features that don't exist

If asked about something outside the software, politely redirect: "I'm here to help you use Bravo Service Suite. Is there a feature I can help you with?"

Always be encouraging and remember that users may be new to the software.`;

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Software help request for page:', currentPage);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 600,
        temperature: 0.5,
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
    console.log('AI help response received');

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
