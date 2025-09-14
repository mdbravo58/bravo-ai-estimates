import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ghlApiKey = Deno.env.get('GHL_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GHLContact {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organizationId, locationId, tempApiKey } = await req.json();
    
    if (!organizationId || !locationId) {
      return new Response(JSON.stringify({ error: 'organizationId and locationId are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use temporary API key if provided, otherwise use environment key
    const apiKeyToUse = (tempApiKey || ghlApiKey || '').trim();

    console.log('Syncing GHL contacts for organization:', organizationId);
    console.log('Using temp API key:', tempApiKey ? 'YES (direct)' : 'NO (from env)');

    // Try different hosts like the test connection function
    const hosts = [
      'https://services.leadconnectorhq.com',
      'https://rest.gohighlevel.com',
    ];

    let ghlData: any = null;
    let contacts: GHLContact[] = [];

    // Try each host to find one that works
    for (const host of hosts) {
      try {
        // Use the v1 API endpoint for contacts
        const ghlResponse = await fetch(`${host}/v1/contacts/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKeyToUse}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (ghlResponse.ok) {
          ghlData = await ghlResponse.json();
          contacts = ghlData.contacts || [];
          console.log(`Successfully fetched contacts from host: ${host}`);
          break;
        } else {
          console.log(`Failed to fetch from host ${host}: ${ghlResponse.status}`);
        }
      } catch (error) {
        console.log(`Error with host ${host}:`, error);
        continue;
      }
    }

    // If no host worked, return error
    if (!ghlData || !contacts.length) {
      return new Response(JSON.stringify({ 
        success: false,
        status: 401,
        error: 'Unable to fetch contacts from GoHighLevel',
        details: 'No working API host found',
        troubleshooting: 'Verify your API key is correct and has proper permissions.'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${contacts.length} contacts in GHL`);

    let syncedCount = 0;
    let updatedCount = 0;

    // Process each contact
    for (const contact of contacts) {
      try {
        // Build address string
        const addressParts = [
          contact.address1,
          contact.city,
          contact.state,
          contact.postalCode,
          contact.country
        ].filter(Boolean);
        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

        // Check if customer already exists
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id, ghl_contact_id')
          .eq('ghl_contact_id', contact.id)
          .eq('organization_id', organizationId)
          .maybeSingle();

        const customerData = {
          name: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
          email: contact.email || null,
          phone: contact.phone || null,
          address: fullAddress,
          ghl_contact_id: contact.id,
          organization_id: organizationId,
          updated_at: new Date().toISOString(),
        };

        if (existingCustomer) {
          // Update existing customer
          const { error: updateError } = await supabase
            .from('customers')
            .update(customerData)
            .eq('id', existingCustomer.id);

          if (updateError) {
            console.error('Error updating customer:', updateError);
          } else {
            updatedCount++;
            console.log(`Updated customer: ${customerData.name}`);
          }
        } else {
          // Create new customer
          const { error: insertError } = await supabase
            .from('customers')
            .insert({
              ...customerData,
              created_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error('Error creating customer:', insertError);
          } else {
            syncedCount++;
            console.log(`Created new customer: ${customerData.name}`);
          }
        }
      } catch (contactError) {
        console.error(`Error processing contact ${contact.id}:`, contactError);
      }
    }

    console.log(`Sync completed: ${syncedCount} new, ${updatedCount} updated`);

    return new Response(JSON.stringify({
      success: true,
      totalContacts: contacts.length,
      newCustomers: syncedCount,
      updatedCustomers: updatedCount,
      message: `Successfully synced ${syncedCount + updatedCount} customers from GHL`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in GHL sync:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to sync contacts from GoHighLevel'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});