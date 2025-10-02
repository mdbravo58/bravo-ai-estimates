import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Privacy() {
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
          <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-3">We collect the following types of information:</p>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">Account Information:</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                <li>Email address, name, company name</li>
                <li>Billing information (processed securely via Stripe)</li>
                <li>User role and permissions</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-2">Business Data:</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                <li>Customer information (names, addresses, phone numbers)</li>
                <li>Job details, estimates, and invoices</li>
                <li>Files and documents uploaded to the platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-2">Usage Data:</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>AI chat conversations and voice call transcripts</li>
                <li>Feature usage statistics and analytics</li>
                <li>Login times, IP addresses, browser types</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Provide Services:</strong> To operate and improve the Bravo Service Suite platform</li>
                <li><strong>AI Features:</strong> To train and improve AI models for chatbot, voice, and analytics features</li>
                <li><strong>Billing:</strong> To process payments and manage subscriptions</li>
                <li><strong>Support:</strong> To respond to your questions and troubleshoot issues</li>
                <li><strong>Security:</strong> To detect fraud, prevent abuse, and ensure platform security</li>
                <li><strong>Communications:</strong> To send service updates, security alerts, and marketing (opt-out available)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Data Sharing & Third Parties</h2>
              <p className="text-muted-foreground mb-3">
                <strong>We DO NOT sell your data.</strong> We only share data with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li><strong>Service Providers:</strong> Supabase (hosting), Stripe (payments), Google (AI models), Resend (email)</li>
                <li><strong>Integrations:</strong> GoHighLevel, QuickBooks (only data you authorize)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Encryption in transit (TLS/SSL) and at rest (AES-256)</li>
                <li>Row-Level Security (RLS) to isolate customer data</li>
                <li>Regular security audits and penetration testing</li>
                <li>Two-factor authentication (2FA) available</li>
                <li>Automated backups and disaster recovery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your data for as long as your account is active. After account cancellation:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Account data is deleted within 30 days</li>
                <li>Backups are purged within 90 days</li>
                <li>Billing records retained for 7 years (legal requirement)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Your Rights (GDPR/CCPA)</h2>
              <p className="text-muted-foreground mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li><strong>Access:</strong> Request a copy of your data</li>
                <li><strong>Correction:</strong> Update inaccurate information</li>
                <li><strong>Deletion:</strong> Request account and data deletion</li>
                <li><strong>Portability:</strong> Export your data in CSV/JSON format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, contact us at <strong>privacy@bravoservice.com</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cookies & Tracking</h2>
              <p className="text-muted-foreground">
                We use essential cookies for authentication and functionality. We do NOT use advertising
                cookies or sell data to ad networks. You can disable non-essential cookies in your browser
                settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our Service is not intended for users under 18. We do not knowingly collect data from
                children. If you believe we have collected data from a minor, contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. International Users</h2>
              <p className="text-muted-foreground">
                Your data is stored on servers in the United States. By using the Service, you consent to
                the transfer and processing of your data in the U.S. We comply with GDPR for EU users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">10. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically. We will notify you of significant changes
                via email. Continued use of the Service after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">11. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy questions or to exercise your rights:
                <br />
                <strong>Email:</strong> privacy@bravoservice.com
                <br />
                <strong>Data Protection Officer:</strong> dpo@bravoservice.com
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
