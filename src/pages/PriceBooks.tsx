import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PriceBooksPage = () => {
  return (
    <Layout>
      <main role="main">
        <h1 className="sr-only">Price Books</h1>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Price Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage items and pricing (coming soon).</p>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default PriceBooksPage;
