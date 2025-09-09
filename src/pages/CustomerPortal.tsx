import { Layout } from "@/components/layout/Layout";
import { CustomerPortal as CustomerPortalComponent } from "@/components/portal/CustomerPortal";

const CustomerPortalPage = () => {
  return (
    <Layout variant="portal">
      <CustomerPortalComponent />
    </Layout>
  );
};

export default CustomerPortalPage;