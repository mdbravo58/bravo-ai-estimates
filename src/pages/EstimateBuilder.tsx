import { Layout } from "@/components/layout/Layout";
import { EstimateBuilder as EstimateBuilderComponent } from "@/components/estimates/EstimateBuilder";

const EstimateBuilderPage = () => {
  const handleSave = (estimate: any) => {
    console.log("Saving estimate:", estimate);
    // Here you would save to your backend
  };

  const handleSend = (estimate: any) => {
    console.log("Sending estimate:", estimate);
    // Here you would send the estimate to the customer
  };

  return (
    <Layout>
      <EstimateBuilderComponent onSave={handleSave} onSend={handleSend} />
    </Layout>
  );
};

export default EstimateBuilderPage;