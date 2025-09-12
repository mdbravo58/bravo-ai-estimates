import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReportsPage = () => {
  return (
    <Layout>
      <main role="main">
        <h1 className="sr-only">Reports</h1>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Reporting suite coming soon.</p>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default ReportsPage;
