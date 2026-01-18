import { format } from "date-fns";
import { Download, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onMarkPaid: (invoiceId: string) => void;
}

export function ViewInvoiceDialog({
  open,
  onOpenChange,
  invoice,
  onMarkPaid,
}: ViewInvoiceDialogProps) {
  if (!invoice) return null;

  const isOverdue =
    !invoice.approved &&
    invoice.due_date &&
    new Date(invoice.due_date) < new Date();

  const getStatusBadge = () => {
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

  const formatMethod = (method: string) => {
    const methods: Record<string, string> = {
      fixed: "Fixed Price",
      milestone: "Milestone",
      progress: "Progress",
      t_and_m: "Time & Materials",
    };
    return methods[method] || method;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, 30, { align: "center" });

    // Invoice details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${invoice.invoice_number || "N/A"}`, 20, 50);
    doc.text(
      `Date: ${format(new Date(invoice.invoice_date), "MMM dd, yyyy")}`,
      20,
      58
    );
    if (invoice.due_date) {
      doc.text(
        `Due Date: ${format(new Date(invoice.due_date), "MMM dd, yyyy")}`,
        20,
        66
      );
    }
    doc.text(`Status: ${invoice.approved ? "Paid" : "Pending"}`, 20, 74);

    // Customer info
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 92);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.customers?.name || "N/A", 20, 100);
    if (invoice.customers?.address) {
      doc.text(invoice.customers.address, 20, 108);
    }
    if (invoice.customers?.email) {
      doc.text(invoice.customers.email, 20, 116);
    }
    if (invoice.customers?.phone) {
      doc.text(invoice.customers.phone, 20, 124);
    }

    // Job info
    doc.setFont("helvetica", "bold");
    doc.text("Job:", pageWidth - 80, 92);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.jobs?.code || "N/A", pageWidth - 80, 100);
    doc.text(invoice.jobs?.name || "N/A", pageWidth - 80, 108);

    // Amount section
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 140, pageWidth - 20, 140);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 20, 155);
    doc.text(
      `$${invoice.amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      pageWidth - 20,
      155,
      { align: "right" }
    );

    doc.line(20, 162, pageWidth - 20, 162);

    // Payment method
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Method: ${formatMethod(invoice.method)}`, 20, 175);

    // Notes
    if (invoice.notes) {
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", 20, 190);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 40);
      doc.text(splitNotes, 20, 198);
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", pageWidth / 2, 270, {
      align: "center",
    });

    doc.save(`${invoice.invoice_number || "invoice"}.pdf`);
    toast.success("Invoice downloaded as PDF");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Invoice {invoice.invoice_number}
            </DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription>
            Created on {format(new Date(invoice.invoice_date), "MMMM dd, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount */}
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold">
              $
              {invoice.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Info */}
            <div className="space-y-2">
              <h4 className="font-semibold">Customer</h4>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {invoice.customers?.name || "No customer assigned"}
                </p>
                {invoice.customers?.email && <p>{invoice.customers.email}</p>}
                {invoice.customers?.phone && <p>{invoice.customers.phone}</p>}
                {invoice.customers?.address && <p>{invoice.customers.address}</p>}
              </div>
            </div>

            {/* Job Info */}
            <div className="space-y-2">
              <h4 className="font-semibold">Job</h4>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {invoice.jobs?.code} - {invoice.jobs?.name}
                </p>
                {invoice.jobs?.address && <p>{invoice.jobs.address}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Details */}
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice Date</span>
              <span>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</span>
            </div>
            {invoice.due_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date</span>
                <span className={isOverdue ? "text-destructive font-medium" : ""}>
                  {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                  {isOverdue && " (Overdue)"}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span>{formatMethod(invoice.method)}</span>
            </div>
            {invoice.sent_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reminder Sent</span>
                <span>
                  {format(new Date(invoice.sent_at), "MMM dd, yyyy 'at' h:mm a")}
                </span>
              </div>
            )}
          </div>

          {invoice.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Notes</h4>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {!invoice.approved && (
            <Button
              onClick={() => {
                onMarkPaid(invoice.id);
                onOpenChange(false);
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
