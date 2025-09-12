import { Layout } from "@/components/layout/Layout";
import GHLIntegration from "@/components/ghl/GHLIntegration";

const GHLPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">GoHighLevel Integration</h1>
          <p className="text-muted-foreground mt-2">
            Supercharge your service business with GoHighLevel's marketing automation and CRM capabilities
          </p>
        </div>
        
        <GHLIntegration />
      </div>
    </Layout>
  );
};

export default GHLPage;