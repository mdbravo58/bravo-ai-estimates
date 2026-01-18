import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface Item {
  id: string;
  name: string;
  sku: string | null;
}

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onItemDeleted: () => void;
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  item,
  onItemDeleted,
}: DeleteItemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("items").delete().eq("id", item.id);

      if (error) throw error;

      toast.success("Item deleted successfully");
      onItemDeleted();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!item) return;

    setIsDeactivating(true);
    try {
      const { error } = await supabase
        .from("items")
        .update({ active: false })
        .eq("id", item.id);

      if (error) throw error;

      toast.success("Item deactivated successfully");
      onItemDeleted();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate item");
    } finally {
      setIsDeactivating(false);
    }
  };

  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Item
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>"{item.name}"</strong>
              {item.sku && <span className="text-muted-foreground"> (SKU: {item.sku})</span>}?
            </p>
            <p className="text-destructive">
              This action cannot be undone. The item will be permanently removed from your price book.
            </p>
            <p className="text-sm">
              Consider <strong>deactivating</strong> instead if you may need this item again later.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={isDeleting || isDeactivating}>Cancel</AlertDialogCancel>
          <Button
            variant="outline"
            onClick={handleDeactivate}
            disabled={isDeleting || isDeactivating}
          >
            {isDeactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deactivate Instead
          </Button>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || isDeactivating}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
