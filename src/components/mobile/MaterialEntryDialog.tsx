import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Package, Search } from "lucide-react";

interface MaterialEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string;
}

interface CostCode {
  id: string;
  code: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
  sku?: string;
  unit_cost: number;
  unit_price: number;
  unit_of_measure: string;
}

export const MaterialEntryDialog = ({ 
  open, 
  onOpenChange, 
  jobId 
}: MaterialEntryDialogProps) => {
  const [costCodes, setCostCodes] = useState<CostCode[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    cost_code_id: '',
    item_id: '',
    description: '',
    qty: '1',
    unit_cost: '',
    unit_price: '',
  });

  useEffect(() => {
    if (open) {
      fetchCostCodes();
      fetchItems();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items.slice(0, 10)); // Show first 10 items
    }
  }, [searchTerm, items]);

  const fetchCostCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('cost_codes')
        .select('*')
        .eq('type', 'material')
        .eq('active', true)
        .order('code');

      if (error) throw error;
      setCostCodes(data || []);
    } catch (error) {
      console.error('Error fetching cost codes:', error);
      toast.error('Failed to load cost codes');
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    }
  };

  const selectItem = (item: Item) => {
    setFormData(prev => ({
      ...prev,
      item_id: item.id,
      description: item.name,
      unit_cost: item.unit_cost.toString(),
      unit_price: item.unit_price.toString(),
    }));
    setSearchTerm('');
  };

  const addMaterial = async () => {
    if (!formData.cost_code_id || !formData.description || !jobId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('material_lines')
        .insert({
          job_id: jobId,
          cost_code_id: formData.cost_code_id,
          item_id: formData.item_id || null,
          description: formData.description,
          qty: parseFloat(formData.qty),
          unit_cost: parseFloat(formData.unit_cost || '0'),
          unit_price: parseFloat(formData.unit_price || '0'),
        });

      if (error) throw error;

      toast.success('Material added successfully');
      onOpenChange(false);
      
      // Reset form
      setFormData({
        cost_code_id: '',
        item_id: '',
        description: '',
        qty: '1',
        unit_cost: '',
        unit_price: '',
      });
      setSearchTerm('');
    } catch (error) {
      console.error('Error adding material:', error);
      toast.error('Failed to add material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Material</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="costCode">Cost Code *</Label>
            <Select value={formData.cost_code_id} onValueChange={(value) => setFormData(prev => ({ ...prev, cost_code_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select cost code" />
              </SelectTrigger>
              <SelectContent>
                {costCodes.map((code) => (
                  <SelectItem key={code.id} value={code.id}>
                    {code.code} - {code.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="search">Search Items</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchTerm && filteredItems.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => selectItem(item)}
                  >
                    <div className="font-medium">{item.name}</div>
                    {item.sku && (
                      <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Cost: ${item.unit_cost} | Price: ${item.unit_price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                type="number"
                step="0.01"
                value={formData.qty}
                onChange={(e) => setFormData(prev => ({ ...prev, qty: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="unit_cost">Unit Cost</Label>
              <Input
                id="unit_cost"
                type="number"
                step="0.01"
                value={formData.unit_cost}
                onChange={(e) => setFormData(prev => ({ ...prev, unit_cost: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="unit_price">Unit Price</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData(prev => ({ ...prev, unit_price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <Button 
            onClick={addMaterial} 
            disabled={loading}
            size="lg"
            className="w-full"
          >
            <Package className="h-4 w-4 mr-2" />
            {loading ? 'Adding Material...' : 'Add Material'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};