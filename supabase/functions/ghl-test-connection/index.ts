import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ghlApiKey = Deno.env.get('GHL_API_KEY')!;

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (_) {
    return null;
  }
}

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
    const apiKeyToUse = (tempApiKey || ghlApiKey || '').trim();
    
    console.log('Testing GHL connection for location:', locationId);
    console.log('Using temp API key:', tempApiKey ? 'YES (direct)' : 'NO (from env)');

    // Decode JWT (without verifying) to help debug
    const decoded = decodeJwtPayload(apiKeyToUse);
    const now = Math.floor(Date.now() / 1000);
    const isExpired = decoded?.exp ? decoded.exp < now : false;
    console.log('JWT decoded (partial):', decoded ? { exp: decoded.exp, iss: decoded.iss, sub: decoded.sub, aud: decoded.aud } : 'unparseable');
    
    if (isExpired) {
      return new Response(JSON.stringify({
        success: false,
        status: 401,
        error: 'API key appears expired',
        details: { decoded },
        troubleshooting: 'Regenerate the API key in the same GHL subaccount and try again.',
        usingTempKey: !!tempApiKey
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // First, discover which locations this key can access
    let accessibleLocations: any[] = [];
    try {
      const locRes = await fetch(`https://services.leadconnectorhq.com/locations/search?limit=50`, {
        headers: {
          'Authorization': `Bearer ${apiKeyToUse}`,
          'Version': '2021-07-28',
          'Accept': 'application/json',
        },
      });
      const locText = await locRes.text();
      try { 
        const locData = JSON.parse(locText);
        accessibleLocations = locData?.locations || []; 
      } catch { /* ignore */ }
      console.log('Accessible locations count:', accessibleLocations.length);
    } catch (e) {
      console.log('Locations discovery failed (ignored):', e);
    }

    // Try both possible API hosts (region-specific)
    const hosts = [
      'https://services.leadconnectorhq.com',
      'https://api.msgsndr.com'
    ];

    const results: any[] = [];

    for (const host of hosts) {
      try {
        const url = `${host}/contacts/search?locationId=${locationId}&limit=1`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKeyToUse}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'LocationId': locationId,
            'Location-Id': locationId,
          },
        });
        const text = await res.text();
        let parsed: any = null;
        try { 
          parsed = JSON.parse(text); 
        } catch { 
          // Normalize certain common HTML error pages to a message
          if (typeof text === 'string' && text.includes('<html')) {
            parsed = { message: 'HTML error page returned by host (likely wrong host/region).' };
          } else {
            parsed = { raw: text };
          }
        }
        results.push({ host, ok: res.ok, status: res.status, statusText: res.statusText, body: parsed });
      } catch (e: any) {
        results.push({ host, ok: false, status: 0, statusText: 'Network Error', body: { error: String(e) } });
      }
    }

    const success = results.find(r => r.ok);

    if (!success) {
      const primary = results[0];
      const errorMessage = primary?.body?.message || `HTTP ${primary?.status}: ${primary?.statusText}`;
      return new Response(JSON.stringify({
        success: false,
        status: primary?.status,
        error: errorMessage,
        details: primary?.body,
        troubleshooting: (primary?.status === 401 || primary?.status === 403)
          ? 'Invalid API key or key not valid for this region/subaccount. Regenerate key in this subaccount. If still failing, your account may use a different API host.'
          : 'Check Location ID and try again.',
        usingTempKey: !!tempApiKey,
        accessibleLocations,
        hostResults: results
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      status: success.status,
      message: 'Connection successful!',
      contactsFound: Array.isArray(success?.body?.contacts) ? success.body.contacts.length : 0,
      details: success.body,
      usingTempKey: !!tempApiKey,
      usedHost: success.host,
      hostResults: results,
      accessibleLocations
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