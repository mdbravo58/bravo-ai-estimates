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

interface CreateOpportunityRequest {
  jobId: string;
  locationId: string;
  pipelineId: string;
  stageId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, locationId, pipelineId, stageId } = await req.json() as CreateOpportunityRequest;
    
    console.log('Creating GHL opportunity for job:', jobId);

    // Get job details with customer info
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(`
        *,
        customers!inner(*)
      `)
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error('Job not found');
    }

    const customer = job.customers;
    
    // Ensure customer has GHL contact ID
    if (!customer.ghl_contact_id) {
      throw new Error('Customer not synced with GHL. Please sync contacts first.');
    }

    // Calculate total estimated value from job budgets
    const { data: budgets } = await supabase
      .from('job_budgets')
      .select('qty_budget, unit_price_budget')
      .eq('job_id', jobId);

    const totalValue = budgets?.reduce((sum, budget) => {
      return sum + (Number(budget.qty_budget || 0) * Number(budget.unit_price_budget || 0));
    }, 0) || 0;

    // Create opportunity in GHL
    const opportunityData = {
      title: job.name || `${job.code} - ${customer.name}`,
      stageId: stageId || 'new-stage-id', // You'll need to configure your pipeline stages
      status: 'open',
      contactId: customer.ghl_contact_id,
      monetaryValue: Math.round(totalValue * 100), // GHL expects cents
      assignedTo: '', // Can be assigned to a specific user
      notes: job.description || '',
      source: 'Bravo Service Suite',
      customFields: [
        {
          key: 'job_code',
          field_value: job.code
        },
        {
          key: 'job_status',
          field_value: job.status
        },
        {
          key: 'start_date',
          field_value: job.start_date || ''
        }
      ]
    };

    console.log('Creating opportunity with data:', opportunityData);

    const ghlResponse = await fetch(`https://services.leadconnectorhq.com/opportunities/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...opportunityData,
        locationId,
        pipelineId,
      }),
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      throw new Error(`GHL API error: ${ghlResponse.status} ${errorText}`);
    }

    const ghlOpportunity = await ghlResponse.json();
    console.log('Created GHL opportunity:', ghlOpportunity);

    // Store the GHL opportunity ID in the job record
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ 
        notes: job.notes ? `${job.notes}\n\nGHL Opportunity ID: ${ghlOpportunity.id}` : `GHL Opportunity ID: ${ghlOpportunity.id}`
      })
      .eq('id', jobId);

    if (updateError) {
      console.error('Error updating job with GHL opportunity ID:', updateError);
    }

    return new Response(JSON.stringify({
      success: true,
      opportunityId: ghlOpportunity.id,
      message: 'Opportunity created successfully in GoHighLevel',
      opportunity: ghlOpportunity
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating GHL opportunity:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to create opportunity in GoHighLevel'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});