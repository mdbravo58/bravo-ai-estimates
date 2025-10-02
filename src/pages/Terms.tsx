import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/bravo-logo.png" alt="Bravo" className="h-8" />
            <h1 className="text-xl font-bold text-foreground">Bravo Service Suite</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Bravo Service Suite ("Service"), you agree to be bound by these
                Terms of Service. If you disagree with any part of the terms, you may not access the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Use License</h2>
              <p className="text-muted-foreground mb-3">
                We grant you a revocable, non-exclusive, non-transferable, limited license to use the
                Service for your business operations, subject to these Terms.
              </p>
              <p className="text-muted-foreground">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Modify or copy the Service materials</li>
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to reverse engineer any part of the Service</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the Service to another person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Subscription & Billing</h2>
              <p className="text-muted-foreground mb-3">
                <strong>Free Trial:</strong> We offer a 14-day free trial. No credit card required. You
                will not be charged during the trial period.
              </p>
              <p className="text-muted-foreground mb-3">
                <strong>Subscription Plans:</strong> After the trial, you will be charged the monthly fee
                based on your selected plan (Starter, Professional, or Enterprise).
              </p>
              <p className="text-muted-foreground mb-3">
                <strong>Usage Limits:</strong> Each plan includes specific usage limits (AI chats, voice
                calls, reports). Overages are billed at $0.50/chat and $2.00/voice call.
              </p>
              <p className="text-muted-foreground">
                <strong>Cancellation:</strong> You may cancel your subscription at any time. Your
                subscription will remain active until the end of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. User Data & Privacy</h2>
              <p className="text-muted-foreground">
                We collect and use your data as described in our Privacy Policy. You retain all rights to
                your business data. We will never sell your data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. AI Services Disclaimer</h2>
              <p className="text-muted-foreground">
                Our AI-powered features (chatbot, voice assistant, analytics) are provided "as is." While
                we strive for accuracy, AI-generated content may contain errors. You are responsible for
                verifying critical information before acting on it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                6. Service Availability
              </h2>
              <p className="text-muted-foreground">
                We aim for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for
                any loss resulting from service interruptions, including scheduled maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                7. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                In no event shall Bravo Service Suite be liable for any damages (including loss of
                profits, data, or business interruption) arising from the use or inability to use the
                Service, even if we have been notified of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Bravo Service Suite from any claims, damages, or
                expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify you of significant
                changes via email. Continued use of the Service after changes constitutes acceptance of
                the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at:
                <br />
                <strong>Email:</strong> legal@bravoservice.com
                <br />
                <strong>Support:</strong> support@bravoservice.com
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
