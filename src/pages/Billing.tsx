import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { toast } from "sonner";

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CreateInvoiceDialog } from "@/components/billing/CreateInvoiceDialog";
import { ViewInvoiceDialog } from "@/components/billing/ViewInvoiceDialog";
import { OverdueInvoicesDialog } from "@/components/billing/OverdueInvoicesDialog";
import { SendRemindersDialog } from "@/components/billing/SendRemindersDialog";
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Send,
  FileText,
  Loader2,
} from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string | null;
  amount: number;
  invoice_date: string;
  due_date: string | null;
  approved: boolean | null;
  method: string;
  notes: string | null;
  sent_at: string | null;
  job_id: string;
  customer_id: string | null;
  jobs?: {
    name: string;
    code: string;
    address: string | null;
  } | null;
  customers?: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  } | null;
}

const BillingPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [overdueDialogOpen, setOverdueDialogOpen] = useState(false);
  const [remindersDialogOpen, setRemindersDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          jobs (
            name,
            code,
            address
          ),
          customers (
            name,
            email,
            phone,
            address
          )
        `)
        .order("invoice_date", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.amount.toString().includes(searchTerm) ||
      invoice.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.jobs?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = invoices.filter((inv) => inv.approved).length;
  const pendingInvoices = invoices.filter((inv) => !inv.approved).length;
  const overdueInvoices = invoices.filter(
    (inv) =>
      !inv.approved && inv.due_date && new Date(inv.due_date) < new Date()
  ).length;

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ approved: true })
        .eq("id", invoiceId);

      if (error) throw error;

      toast.success("Invoice marked as paid");
      fetchInvoices();
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Failed to update invoice");
    }
  };

  const exportPDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Billing Report", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${format(new Date(), "MMMM dd, yyyy")}`, pageWidth / 2, 32, {
      align: "center",
    });

    // Summary stats
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 20, 60);
    doc.text(`Paid Invoices: ${paidInvoices}`, 20, 68);
    doc.text(`Pending Invoices: ${pendingInvoices}`, 20, 76);
    doc.text(`Overdue Invoices: ${overdueInvoices}`, 20, 84);

    // Table header
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 95, pageWidth - 20, 95);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice #", 20, 103);
    doc.text("Customer", 60, 103);
    doc.text("Amount", 120, 103);
    doc.text("Status", 155, 103);
    doc.text("Date", 175, 103);

    doc.line(20, 107, pageWidth - 20, 107);

    // Table rows
    doc.setFont("helvetica", "normal");
    let yPos = 115;

    filteredInvoices.slice(0, 25).forEach((invoice) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 25;
      }

      doc.text(invoice.invoice_number || "N/A", 20, yPos);
      doc.text((invoice.customers?.name || "N/A").substring(0, 20), 60, yPos);
      doc.text(
        `$${invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        120,
        yPos
      );
      doc.text(invoice.approved ? "Paid" : "Pending", 155, yPos);
      doc.text(format(new Date(invoice.invoice_date), "MM/dd/yy"), 175, yPos);

      yPos += 8;
    });

    doc.save(`Billing-Report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    toast.success("Report exported successfully");
  };

  const formatMethod = (method: string) => {
    const methods: Record<string, string> = {
      fixed: "Fixed Price",
      milestone: "Milestone",
      progress: "Progress",
      t_and_m: "T&M",
    };
    return methods[method] || method;
  };

  const getStatusBadge = (invoice: Invoice) => {
    const isOverdue =
      !invoice.approved &&
      invoice.due_date &&
      new Date(invoice.due_date) < new Date();

    if (invoice.approved) {
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      );
    }
    if (isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
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
              <p className="text-muted-foreground">
                Manage invoices and track payments
              </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
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
                  placeholder="Search invoices by number, customer, or job..."
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
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <div className="text-2xl font-bold">
                      $
                      {totalRevenue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Paid Invoices
                    </p>
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
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <div className="text-2xl font-bold">{pendingInvoices}</div>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                overdueInvoices > 0
                  ? "border-destructive/50 bg-destructive/5"
                  : ""
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Overdue
                    </p>
                    <div
                      className={`text-2xl font-bold ${
                        overdueInvoices > 0 ? "text-destructive" : ""
                      }`}
                    >
                      {overdueInvoices}
                    </div>
                  </div>
                  <AlertTriangle
                    className={`h-8 w-8 ${
                      overdueInvoices > 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
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
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setRemindersDialogOpen(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={exportPDFReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setOverdueDialogOpen(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Overdue Items
                  {overdueInvoices > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {overdueInvoices}
                    </Badge>
                  )}
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
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No invoices found.</p>
                  <Button
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
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
                            <h3 className="font-semibold">
                              {invoice.invoice_number ||
                                `INV-${invoice.id.slice(0, 8)}`}
                            </h3>
                            {getStatusBadge(invoice)}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {invoice.customers?.name || "No customer"}
                            </span>
                            {invoice.jobs && (
                              <span>
                                {" "}
                                • {invoice.jobs.code} - {invoice.jobs.name}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Created:{" "}
                              {format(
                                new Date(invoice.invoice_date),
                                "MMM dd, yyyy"
                              )}
                            </span>
                            {invoice.due_date && (
                              <span>
                                Due:{" "}
                                {format(
                                  new Date(invoice.due_date),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            )}
                            <span>Method: {formatMethod(invoice.method)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              $
                              {invoice.amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.approved ? "Paid" : "Outstanding"}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewInvoice(invoice)}
                            >
                              View
                            </Button>
                            {!invoice.approved && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkPaid(invoice.id)}
                              >
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

      {/* Dialogs */}
      <CreateInvoiceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchInvoices}
      />

      <ViewInvoiceDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        invoice={selectedInvoice}
        onMarkPaid={handleMarkPaid}
      />

      <OverdueInvoicesDialog
        open={overdueDialogOpen}
        onOpenChange={setOverdueDialogOpen}
        invoices={invoices}
        onViewInvoice={handleViewInvoice}
        onMarkPaid={handleMarkPaid}
      />

      <SendRemindersDialog
        open={remindersDialogOpen}
        onOpenChange={setRemindersDialogOpen}
        invoices={invoices}
        onSuccess={fetchInvoices}
      />
    </Layout>
  );
};

export default BillingPage;
