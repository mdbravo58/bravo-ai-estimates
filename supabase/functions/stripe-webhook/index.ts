import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log("Webhook event received:", event.type);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const organizationId = session.metadata?.organization_id;
        const plan = session.metadata?.plan;

        if (!organizationId || !plan) {
          console.error("Missing organization_id or plan in metadata");
          break;
        }

        // Create or update subscription record
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert({
            organization_id: organizationId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan_name: plan,
            status: "trialing",
            trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          });

        if (error) {
          console.error("Error creating subscription:", error);
        } else {
          console.log("Subscription created for org:", organizationId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const organizationId = subscription.metadata?.organization_id;

        if (!organizationId) {
          console.error("Missing organization_id in subscription metadata");
          break;
        }

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error updating subscription:", error);
        } else {
          console.log("Subscription updated:", subscription.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Error canceling subscription:", error);
        } else {
          console.log("Subscription canceled:", subscription.id);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("Payment succeeded for invoice:", invoice.id);
        // Could send confirmation email here
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.error("Payment failed for invoice:", invoice.id);

        // Update subscription status to past_due
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date(),
          })
          .eq("stripe_customer_id", invoice.customer);

        if (error) {
          console.error("Error updating subscription to past_due:", error);
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
