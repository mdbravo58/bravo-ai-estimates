import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Calculator, Send, Save, Loader2, FileText, Sparkles, Download, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { STATE_TAX_RATES, getStateOptions } from "@/data/stateTaxRates";

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
  const { toast } = useToast();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(8);

  const stateOptions = getStateOptions();

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    if (stateCode && STATE_TAX_RATES[stateCode]) {
      setTaxRate(STATE_TAX_RATES[stateCode].rate);
    }
  };

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
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const generateAISuggestions = async () => {
    if (!projectInfo.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a project description to generate AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-estimate-generator', {
        body: {
          description: projectInfo.description,
          serviceType: projectInfo.serviceType || 'general',
          location: customerInfo.address || undefined,
          customerInfo: customerInfo.name ? {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address,
          } : undefined,
        },
      });

      if (error) throw error;

      if (data?.lineItems && Array.isArray(data.lineItems)) {
        const newItems: EstimateItem[] = data.lineItems.map((item: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          name: item.description || item.category || 'Item',
          description: item.category || '',
          quantity: item.quantity || 1,
          unitCost: item.unitPrice || 0,
          markup: 0,
          isLabor: (item.category?.toLowerCase().includes('labor') || item.unit?.toLowerCase().includes('hour')) ?? false,
        }));

        setItems(prev => [...prev, ...newItems]);

        toast({
          title: "AI Suggestions Generated",
          description: `Added ${newItems.length} line items from AI analysis.`,
        });
      } else {
        throw new Error('Invalid response format from AI');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Header
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("ESTIMATE", pageWidth / 2, yPos, { align: "center" });
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Bravo AI Estimates", pageWidth / 2, yPos, { align: "center" });
      yPos += 8;

      const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.setFontSize(10);
      doc.text(`Date: ${today}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      // Divider
      doc.setDrawColor(200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Customer Information
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Information", margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      if (customerInfo.name) {
        doc.text(`Name: ${customerInfo.name}`, margin, yPos);
        yPos += 5;
      }
      if (customerInfo.email) {
        doc.text(`Email: ${customerInfo.email}`, margin, yPos);
        yPos += 5;
      }
      if (customerInfo.phone) {
        doc.text(`Phone: ${customerInfo.phone}`, margin, yPos);
        yPos += 5;
      }
      if (customerInfo.address) {
        doc.text(`Address: ${customerInfo.address}`, margin, yPos);
        yPos += 5;
      }
      yPos += 10;

      // Project Details
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Project Details", margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      if (projectInfo.title) {
        doc.text(`Project: ${projectInfo.title}`, margin, yPos);
        yPos += 5;
      }
      if (projectInfo.serviceType) {
        doc.text(`Service Type: ${projectInfo.serviceType.charAt(0).toUpperCase() + projectInfo.serviceType.slice(1)}`, margin, yPos);
        yPos += 5;
      }
      if (projectInfo.description) {
        const descLines = doc.splitTextToSize(`Description: ${projectInfo.description}`, pageWidth - margin * 2);
        doc.text(descLines, margin, yPos);
        yPos += descLines.length * 5;
      }
      yPos += 10;

      // Line Items Table
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Line Items", margin, yPos);
      yPos += 10;

      // Table header
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPos - 5, pageWidth - margin * 2, 8, 'F');
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const colWidths = [60, 20, 30, 25, 30];
      const startX = margin;
      doc.text("Item", startX, yPos);
      doc.text("Qty", startX + colWidths[0], yPos);
      doc.text("Unit Cost", startX + colWidths[0] + colWidths[1], yPos);
      doc.text("Markup", startX + colWidths[0] + colWidths[1] + colWidths[2], yPos);
      doc.text("Total", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos);
      yPos += 8;

      // Table rows
      doc.setFont("helvetica", "normal");
      items.forEach((item) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        const lineTotal = calculateLineTotal(item);
        const itemName = item.name || 'Unnamed Item';
        const truncatedName = itemName.length > 30 ? itemName.substring(0, 27) + '...' : itemName;
        
        doc.text(truncatedName, startX, yPos);
        doc.text(item.quantity.toString(), startX + colWidths[0], yPos);
        doc.text(`$${item.unitCost.toFixed(2)}`, startX + colWidths[0] + colWidths[1], yPos);
        doc.text(`${item.markup}%`, startX + colWidths[0] + colWidths[1] + colWidths[2], yPos);
        doc.text(`$${lineTotal.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos);
        yPos += 6;
      });

      yPos += 10;

      // Totals
      doc.line(pageWidth - 80, yPos, pageWidth - margin, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", pageWidth - 80, yPos);
      doc.text(`$${subtotal.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
      yPos += 6;

      const taxLabel = selectedState ? `Tax (${STATE_TAX_RATES[selectedState]?.name || selectedState} ${taxRate}%):` : `Tax (${taxRate}%):`;
      doc.text(taxLabel, pageWidth - 80, yPos);
      doc.text(`$${tax.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Total:", pageWidth - 80, yPos);
      doc.text(`$${total.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
      yPos += 15;

      // Footer
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(128);
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      doc.text(`This estimate is valid until ${validUntil.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 5;
      doc.text("Thank you for your business!", pageWidth / 2, yPos, { align: "center" });

      // Show PDF in preview modal
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(pdfUrl);
      setShowPdfPreview(true);

      toast({
        title: "PDF Generated",
        description: "Preview your estimate below.",
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfPreviewUrl) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = `estimate-${customerInfo.name || 'draft'}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "PDF Downloaded",
        description: "Your estimate has been downloaded.",
      });
    }
  };

  const handleClosePdfPreview = () => {
    setShowPdfPreview(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Create Estimate
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onSave?.({ customerInfo, projectInfo, items, subtotal, taxRate, selectedState, tax, total })}>
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="hero" onClick={() => onSend?.({ customerInfo, projectInfo, items, subtotal, taxRate, selectedState, tax, total })}>
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
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="handyman">Handyman</SelectItem>
                      <SelectItem value="home-cleaning">Home Cleaning</SelectItem>
                      <SelectItem value="general-contractor">General Contractor</SelectItem>
                      <SelectItem value="roofing">Roofing</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="pest-control">Pest Control</SelectItem>
                      <SelectItem value="pool-service">Pool Service</SelectItem>
                      <SelectItem value="garage-doors">Garage Doors</SelectItem>
                      <SelectItem value="flooring">Flooring</SelectItem>
                      <SelectItem value="car-detailing">Car Detailing</SelectItem>
                      <SelectItem value="janitorial">Janitorial</SelectItem>
                      <SelectItem value="window-cleaning">Window Cleaning</SelectItem>
                      <SelectItem value="carpet-cleaning">Carpet Cleaning</SelectItem>
                      <SelectItem value="pressure-washing">Pressure Washing</SelectItem>
                      <SelectItem value="locksmith">Locksmith</SelectItem>
                      <SelectItem value="moving-services">Moving Services</SelectItem>
                      <SelectItem value="appliance-repair">Appliance Repair</SelectItem>
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
                
                {/* Tax State Selection */}
                <div className="space-y-2">
                  <Label htmlFor="tax-state" className="text-sm">Tax State</Label>
                  <Select value={selectedState} onValueChange={handleStateChange}>
                    <SelectTrigger id="tax-state" className="h-9">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {stateOptions.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Editable Tax Rate */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>Tax Rate</span>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-16 h-7 text-sm text-center"
                      />
                      <span className="ml-1 text-sm">%</span>
                    </div>
                  </div>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adjust for local city/county rates if needed
                </p>
                
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button 
                  variant="premium" 
                  className="w-full" 
                  size="lg"
                  onClick={generateAISuggestions}
                  disabled={isGeneratingAI}
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Suggestions
                    </>
                  )}
                </Button>
                <Button 
                  variant="success" 
                  className="w-full"
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Preview PDF
                    </>
                  )}
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

      {/* PDF Preview Dialog */}
      <Dialog open={showPdfPreview} onOpenChange={handleClosePdfPreview}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Estimate Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0">
            {pdfPreviewUrl && (
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full border rounded-lg"
                title="PDF Preview"
              />
            )}
          </div>
          
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleClosePdfPreview}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
