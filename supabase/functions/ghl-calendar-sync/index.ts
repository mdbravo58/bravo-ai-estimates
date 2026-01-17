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

    // Parse request body for date range
    const { startTime, endTime, calendarId } = await req.json();
    
    // Calculate time range (default to today if not provided)
    const now = new Date();
    const startMs = startTime || new Date(now.setHours(0, 0, 0, 0)).getTime();
    const endMs = endTime || new Date(now.setHours(23, 59, 59, 999)).getTime();
    
    // Use provided calendarId or organization's default
    const targetCalendarId = calendarId || orgData.ghl_calendar_id;

    // Build GHL API URL
    let ghlUrl = `https://services.leadconnectorhq.com/calendars/events?locationId=${orgData.ghl_location_id}&startTime=${startMs}&endTime=${endMs}`;
    
    if (targetCalendarId) {
      ghlUrl += `&calendarId=${targetCalendarId}`;
    }

    console.log('Fetching GHL calendar events:', ghlUrl);

    // Fetch events from GHL
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
    console.log('GHL events received:', ghlData);

    const events = ghlData.events || [];
    const syncedAppointments = [];

    // Sync each event to local database
    for (const event of events) {
      // Find customer by GHL contact ID if available
      let customerId = null;
      if (event.contactId) {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('ghl_contact_id', event.contactId)
          .eq('organization_id', orgData.id)
          .single();
        
        if (customer) {
          customerId = customer.id;
        }
      }

      // Find assigned user by GHL user ID if available
      let assignedUserId = null;
      if (event.assignedUserId) {
        const { data: assignedUser } = await supabase
          .from('users')
          .select('id')
          .eq('ghl_user_id', event.assignedUserId)
          .eq('organization_id', orgData.id)
          .single();
        
        if (assignedUser) {
          assignedUserId = assignedUser.id;
        }
      }

      const appointmentData = {
        organization_id: orgData.id,
        ghl_event_id: event.id,
        ghl_calendar_id: event.calendarId,
        ghl_contact_id: event.contactId,
        customer_id: customerId,
        assigned_user_id: assignedUserId,
        title: event.title || 'Untitled Appointment',
        description: event.description || null,
        service_type: event.appointmentType || null,
        address: event.address || null,
        start_time: new Date(parseInt(event.startTime)).toISOString(),
        end_time: new Date(parseInt(event.endTime)).toISOString(),
        status: event.appointmentStatus || 'confirmed',
        notes: event.notes || null,
      };

      // Upsert appointment
      const { data: upsertedAppointment, error: upsertError } = await supabase
        .from('appointments')
        .upsert(appointmentData, {
          onConflict: 'ghl_event_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (upsertError) {
        console.error('Error upserting appointment:', upsertError);
      } else {
        syncedAppointments.push(upsertedAppointment);
      }
    }

    console.log(`Synced ${syncedAppointments.length} appointments`);

    return new Response(JSON.stringify({
      success: true,
      message: `Synced ${syncedAppointments.length} appointments from GHL`,
      appointments: syncedAppointments,
      totalFromGHL: events.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error syncing GHL calendar:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to sync GHL calendar'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
