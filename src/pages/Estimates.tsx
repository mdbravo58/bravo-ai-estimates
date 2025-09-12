import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const EstimatesPage = () => {
  return (
    <Layout>
      <main role="main">
        <h1 className="sr-only">Estimates</h1>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Estimates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Create and manage estimates.</p>
            <Button asChild>
              <Link to="/estimates/new">Create New Estimate</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default EstimatesPage;
