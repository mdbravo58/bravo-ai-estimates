import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookToken = Deno.env.get('GHL_WEBHOOK_TOKEN')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GHLWebhookData {
  type: string;
  locationId: string;
  contact?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  opportunity?: {
    id: string;
    name: string;
    value: number;
    stage: string;
    pipelineId: string;
    contactId: string;
  };
  appointment?: {
    id: string;
    calendarId: string;
    contactId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    appointmentStatus: string;
    assignedUserId?: string;
    address?: string;
    notes?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${webhookToken}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookData = await req.json() as GHLWebhookData;
    console.log('Received GHL webhook:', webhookData);

    // Handle contact events
    if (webhookData.type === 'contact.created' || webhookData.type === 'contact.updated') {
      if (webhookData.contact) {
        const contact = webhookData.contact;
        
        // Find organization by location ID
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('ghl_location_id', webhookData.locationId)
          .single();

        if (orgError || !orgData) {
          console.error('Organization not found for location:', webhookData.locationId);
          return new Response(JSON.stringify({ 
            error: 'Organization not found for this location ID' 
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Upsert customer
        const customerData = {
          organization_id: orgData.id,
          ghl_contact_id: contact.id,
          first_name: contact.firstName || '',
          last_name: contact.lastName || '',
          email: contact.email || '',
          phone: contact.phone || '',
          address: [contact.address1, contact.city, contact.state, contact.postalCode]
            .filter(Boolean).join(', '),
        };

        const { error: customerError } = await supabase
          .from('customers')
          .upsert(customerData, { 
            onConflict: 'organization_id,ghl_contact_id',
            ignoreDuplicates: false 
          });

        if (customerError) {
          console.error('Error upserting customer:', customerError);
          throw customerError;
        }

        console.log('Customer synced successfully:', contact.id);
      }
    }

    // Handle opportunity events
    if (webhookData.type === 'opportunity.created' || webhookData.type === 'opportunity.updated') {
      if (webhookData.opportunity) {
        const opportunity = webhookData.opportunity;
        
        // Find customer by GHL contact ID
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, organization_id')
          .eq('ghl_contact_id', opportunity.contactId)
          .single();

        if (customerError || !customerData) {
          console.error('Customer not found for contact:', opportunity.contactId);
          return new Response(JSON.stringify({ 
            error: 'Customer not found for this contact ID' 
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create or update job
        const jobData = {
          organization_id: customerData.organization_id,
          customer_id: customerData.id,
          title: opportunity.name,
          description: `Opportunity from GHL: ${opportunity.name}`,
          status: 'lead',
          ghl_opportunity_id: opportunity.id,
        };

        const { error: jobError } = await supabase
          .from('jobs')
          .upsert(jobData, { 
            onConflict: 'ghl_opportunity_id',
            ignoreDuplicates: false 
          });

        if (jobError) {
          console.error('Error upserting job:', jobError);
          throw jobError;
        }

        console.log('Job synced successfully:', opportunity.id);
      }
    }

    // Handle appointment events
    if (webhookData.type === 'appointment.created' || webhookData.type === 'appointment.updated') {
      if (webhookData.appointment) {
        const appointment = webhookData.appointment;
        
        // Find organization by location ID
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('ghl_location_id', webhookData.locationId)
          .single();

        if (orgError || !orgData) {
          console.error('Organization not found for location:', webhookData.locationId);
          return new Response(JSON.stringify({ 
            error: 'Organization not found for this location ID' 
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Find customer by GHL contact ID if available
        let customerId = null;
        if (appointment.contactId) {
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('ghl_contact_id', appointment.contactId)
            .eq('organization_id', orgData.id)
            .single();
          
          if (customer) {
            customerId = customer.id;
          }
        }

        // Find assigned user by GHL user ID if available
        let assignedUserId = null;
        if (appointment.assignedUserId) {
          const { data: assignedUser } = await supabase
            .from('users')
            .select('id')
            .eq('ghl_user_id', appointment.assignedUserId)
            .eq('organization_id', orgData.id)
            .single();
          
          if (assignedUser) {
            assignedUserId = assignedUser.id;
          }
        }

        const appointmentData = {
          organization_id: orgData.id,
          ghl_event_id: appointment.id,
          ghl_calendar_id: appointment.calendarId,
          ghl_contact_id: appointment.contactId,
          customer_id: customerId,
          assigned_user_id: assignedUserId,
          title: appointment.title || 'Untitled Appointment',
          description: appointment.description || null,
          address: appointment.address || null,
          start_time: new Date(parseInt(appointment.startTime)).toISOString(),
          end_time: new Date(parseInt(appointment.endTime)).toISOString(),
          status: appointment.appointmentStatus || 'confirmed',
          notes: appointment.notes || null,
        };

        const { error: appointmentError } = await supabase
          .from('appointments')
          .upsert(appointmentData, {
            onConflict: 'ghl_event_id',
            ignoreDuplicates: false,
          });

        if (appointmentError) {
          console.error('Error upserting appointment:', appointmentError);
          throw appointmentError;
        }

        console.log('Appointment synced successfully:', appointment.id);
      }
    }

    // Handle appointment deletion
    if (webhookData.type === 'appointment.deleted') {
      if (webhookData.appointment) {
        const { error: deleteError } = await supabase
          .from('appointments')
          .delete()
          .eq('ghl_event_id', webhookData.appointment.id);

        if (deleteError) {
          console.error('Error deleting appointment:', deleteError);
          throw deleteError;
        }

        console.log('Appointment deleted successfully:', webhookData.appointment.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processed successfully',
      type: webhookData.type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing GHL webhook:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to process GHL webhook'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});