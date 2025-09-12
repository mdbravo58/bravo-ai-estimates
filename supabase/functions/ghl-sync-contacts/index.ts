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
    const { organizationId, locationId } = await req.json();
    
    if (!organizationId || !locationId) {
      return new Response(JSON.stringify({ error: 'organizationId and locationId are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Syncing GHL contacts for organization:', organizationId);

    // Fetch contacts from GHL
    const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/?locationId=${locationId}`, {
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'LocationId': locationId,
      },
    });

    if (!ghlResponse.ok) {
      const status = ghlResponse.status;
      const raw = await ghlResponse.text();
      const details = raw?.slice(0, 500);
      const msg = (status === 401 || status === 403)
        ? 'Invalid GHL API key or insufficient permissions'
        : `GHL API error: ${status} ${ghlResponse.statusText}`;
      return new Response(JSON.stringify({ error: msg, details }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ghlData = await ghlResponse.json();
    const contacts: GHLContact[] = ghlData.contacts || [];

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