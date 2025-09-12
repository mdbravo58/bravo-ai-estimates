import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomersPage = () => {
  return (
    <Layout>
      <main role="main">
        <h1 className="sr-only">Customers</h1>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Customer list coming soon.</p>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default CustomersPage;
