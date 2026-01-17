import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create authenticated client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Get user's organization
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organization_id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !userData) {
      throw new Error('User organization not found');
    }

    // Get organization with GHL credentials
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id, ghl_location_id, ghl_calendar_id')
      .eq('id', userData.organization_id)
      .single();

    if (orgError || !orgData) {
      throw new Error('Organization not found');
    }

    if (!orgData.ghl_location_id) {
      throw new Error('GHL Location ID not configured');
    }

    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    if (!ghlApiKey) {
      throw new Error('GHL API key not configured');
    }

    // Fetch calendars from GHL
    const ghlUrl = `https://services.leadconnectorhq.com/calendars/?locationId=${orgData.ghl_location_id}`;
    
    console.log('Fetching GHL calendars:', ghlUrl);

    const ghlResponse = await fetch(ghlUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Version': '2021-04-15',
        'Content-Type': 'application/json',
      },
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GHL API error:', errorText);
      throw new Error(`GHL API error: ${ghlResponse.status} - ${errorText}`);
    }

    const ghlData = await ghlResponse.json();
    console.log('GHL calendars received:', ghlData);

    const calendars = ghlData.calendars || [];

    return new Response(JSON.stringify({
      success: true,
      calendars: calendars.map((cal: { id: string; name: string; description?: string; isActive?: boolean }) => ({
        id: cal.id,
        name: cal.name,
        description: cal.description,
        isActive: cal.isActive,
      })),
      currentCalendarId: orgData.ghl_calendar_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching GHL calendars:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to fetch GHL calendars'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
