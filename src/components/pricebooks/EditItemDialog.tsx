import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional(),
  description: z.string().optional(),
  unit_cost: z.coerce.number().min(0, "Cost must be positive"),
  unit_price: z.coerce.number().min(0, "Price must be positive"),
  unit_of_measure: z.string().optional(),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

const UNITS_OF_MEASURE = [
  { value: "each", label: "Each" },
  { value: "hour", label: "Hour" },
  { value: "foot", label: "Foot" },
  { value: "sqft", label: "Square Foot" },
  { value: "gallon", label: "Gallon" },
  { value: "pound", label: "Pound" },
  { value: "box", label: "Box" },
  { value: "roll", label: "Roll" },
  { value: "bag", label: "Bag" },
  { value: "set", label: "Set" },
];

export interface Item {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  unit_cost: number | null;
  unit_price: number | null;
  unit_of_measure: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onItemUpdated: () => void;
  onDeleteClick: (item: Item) => void;
}

export function EditItemDialog({
  open,
  onOpenChange,
  item,
  onItemUpdated,
  onDeleteClick,
}: EditItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      unit_cost: 0,
      unit_price: 0,
      unit_of_measure: "each",
      active: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        sku: item.sku || "",
        description: item.description || "",
        unit_cost: item.unit_cost || 0,
        unit_price: item.unit_price || 0,
        unit_of_measure: item.unit_of_measure || "each",
        active: item.active,
      });
    }
  }, [item, form]);

  const watchCost = form.watch("unit_cost");
  const watchPrice = form.watch("unit_price");
  const margin = watchPrice > 0 ? ((watchPrice - watchCost) / watchPrice) * 100 : 0;

  const onSubmit = async (data: FormData) => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("items")
        .update({
          name: data.name,
          sku: data.sku || null,
          description: data.description || null,
          unit_cost: data.unit_cost,
          unit_price: data.unit_price,
          unit_of_measure: data.unit_of_measure || null,
          active: data.active,
        })
        .eq("id", item.id);

      if (error) throw error;

      toast.success("Item updated successfully");
      onItemUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update item details. Changes will affect future estimates.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Copper Pipe 1/2 inch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_of_measure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measure</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNITS_OF_MEASURE.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description of the item"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
              <div>
                <p className="text-sm font-medium">Profit Margin</p>
                <p className={`text-2xl font-bold ${margin < 0 ? "text-destructive" : margin < 20 ? "text-yellow-600" : "text-accent"}`}>
                  {margin.toFixed(1)}%
                </p>
              </div>
              {margin < 0 && (
                <p className="text-sm text-destructive">Warning: Negative margin</p>
              )}
              {margin >= 0 && margin < 20 && (
                <p className="text-sm text-yellow-600">Low margin</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Inactive items won't appear in estimates
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-3 bg-muted/30 text-sm text-muted-foreground">
              <p>Created: {format(new Date(item.created_at), "PPp")}</p>
              <p>Last updated: {format(new Date(item.updated_at), "PPp")}</p>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onOpenChange(false);
                  onDeleteClick(item);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
