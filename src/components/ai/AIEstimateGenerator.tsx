import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  Loader2, 
  FileText, 
  DollarSign,
  Clock,
  Calendar
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EstimateLineItem {
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface GeneratedEstimate {
  estimateNumber: string;
  serviceType: string;
  urgency: string;
  lineItems: EstimateLineItem[];
  laborHours: number;
  materialCosts: number;
  subtotal: number;
  overhead: number;
  total: number;
  validUntil: string;
  notes: string;
  estimatedDuration: string;
}

export const AIEstimateGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('standard');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEstimate, setGeneratedEstimate] = useState<GeneratedEstimate | null>(null);
  const { toast } = useToast();

  const generateEstimate = async () => {
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a service description.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-estimate-generator', {
        body: {
          description: description.trim(),
          serviceType,
          location,
          urgency,
          customerInfo: {
            name: customerName,
            email: customerEmail
          }
        }
      });

      if (error) throw error;

      setGeneratedEstimate(data);
      toast({
        title: 'Success',
        description: 'AI estimate generated successfully!',
      });
    } catch (error) {
      console.error('Error generating estimate:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate estimate. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setServiceType('');
    setLocation('');
    setUrgency('standard');
    setCustomerName('');
    setCustomerEmail('');
    setGeneratedEstimate(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Estimate Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Customer Email</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Service Description *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the service needed in detail... (e.g., 'Kitchen sink is leaking, need to replace faucet and check pipes underneath')"
              className="min-h-20"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Service Type</label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="maintenance">General Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Service location"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Urgency</label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="urgent">Urgent (Same Day)</SelectItem>
                  <SelectItem value="emergency">Emergency (ASAP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={generateEstimate}
              disabled={isGenerating || !description.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate AI Estimate
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedEstimate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Estimate
              <Badge variant="secondary">{generatedEstimate.estimateNumber}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">${generatedEstimate.total.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Estimate</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-lg font-semibold">{generatedEstimate.estimatedDuration}</div>
                  <div className="text-sm text-muted-foreground">Estimated Duration</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-lg font-semibold">
                    {new Date(generatedEstimate.validUntil).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Valid Until</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Line Items:</h4>
              <div className="border rounded-lg">
                <div className="grid grid-cols-6 gap-2 p-3 bg-muted font-medium text-sm">
                  <div className="col-span-2">Description</div>
                  <div>Category</div>
                  <div>Qty</div>
                  <div>Unit Price</div>
                  <div>Total</div>
                </div>
                {generatedEstimate.lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 p-3 border-t text-sm">
                    <div className="col-span-2">{item.description}</div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div>{item.quantity} {item.unit}</div>
                    <div>${item.unitPrice.toFixed(2)}</div>
                    <div className="font-medium">${item.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${generatedEstimate.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overhead (15%):</span>
                  <span>${generatedEstimate.overhead.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total:</span>
                  <span>${generatedEstimate.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {generatedEstimate.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes & Recommendations:</h4>
                <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  {generatedEstimate.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button className="flex-1">
                Create Official Estimate
              </Button>
              <Button variant="outline">
                Send to Customer
              </Button>
              <Button variant="outline">
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};