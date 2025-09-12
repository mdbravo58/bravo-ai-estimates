import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator as CalcIcon, Plus, Minus, RotateCcw } from "lucide-react";

interface CalculationItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  category: 'labor' | 'material' | 'equipment';
}

const CalculatorPage = () => {
  const [items, setItems] = useState<CalculationItem[]>([]);
  const [overheadPercent, setOverheadPercent] = useState(15);
  const [profitPercent, setProfitPercent] = useState(20);
  const [taxPercent, setTaxPercent] = useState(8.25);

  const addItem = () => {
    const newItem: CalculationItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitCost: 0,
      unitPrice: 0,
      category: 'material'
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof CalculationItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  // Calculations
  const laborCost = items
    .filter(item => item.category === 'labor')
    .reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const materialCost = items
    .filter(item => item.category === 'material')
    .reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const equipmentCost = items
    .filter(item => item.category === 'equipment')
    .reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const subtotalCost = laborCost + materialCost + equipmentCost;
  const overheadAmount = subtotalCost * (overheadPercent / 100);
  const totalCost = subtotalCost + overheadAmount;
  const profitAmount = totalCost * (profitPercent / 100);
  const subtotalPrice = totalCost + profitAmount;
  const taxAmount = subtotalPrice * (taxPercent / 100);
  const totalPrice = subtotalPrice + taxAmount;

  const marginPercent = totalPrice > 0 ? ((totalPrice - totalCost) / totalPrice * 100) : 0;

  return (
    <Layout>
      <main role="main">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Job Cost Calculator</h1>
              <p className="text-muted-foreground">Calculate accurate job costs and pricing</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button>
                Save Estimate
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Line Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Line Items</CardTitle>
                    <Button onClick={addItem} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <CalcIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No items added yet.</p>
                      <Button onClick={addItem} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Item
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="grid gap-4 md:grid-cols-6">
                            <div className="md:col-span-2">
                              <Label>Description</Label>
                              <Input
                                placeholder="Item description"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label>Category</Label>
                              <Select
                                value={item.category}
                                onValueChange={(value) => updateItem(item.id, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="labor">Labor</SelectItem>
                                  <SelectItem value="material">Material</SelectItem>
                                  <SelectItem value="equipment">Equipment</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            
                            <div>
                              <Label>Unit Cost</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitCost}
                                onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            
                            <div className="flex items-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-right">
                            <span className="font-medium">
                              Total: ${(item.quantity * item.unitCost).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Calculation Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label>Overhead %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={overheadPercent}
                        onChange={(e) => setOverheadPercent(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Profit %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={profitPercent}
                        onChange={(e) => setProfitPercent(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Tax %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Labor Cost:</span>
                    <span>${laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Cost:</span>
                    <span>${materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment Cost:</span>
                    <span>${equipmentCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Subtotal Cost:</span>
                    <span>${subtotalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overhead ({overheadPercent}%):</span>
                    <span>${overheadAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Profit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit ({profitPercent}%):</span>
                    <span>${profitAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxPercent}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Price:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-center pt-2">
                    <Badge variant="outline">
                      {marginPercent.toFixed(1)}% margin
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${profitAmount.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Expected Profit</p>
                  </div>
                  <Separator />
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Markup:</span>
                      <span>{totalCost > 0 ? ((totalPrice - totalCost) / totalCost * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CalculatorPage;