import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ghlApiKey = Deno.env.get('GHL_API_KEY')!;

interface TriggerWorkflowRequest {
  workflowId: string;
  contactId: string;
  eventStartTime?: string;
  customData?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workflowId, contactId, eventStartTime, customData } = await req.json() as TriggerWorkflowRequest;
    
    console.log('Triggering GHL workflow:', workflowId, 'for contact:', contactId);

    // Trigger workflow in GHL
    const workflowData = {
      contactId,
      eventStartTime: eventStartTime || new Date().toISOString(),
      ...(customData && { customData })
    };

    console.log('Workflow trigger data:', workflowData);

    const ghlResponse = await fetch(`https://services.leadconnectorhq.com/workflows/${workflowId}/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowData),
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GHL workflow trigger failed:', errorText);
      throw new Error(`GHL API error: ${ghlResponse.status} ${errorText}`);
    }

    const result = await ghlResponse.json();
    console.log('Workflow triggered successfully:', result);

    return new Response(JSON.stringify({
      success: true,
      message: 'Workflow triggered successfully in GoHighLevel',
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error triggering GHL workflow:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to trigger workflow in GoHighLevel'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});