import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ghlApiKey = Deno.env.get('GHL_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { locationId, tempApiKey } = await req.json();
    
    if (!locationId) {
      return new Response(JSON.stringify({ error: 'locationId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use temporary API key if provided, otherwise use environment key
    const apiKeyToUse = tempApiKey || ghlApiKey;
    
    console.log('Testing GHL connection for location:', locationId);
    console.log('Using temp API key:', tempApiKey ? 'YES (direct)' : 'NO (from env)');
    console.log('API key (first 10 chars):', apiKeyToUse?.substring(0, 10) + '...');

    // Test the GHL API connection using the newer Search Contacts API
    const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/search?locationId=${locationId}&limit=1`, {
      headers: {
        'Authorization': `Bearer ${apiKeyToUse}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'LocationId': locationId,
        'Location-Id': locationId,
      },
    });

    const responseText = await ghlResponse.text();
    
    console.log('GHL Response Status:', ghlResponse.status);
    console.log('GHL Response Text:', responseText);

    if (!ghlResponse.ok) {
      let errorMessage = `HTTP ${ghlResponse.status}: ${ghlResponse.statusText}`;
      let details = responseText;
      
      // Parse error details if JSON
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        details = JSON.stringify(errorData, null, 2);
      } catch (e) {
        // Not JSON, use raw text
      }

      return new Response(JSON.stringify({
        success: false,
        status: ghlResponse.status,
        error: errorMessage,
        details: details,
        troubleshooting: ghlResponse.status === 401 
          ? "Invalid API key or insufficient permissions. Make sure you're using the API key from the correct GHL subaccount."
          : "Check your Location ID and API key configuration.",
        usingTempKey: !!tempApiKey
      }), {
        status: 200, // Return 200 so the frontend can handle the error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse successful response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    return new Response(JSON.stringify({
      success: true,
      status: ghlResponse.status,
      message: "Connection successful!",
      contactsFound: responseData?.contacts?.length || 0,
      details: responseData,
      usingTempKey: !!tempApiKey
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error testing GHL connection:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: 'Failed to test GHL connection'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});