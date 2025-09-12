import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CreditCard, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Send
} from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  invoice_date: string;
  approved: boolean;
  method: string;
  job_id: string;
}

const BillingPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('invoice_date', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Failed to load billing data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.amount.toString().includes(searchTerm)
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = invoices.filter(inv => inv.approved).length;
  const pendingInvoices = invoices.filter(inv => !inv.approved).length;
  const avgInvoiceAmount = invoices.length > 0 ? totalRevenue / invoices.length : 0;

  const getStatusBadge = (invoice: Invoice) => {
    if (invoice.approved) {
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
    }
    return <Badge variant="outline" className="border-orange-300 text-orange-700">Pending</Badge>;
  };

  const getStatusIcon = (invoice: Invoice) => {
    if (invoice.approved) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <Clock className="h-4 w-4 text-orange-600" />;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading billing data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main role="main">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Billing & Invoices</h1>
              <p className="text-muted-foreground">Manage invoices and track payments</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid Invoices</p>
                    <div className="text-2xl font-bold">{paidInvoices}</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <div className="text-2xl font-bold">{pendingInvoices}</div>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Invoice</p>
                    <div className="text-2xl font-bold">${avgInvoiceAmount.toFixed(0)}</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Button variant="outline" className="justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
                <Button variant="outline" className="justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Overdue Items
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No invoices found.</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invoice
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(invoice)}
                            <h3 className="font-semibold">
                              Invoice #{invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`}
                            </h3>
                            {getStatusBadge(invoice)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Date: {new Date(invoice.invoice_date).toLocaleDateString()}</span>
                            <span>Method: {invoice.method}</span>
                            <span>Job: {invoice.job_id.slice(0, 8)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between lg:justify-end gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              ${invoice.amount.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.approved ? 'Paid' : 'Outstanding'}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            {!invoice.approved && (
                              <Button size="sm">
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default BillingPage;