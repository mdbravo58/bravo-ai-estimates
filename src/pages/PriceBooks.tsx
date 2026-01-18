import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Package,
  DollarSign,
  TrendingUp,
  Loader2,
  Edit,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddItemDialog } from "@/components/pricebooks/AddItemDialog";
import { EditItemDialog, Item } from "@/components/pricebooks/EditItemDialog";
import { DeleteItemDialog } from "@/components/pricebooks/DeleteItemDialog";

export default function PriceBooksPage() {
  const { organization } = useOrganization();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTip, setShowTip] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = async () => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("organization_id", organization.id)
        .order("name");

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organization?.id) {
      fetchItems();
    }
  }, [organization?.id]);

  const handleToggleActive = async (item: Item) => {
    setTogglingId(item.id);
    try {
      const { error } = await supabase
        .from("items")
        .update({ active: !item.active })
        .eq("id", item.id);

      if (error) throw error;

      toast.success(`Item ${item.active ? "deactivated" : "activated"}`);
      fetchItems();
    } catch (error: any) {
      toast.error("Failed to update item");
    } finally {
      setTogglingId(null);
    }
  };

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = items.length;
  const activeItems = items.filter((item) => item.active).length;
  const avgMargin =
    items.length > 0
      ? items.reduce((acc, item) => {
          const cost = item.unit_cost || 0;
          const price = item.unit_price || 0;
          return acc + (price > 0 ? ((price - cost) / price) * 100 : 0);
        }, 0) / items.length
      : 0;
  const totalValue = items.reduce((acc, item) => acc + (item.unit_price || 0), 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Price Books</h1>
            <p className="text-muted-foreground">
              Manage your inventory items and pricing
            </p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {showTip && (
          <Alert className="bg-primary/5 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                <strong>Pro Tip:</strong> Use consistent pricing in your price book to ensure accurate estimates. Click on any item to edit its details.
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowTip(false)}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items by name, SKU, or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Items</CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${avgMargin < 20 ? "text-yellow-600" : "text-accent"}`}>
                {avgMargin.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              {searchTerm ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">No items found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    No items match your search "{searchTerm}". Try a different search term.
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">No items yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Get started by adding your first item to the price book.
                  </p>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Item
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const margin =
                item.unit_price && item.unit_price > 0
                  ? ((item.unit_price - (item.unit_cost || 0)) / item.unit_price) * 100
                  : 0;

              return (
                <Card
                  key={item.id}
                  className={`transition-all hover:shadow-md ${!item.active ? "opacity-60" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {item.name}
                            <Badge variant={item.active ? "default" : "secondary"}>
                              {item.active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          {item.description && (
                            <CardDescription className="mt-1">
                              {item.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-4">
                          <span className="text-sm text-muted-foreground">Active</span>
                          <Switch
                            checked={item.active}
                            onCheckedChange={() => handleToggleActive(item)}
                            disabled={togglingId === item.id}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">SKU</span>
                        <p className="font-medium">{item.sku || "—"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unit</span>
                        <p className="font-medium capitalize">{item.unit_of_measure || "Each"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost</span>
                        <p className="font-medium">${(item.unit_cost || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price</span>
                        <p className="font-medium">${(item.unit_price || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Margin</span>
                        <p className={`font-medium ${margin < 0 ? "text-destructive" : margin < 20 ? "text-yellow-600" : "text-accent"}`}>
                          {margin.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onItemAdded={fetchItems}
      />

      <EditItemDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={selectedItem}
        onItemUpdated={fetchItems}
        onDeleteClick={handleDeleteClick}
      />

      <DeleteItemDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={selectedItem}
        onItemDeleted={fetchItems}
      />
    </Layout>
  );
}
