import { useState } from "react";
import { format } from "date-fns";
import { Send, Loader2, Mail, CheckCircle } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  invoice_number: string | null;
  amount: number;
  due_date: string | null;
  sent_at: string | null;
  approved: boolean | null;
  customers?: {
    name: string;
    email: string | null;
  } | null;
}

interface SendRemindersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoices: Invoice[];
  onSuccess: () => void;
}

export function SendRemindersDialog({
  open,
  onOpenChange,
  invoices,
  onSuccess,
}: SendRemindersDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const pendingInvoices = invoices.filter(
    (inv) => !inv.approved && inv.customers?.email
  );

  const toggleInvoice = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === pendingInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingInvoices.map((inv) => inv.id));
    }
  };

  const sendReminders = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one invoice");
      return;
    }

    setSending(true);
    try {
      // Update sent_at timestamp for selected invoices
      const { error } = await supabase
        .from("invoices")
        .update({ sent_at: new Date().toISOString() })
        .in("id", selectedIds);

      if (error) throw error;

      toast.success(
        `${selectedIds.length} reminder${selectedIds.length > 1 ? "s" : ""} queued for sending`
      );
      setSelectedIds([]);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error sending reminders:", error);
      toast.error("Failed to send reminders");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Payment Reminders
          </DialogTitle>
          <DialogDescription>
            Select invoices to send payment reminder emails to customers.
          </DialogDescription>
        </DialogHeader>

        {pendingInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 font-semibold">No Pending Invoices</h3>
            <p className="text-sm text-muted-foreground">
              All invoices are either paid or don't have customer emails.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedIds.length === pendingInvoices.length}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} of {pendingInvoices.length} selected
              </span>
            </div>

            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {pendingInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selectedIds.includes(invoice.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedIds.includes(invoice.id)}
                      onCheckedChange={() => toggleInvoice(invoice.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {invoice.invoice_number}
                        </span>
                        <span className="font-semibold">
                          $
                          {invoice.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {invoice.customers?.name} • {invoice.customers?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {invoice.due_date && (
                          <span className="text-xs text-muted-foreground">
                            Due: {format(new Date(invoice.due_date), "MMM dd")}
                          </span>
                        )}
                        {invoice.sent_at && (
                          <span className="text-xs text-amber-600">
                            Last sent:{" "}
                            {format(new Date(invoice.sent_at), "MMM dd")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={sendReminders}
                disabled={selectedIds.length === 0 || sending}
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send {selectedIds.length > 0 ? `${selectedIds.length} ` : ""}
                Reminder{selectedIds.length !== 1 ? "s" : ""}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
