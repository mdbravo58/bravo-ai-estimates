import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calculator, Send, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EstimateItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitCost: number;
  markup: number;
  isLabor: boolean;
}

interface EstimateBuilderProps {
  onSave?: (estimate: any) => void;
  onSend?: (estimate: any) => void;
}

export function EstimateBuilder({ onSave, onSend }: EstimateBuilderProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    serviceType: "",
  });

  const [items, setItems] = useState<EstimateItem[]>([
    {
      id: "1",
      name: "Site Inspection",
      description: "Initial assessment and measurements",
      quantity: 1,
      unitCost: 150,
      markup: 0,
      isLabor: true,
    },
  ]);

  const addItem = () => {
    const newItem: EstimateItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      unitCost: 0,
      markup: 50,
      isLabor: false,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof EstimateItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateLineTotal = (item: EstimateItem) => {
    const baseTotal = item.quantity * item.unitCost;
    return baseTotal * (1 + item.markup / 100);
  };

  const subtotal = items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Create Estimate
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onSave?.({ customerInfo, projectInfo, items, subtotal, tax, total })}>
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="hero" onClick={() => onSend?.({ customerInfo, projectInfo, items, subtotal, tax, total })}>
            <Send className="h-4 w-4" />
            Send Estimate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customer-name">Name</Label>
                  <Input
                    id="customer-name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select value={projectInfo.serviceType} onValueChange={(value) => setProjectInfo({ ...projectInfo, serviceType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="roofing">Roofing</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="customer-address">Address</Label>
                <Textarea
                  id="customer-address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="123 Main St, City, State 12345"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  id="project-title"
                  value={projectInfo.title}
                  onChange={(e) => setProjectInfo({ ...projectInfo, title: e.target.value })}
                  placeholder="Kitchen Plumbing Installation"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                  placeholder="Detailed description of the work to be performed..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line Items</CardTitle>
                <Button onClick={addItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Item #{index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Item Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          placeholder="Labor, materials, etc."
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <Label>Unit Cost</Label>
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateItem(item.id, "unitCost", Number(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label>Markup %</Label>
                        <Input
                          type="number"
                          value={item.markup}
                          onChange={(e) => updateItem(item.id, "markup", Number(e.target.value))}
                          min="0"
                          step="1"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="text-right">
                          <Label className="text-sm text-muted-foreground">Line Total</Label>
                          <div className="text-lg font-semibold">
                            ${calculateLineTotal(item).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estimate Summary */}
        <div className="space-y-6">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Estimate Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button variant="premium" className="w-full" size="lg">
                  Generate AI Suggestions
                </Button>
                <Button variant="success" className="w-full">
                  Preview PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Load Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Import from Price Book
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Calculate Travel Time
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}