import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { plan, successUrl, cancelUrl } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });

    // Get user's organization
    const { data: userData } = await supabaseClient
      .from("users")
      .select("organization_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!userData?.organization_id) {
      throw new Error("User organization not found");
    }

    const organizationId = userData.organization_id;

    // Check if subscription already exists
    const { data: existingSubscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("organization_id", organizationId)
      .maybeSingle();

    let customerId = existingSubscription?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          organization_id: organizationId,
        },
      });
      customerId = customer.id;
    }

    // Map plan names to Stripe price IDs (you'll need to create these in Stripe Dashboard)
    const priceIds: Record<string, string> = {
      starter: "price_starter_monthly", // Replace with actual Stripe price ID
      professional: "price_professional_monthly", // Replace with actual Stripe price ID
      enterprise: "price_enterprise_monthly", // Replace with actual Stripe price ID
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      throw new Error("Invalid plan selected");
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          organization_id: organizationId,
          plan: plan,
        },
      },
      metadata: {
        organization_id: organizationId,
        plan: plan,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
