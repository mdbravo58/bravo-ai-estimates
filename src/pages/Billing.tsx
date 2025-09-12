import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BillingPage = () => {
  return (
    <Layout>
      <main role="main">
        <h1 className="sr-only">Billing</h1>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Billing management coming soon.</p>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default BillingPage;
