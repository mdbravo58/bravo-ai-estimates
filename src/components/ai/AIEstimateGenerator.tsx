import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sparkles, 
  Loader2, 
  FileText, 
  DollarSign,
  Clock,
  Calendar,
  Send,
  Save,
  CheckCircle2,
  ExternalLink
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
  const [customerPhone, setCustomerPhone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedEstimate, setGeneratedEstimate] = useState<GeneratedEstimate | null>(null);
  const [savedEstimateId, setSavedEstimateId] = useState<string | null>(null);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [estimateSent, setEstimateSent] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
    setSavedEstimateId(null);
    setPortalUrl(null);
    setEstimateSent(false);

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

  const saveEstimate = async () => {
    if (!generatedEstimate || !user) {
      toast({
        title: 'Error',
        description: 'No estimate to save or not logged in.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Get user's organization
      const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData?.organization_id) {
        throw new Error('Organization not found');
      }

      // Generate unique portal token
      const portalToken = crypto.randomUUID();

      // Save estimate
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .insert({
          organization_id: userData.organization_id,
          estimate_number: generatedEstimate.estimateNumber,
          service_type: generatedEstimate.serviceType || serviceType,
          description: description,
          urgency: generatedEstimate.urgency || urgency,
          labor_hours: generatedEstimate.laborHours,
          material_costs: generatedEstimate.materialCosts,
          subtotal: generatedEstimate.subtotal,
          overhead: generatedEstimate.overhead,
          total: generatedEstimate.total,
          notes: generatedEstimate.notes,
          estimated_duration: generatedEstimate.estimatedDuration,
          valid_until: generatedEstimate.validUntil,
          status: 'draft',
          portal_token: portalToken,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          location: location,
        })
        .select()
        .single();

      if (estimateError) throw estimateError;

      // Save line items
      if (generatedEstimate.lineItems && generatedEstimate.lineItems.length > 0) {
        const lineItemsToInsert = generatedEstimate.lineItems.map((item, index) => ({
          estimate_id: estimate.id,
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unitPrice,
          total: item.total,
          sort_order: index,
        }));

        const { error: lineItemsError } = await supabase
          .from('estimate_line_items')
          .insert(lineItemsToInsert);

        if (lineItemsError) throw lineItemsError;
      }

      setSavedEstimateId(estimate.id);
      const newPortalUrl = `${window.location.origin}/estimate/${portalToken}`;
      setPortalUrl(newPortalUrl);

      toast({
        title: 'Estimate Saved!',
        description: 'The estimate has been saved to your database.',
      });
    } catch (error) {
      console.error('Error saving estimate:', error);
      toast({
        title: 'Error',
        description: 'Failed to save estimate. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const sendEstimate = async () => {
    if (!savedEstimateId) {
      toast({
        title: 'Save First',
        description: 'Please save the estimate before sending.',
        variant: 'destructive'
      });
      return;
    }

    if (!customerEmail) {
      toast({
        title: 'Email Required',
        description: 'Please provide a customer email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('ghl-send-estimate', {
        body: {
          estimateId: savedEstimateId,
          sendVia: 'email'
        }
      });

      if (error) throw error;

      setEstimateSent(true);
      if (data.portalUrl) {
        setPortalUrl(data.portalUrl);
      }

      if (data.requiresManualSend) {
        toast({
          title: 'Manual Send Required',
          description: 'GHL not configured. Copy the portal link to send manually.',
        });
      } else {
        toast({
          title: 'Estimate Sent!',
          description: 'The estimate has been sent to the customer via GoHighLevel.',
        });
      }
    } catch (error) {
      console.error('Error sending estimate:', error);
      toast({
        title: 'Error',
        description: 'Failed to send estimate. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyPortalLink = () => {
    if (portalUrl) {
      navigator.clipboard.writeText(portalUrl);
      toast({
        title: 'Link Copied!',
        description: 'Customer portal link copied to clipboard.',
      });
    }
  };

  const resetForm = () => {
    setDescription('');
    setServiceType('');
    setLocation('');
    setUrgency('standard');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setGeneratedEstimate(null);
    setSavedEstimateId(null);
    setPortalUrl(null);
    setEstimateSent(false);
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
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Customer Email *</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer email"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Customer Phone</label>
              <Input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter customer phone"
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
              {savedEstimateId && (
                <Badge variant="default" className="ml-2 bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Saved
                </Badge>
              )}
              {estimateSent && (
                <Badge variant="default" className="ml-2 bg-blue-600">
                  <Send className="h-3 w-3 mr-1" />
                  Sent
                </Badge>
              )}
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

            {/* Portal Link */}
            {portalUrl && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Customer Portal Link
                </h4>
                <div className="flex gap-2">
                  <Input 
                    value={portalUrl} 
                    readOnly 
                    className="flex-1 bg-white text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={copyPortalLink}>
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={portalUrl} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-green-700 mt-2">
                  Share this link with your customer to view and approve the estimate.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {!savedEstimateId ? (
                <Button onClick={saveEstimate} disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Estimate
                </Button>
              ) : (
                <Button 
                  onClick={sendEstimate} 
                  disabled={isSending || estimateSent || !customerEmail}
                  className="flex-1"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : estimateSent ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {estimateSent ? 'Sent to Customer' : 'Send to Customer via GHL'}
                </Button>
              )}
              <Button variant="outline" disabled>
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
