import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <Layout>
      <main role="main">
        <h1 className="sr-only">Settings</h1>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Configure your organization (coming soon).</p>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default SettingsPage;
