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