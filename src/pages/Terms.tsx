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
            <h1 className="text-xl font-bold text-foreground">Bravo</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Bravo Platform Terms of Use</h1>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              The Bravo platform provides software tools, templates, and educational resources designed to assist users in business organization, document preparation, financial tracking, and general planning.
            </p>

            <p>
              All tools and outputs are provided for <strong className="text-foreground">informational and educational purposes only</strong>.
            </p>

            <p>
              Bravo is not a law firm, CPA firm, or financial advisory service. We do not provide legal, tax, or financial advice. No professional relationship is created through the use of our platform.
            </p>

            <p>
              Any documents or outputs generated are based solely on user-provided information and may not be accurate, complete, or compliant with applicable laws.
            </p>

            <p>
              Users are solely responsible for reviewing all outputs and for consulting with a licensed attorney, CPA, or other qualified professional before relying on any information or documents.
            </p>

            <p>
              All services are provided "as-is" without warranties of any kind. Bravo disclaims all liability for any damages, losses, or outcomes resulting from use of the platform.
            </p>

            <p className="font-medium text-foreground">
              By using Bravo applications, you accept full responsibility for your use and any resulting decisions.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
