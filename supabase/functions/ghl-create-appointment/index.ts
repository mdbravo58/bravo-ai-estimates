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

    if (!orgData.ghl_calendar_id) {
      throw new Error('GHL Calendar ID not configured. Please set it in GHL Integration settings.');
    }

    const ghlApiKey = Deno.env.get('GHL_API_KEY');
    if (!ghlApiKey) {
      throw new Error('GHL API key not configured');
    }

    // Parse request body
    const { 
      customerId,
      title,
      description,
      serviceType,
      address,
      startTime,
      endTime,
      assignedUserId,
      notes,
      toNotify = true
    } = await req.json();

    if (!customerId || !title || !startTime) {
      throw new Error('Missing required fields: customerId, title, startTime');
    }

    // Get customer's GHL contact ID
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, ghl_contact_id, name, address')
      .eq('id', customerId)
      .eq('organization_id', orgData.id)
      .single();

    if (customerError || !customer) {
      throw new Error('Customer not found');
    }

    if (!customer.ghl_contact_id) {
      throw new Error('Customer is not synced with GHL. Please sync contacts first.');
    }

    // Get assigned user's GHL user ID if provided
    let ghlAssignedUserId = null;
    if (assignedUserId) {
      const { data: assignedUser } = await supabase
        .from('users')
        .select('ghl_user_id')
        .eq('id', assignedUserId)
        .eq('organization_id', orgData.id)
        .single();
      
      if (assignedUser?.ghl_user_id) {
        ghlAssignedUserId = assignedUser.ghl_user_id;
      }
    }

    // Calculate end time if not provided (default 1 hour)
    const startDate = new Date(startTime);
    const endDate = endTime ? new Date(endTime) : new Date(startDate.getTime() + 60 * 60 * 1000);

    // Create appointment in GHL
    const ghlAppointmentData: Record<string, unknown> = {
      calendarId: orgData.ghl_calendar_id,
      locationId: orgData.ghl_location_id,
      contactId: customer.ghl_contact_id,
      title: title,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      appointmentStatus: 'confirmed',
      toNotify: toNotify,
    };

    if (ghlAssignedUserId) {
      ghlAppointmentData.assignedUserId = ghlAssignedUserId;
    }
    if (address) {
      ghlAppointmentData.address = address;
    } else if (customer.address) {
      ghlAppointmentData.address = customer.address;
    }
    if (notes) {
      ghlAppointmentData.notes = notes;
    }

    console.log('Creating GHL appointment:', ghlAppointmentData);

    const ghlResponse = await fetch('https://services.leadconnectorhq.com/calendars/events/appointments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Version': '2021-04-15',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ghlAppointmentData),
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GHL API error:', errorText);
      throw new Error(`GHL API error: ${ghlResponse.status} - ${errorText}`);
    }

    const ghlResult = await ghlResponse.json();
    console.log('GHL appointment created:', ghlResult);

    // Create local appointment record
    const appointmentData = {
      organization_id: orgData.id,
      ghl_event_id: ghlResult.id || ghlResult.event?.id,
      ghl_calendar_id: orgData.ghl_calendar_id,
      ghl_contact_id: customer.ghl_contact_id,
      customer_id: customerId,
      assigned_user_id: assignedUserId || null,
      title: title,
      description: description || null,
      service_type: serviceType || null,
      address: address || customer.address || null,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      status: 'confirmed',
      notes: notes || null,
    };

    const { data: newAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select(`
        *,
        customer:customers(id, name, email, phone, address),
        assigned_user:users(id, name)
      `)
      .single();

    if (insertError) {
      console.error('Error inserting local appointment:', insertError);
      throw new Error('Appointment created in GHL but failed to save locally');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Appointment created successfully',
      appointment: newAppointment,
      ghlEventId: ghlResult.id || ghlResult.event?.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating GHL appointment:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to create appointment'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
