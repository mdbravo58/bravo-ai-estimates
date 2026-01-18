import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "sonner";
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
import { Loader2 } from "lucide-react";

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

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

export function AddItemDialog({ open, onOpenChange, onItemAdded }: AddItemDialogProps) {
  const { organization } = useOrganization();
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

  const watchCost = form.watch("unit_cost");
  const watchPrice = form.watch("unit_price");
  const margin = watchPrice > 0 ? ((watchPrice - watchCost) / watchPrice) * 100 : 0;

  const generateSku = (name: string) => {
    const prefix = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 3);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${prefix}-${random}`;
  };

  const onSubmit = async (data: FormData) => {
    if (!organization?.id) {
      toast.error("No organization found");
      return;
    }

    setIsSubmitting(true);
    try {
      const sku = data.sku || generateSku(data.name);

      const { error } = await supabase.from("items").insert({
        organization_id: organization.id,
        name: data.name,
        sku,
        description: data.description || null,
        unit_cost: data.unit_cost,
        unit_price: data.unit_price,
        unit_of_measure: data.unit_of_measure || null,
        active: data.active,
      });

      if (error) throw error;

      toast.success("Item added successfully");
      form.reset();
      onItemAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Add a new item to your price book. This will be available for use in estimates.
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
                      <Input placeholder="Auto-generated if empty" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank to auto-generate</FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
