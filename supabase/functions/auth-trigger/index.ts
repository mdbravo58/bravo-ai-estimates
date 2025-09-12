import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()
    
    console.log('Auth trigger received:', record)

    // Check if this is the demo user email
    if (record.email === 'demo@bravoservice.com') {
      console.log('Processing demo user signup')
      
      // Link the auth user to the existing demo user record
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({ 
          auth_user_id: record.id,
          name: 'Demo Owner',
          role: 'owner',
          status: 'active'
        })
        .eq('email', 'demo@bravoservice.com')

      if (updateError) {
        console.error('Error linking demo user:', updateError)
        throw updateError
      }

      console.log('Demo user linked successfully')
    } else {
      console.log('Regular user signup, no special handling needed')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in auth trigger:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})