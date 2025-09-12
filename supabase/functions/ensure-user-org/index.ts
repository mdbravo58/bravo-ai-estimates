import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authHeader = req.headers.get('Authorization') || '';

    // Use an authed client (anon key + user's JWT) for reading with RLS
    const authedClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Use an admin client (service role, no Authorization header) to bypass RLS for privileged writes
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: userResp, error: userErr } = await authedClient.auth.getUser();
    if (userErr || !userResp?.user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authUserId = userResp.user.id;
    const email = userResp.user.email ?? '';

    const { data: existingUser, error: selectErr } = await authedClient
      .from('users')
      .select('id, organization_id, role')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (selectErr) {
      console.log('Select users error (ignored if 0 rows):', selectErr.message);
    }

    if (existingUser?.organization_id) {
      return new Response(JSON.stringify({ organizationId: existingUser.organization_id, created: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a default organization for this user using admin client (bypass RLS)
    const defaultOrgName = email ? `${email.split('@')[0]} Company` : 'My Company';
    const { data: org, error: orgErr } = await adminClient
      .from('organizations')
      .insert({ name: defaultOrgName, plan: 'basic' })
      .select('id')
      .single();

    if (orgErr) {
      console.error('Error creating organization:', orgErr);
      return new Response(JSON.stringify({ error: 'Failed to create organization', details: orgErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert the app user as owner of this org (also via admin client to bypass RLS on INSERT)
    const { data: insertedUser, error: userInsertErr } = await adminClient
      .from('users')
      .insert({
        auth_user_id: authUserId,
        email,
        name: email ? email.split('@')[0] : null,
        role: 'owner',
        status: 'active',
        organization_id: org.id,
      })
      .select('id, organization_id')
      .single();

    if (userInsertErr) {
      console.error('Error creating user record:', userInsertErr);
      return new Response(JSON.stringify({ error: 'Failed to create user record', details: userInsertErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ organizationId: insertedUser.organization_id, created: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('ensure-user-org internal error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error', details: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});