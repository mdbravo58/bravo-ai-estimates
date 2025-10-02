import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$297",
      description: "Perfect for small HVAC businesses getting started",
      features: [
        "500 AI chat conversations/month",
        "100 automated reports/month",
        "Job management & scheduling",
        "Customer portal",
        "Basic integrations (GHL)",
        "Email support",
      ],
      notIncluded: [
        "AI voice assistant",
        "Advanced analytics",
        "Priority support",
      ],
      cta: "Start Free Trial",
      plan_id: "starter",
    },
    {
      name: "Professional",
      price: "$497",
      description: "Most popular for growing HVAC companies",
      features: [
        "1,000 AI chat conversations/month",
        "200 AI voice calls/month",
        "200 automated reports/month",
        "Advanced job costing & budgets",
        "Team management (unlimited users)",
        "Real-time cost tracking",
        "GoHighLevel + QuickBooks sync",
        "Priority email support",
      ],
      notIncluded: ["24/7 phone support", "Custom integrations"],
      cta: "Start Free Trial",
      plan_id: "professional",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$997",
      description: "For established HVAC businesses scaling fast",
      features: [
        "Unlimited AI conversations",
        "Unlimited voice calls",
        "Unlimited reports",
        "Dedicated account manager",
        "Custom AI training on your data",
        "White-label options",
        "API access",
        "24/7 priority support",
        "Custom integrations",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      plan_id: "enterprise",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/bravo-logo.png" alt="Bravo" className="h-8" />
            <h1 className="text-xl font-bold text-foreground">Bravo Service Suite</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Save up to 20 hours/week on admin tasks</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 relative ${
                  plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() =>
                      plan.plan_id === "enterprise"
                        ? window.open("mailto:sales@bravoservice.com", "_blank")
                        : navigate(`/subscribe?plan=${plan.plan_id}`)
                    }
                  >
                    {plan.cta}
                  </Button>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 opacity-50">
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground line-through">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                What happens after my trial ends?
              </h4>
              <p className="text-muted-foreground">
                Your 14-day free trial gives you full access to all features. After the trial, you'll be
                charged based on your selected plan. You can cancel anytime before the trial ends.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Can I change plans later?
              </h4>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time from your billing dashboard.
                Changes take effect at the start of your next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                What if I exceed my usage limits?
              </h4>
              <p className="text-muted-foreground">
                You'll receive notifications at 80% usage. Additional usage is available at
                $0.50/chat and $2.00/voice call. We'll never charge without your approval.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Is my data secure?
              </h4>
              <p className="text-muted-foreground">
                Absolutely. We use bank-level encryption, regular security audits, and comply with
                SOC 2 standards. Your data is never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 Bravo Service Suite. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/terms" className="hover:text-foreground">Terms of Service</a>
            <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
            <a href="mailto:support@bravoservice.com" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
