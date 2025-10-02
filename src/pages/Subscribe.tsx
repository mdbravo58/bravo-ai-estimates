import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";

export default function Subscribe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState<any>(null);

  const planId = searchParams.get("plan") || "professional";

  const plans: any = {
    starter: {
      name: "Starter",
      price: 297,
      features: [
        "500 AI chat conversations/month",
        "100 automated reports/month",
        "Job management & scheduling",
        "Customer portal",
        "Basic integrations",
        "Email support",
      ],
    },
    professional: {
      name: "Professional",
      price: 497,
      features: [
        "1,000 AI chat conversations/month",
        "200 AI voice calls/month",
        "200 automated reports/month",
        "Advanced job costing",
        "Unlimited team members",
        "Priority support",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: 997,
      features: [
        "Unlimited AI conversations",
        "Unlimited voice calls",
        "Dedicated account manager",
        "Custom AI training",
        "API access",
        "24/7 support",
      ],
    },
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setPlanDetails(plans[planId]);
  }, [user, planId]);

  const handleSubscribe = async () => {
    if (!user || !planDetails) return;

    setLoading(true);
    try {
      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          plan: planId,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: error.message || "Please try again or contact support.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!planDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Start Your Free Trial</h1>
          <p className="text-muted-foreground">
            14 days free, then ${planDetails.price}/month. Cancel anytime.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground">{planDetails.name} Plan</h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">${planDetails.price}</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>

          <div className="space-y-3">
            {planDetails.features.map((feature: string) => (
              <div key={feature} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Start your 14-day free trial immediately</li>
            <li>• No credit card charged during trial</li>
            <li>• Cancel anytime before trial ends</li>
            <li>• Full access to all {planDetails.name} features</li>
          </ul>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Start Free Trial"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By subscribing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </Card>
    </div>
  );
}
