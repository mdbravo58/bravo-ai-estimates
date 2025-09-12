import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalculatorPage = () => {
  return (
    <Layout>
      <main role="main">
        <h1 className="sr-only">Calculator</h1>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Job cost calculator coming soon.</p>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default CalculatorPage;
