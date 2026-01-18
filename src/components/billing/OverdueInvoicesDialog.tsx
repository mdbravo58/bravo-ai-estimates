import { format } from "date-fns";
import { AlertTriangle, DollarSign } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Invoice {
  id: string;
  invoice_number: string | null;
  amount: number;
  invoice_date: string;
  due_date: string | null;
  approved: boolean | null;
  method: string;
  jobs?: {
    name: string;
    code: string;
  } | null;
  customers?: {
    name: string;
  } | null;
}

interface OverdueInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => void;
}

export function OverdueInvoicesDialog({
  open,
  onOpenChange,
  invoices,
  onViewInvoice,
  onMarkPaid,
}: OverdueInvoicesDialogProps) {
  const overdueInvoices = invoices.filter(
    (inv) =>
      !inv.approved && inv.due_date && new Date(inv.due_date) < new Date()
  );

  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Overdue Invoices
          </DialogTitle>
          <DialogDescription>
            {overdueInvoices.length} invoice
            {overdueInvoices.length !== 1 ? "s" : ""} past due date
          </DialogDescription>
        </DialogHeader>

        {overdueInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-500/10 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 font-semibold">No Overdue Invoices</h3>
            <p className="text-sm text-muted-foreground">
              All invoices are paid or within their due dates.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-destructive/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Overdue Amount</span>
                <span className="text-xl font-bold text-destructive">
                  $
                  {totalOverdue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                {overdueInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {invoice.invoice_number}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          {getDaysOverdue(invoice.due_date!)} days overdue
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customers?.name} • {invoice.jobs?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {format(new Date(invoice.due_date!), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-destructive">
                        $
                        {invoice.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onViewInvoice(invoice);
                            onOpenChange(false);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            onMarkPaid(invoice.id);
                          }}
                        >
                          Mark Paid
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
