import { Layout } from "@/components/layout/Layout";
import { AIUsageDashboard } from "@/components/admin/AIUsageDashboard";

const AIUsage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Usage & Costs</h1>
          <p className="text-muted-foreground">
            Monitor your AI feature usage and associated costs
          </p>
        </div>
        
        <AIUsageDashboard />
      </div>
    </Layout>
  );
};

export default AIUsage;
