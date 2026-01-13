import { Layout } from "@/components/layout/Layout";
import QuickBooksIntegration from "@/components/quickbooks/QuickBooksIntegration";

const QuickBooksPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">QuickBooks</h1>
          <p className="text-muted-foreground">
            Full accounting integration for invoices, expenses, and financial reporting
          </p>
        </div>
        <QuickBooksIntegration />
      </div>
    </Layout>
  );
};

export default QuickBooksPage;
