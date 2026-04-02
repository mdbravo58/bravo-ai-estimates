import { Layout } from "@/components/layout/Layout";
import { AIUsageDashboard } from "@/components/admin/AIUsageDashboard";

// User-facing label intentionally avoids "AI" to reduce learning curve
const AIUsage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage</h1>
          <p className="text-muted-foreground">
            Review smart tool activity and usage trends
          </p>
        </div>
        
        <AIUsageDashboard />
      </div>
    </Layout>
  );
};

export default AIUsage;
