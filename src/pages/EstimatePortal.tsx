import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  Loader2,
  Phone,
  Mail,
  Calendar,
  Download,
  Shield
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EstimateLineItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

interface Estimate {
  id: string;
  estimate_number: string;
  service_type: string;
  description: string;
  urgency: string;
  labor_hours: number;
  material_costs: number;
  subtotal: number;
  overhead: number;
  total: number;
  notes: string;
  estimated_duration: string;
  valid_until: string;
  status: string;
  customer_name: string;
  customer_email: string;
  location: string;
  created_at: string;
  organization_id: string;
}

interface Organization {
  name: string;
  business_phone: string;
  business_email: string;
  logo_url: string;
}

export default function EstimatePortal() {
  const { token } = useParams<{ token: string }>();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      fetchEstimate();
    }
  }, [token]);

  const fetchEstimate = async () => {
    try {
      // Fetch estimate by portal token
      const { data: estimateData, error: estimateError } = await supabase
        .from('estimates')
        .select('*')
        .eq('portal_token', token)
        .single();

      if (estimateError || !estimateData) {
        throw new Error('Estimate not found');
      }

      setEstimate(estimateData as Estimate);

      // Mark as viewed if first time
      if (!estimateData.viewed_at) {
        await supabase
          .from('estimates')
          .update({ 
            viewed_at: new Date().toISOString(),
            status: estimateData.status === 'sent' ? 'viewed' : estimateData.status
          })
          .eq('id', estimateData.id);
      }

      // Fetch line items
      const { data: items } = await supabase
        .from('estimate_line_items')
        .select('*')
        .eq('estimate_id', estimateData.id)
        .order('sort_order');

      setLineItems((items || []) as EstimateLineItem[]);

      // Fetch organization info
      const { data: orgData } = await supabase
        .from('organizations')
        .select('name, business_phone, business_email, logo_url')
        .eq('id', estimateData.organization_id)
        .single();

      if (orgData) {
        setOrganization(orgData as Organization);
      }

    } catch (error) {
      console.error('Error fetching estimate:', error);
      toast({
        title: 'Error',
        description: 'Could not load the estimate. Please check the link.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!estimate) return;

    setApproving(true);
    try {
      const { error } = await supabase
        .from('estimates')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', estimate.id);

      if (error) throw error;

      setEstimate({ ...estimate, status: 'approved' });
      toast({
        title: 'Estimate Approved!',
        description: 'Thank you! We will be in touch shortly to schedule your service.',
      });
    } catch (error) {
      console.error('Error approving estimate:', error);
      toast({
        title: 'Error',
        description: 'Could not approve the estimate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setApproving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      draft: { label: 'Draft', variant: 'secondary' },
      sent: { label: 'Pending Review', variant: 'outline' },
      viewed: { label: 'Under Review', variant: 'default' },
      approved: { label: 'Approved', variant: 'default' },
      declined: { label: 'Declined', variant: 'destructive' },
      expired: { label: 'Expired', variant: 'secondary' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your estimate...</p>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Estimate Not Found</h2>
            <p className="text-muted-foreground">
              This estimate link may have expired or is invalid. Please contact us for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {organization?.name || 'Service Estimate'}
          </h1>
          <p className="text-muted-foreground">Professional Service Estimate</p>
        </div>

        {/* Main Estimate Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  {estimate.estimate_number}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Created on {new Date(estimate.created_at).toLocaleDateString()}
                </p>
              </div>
              {getStatusBadge(estimate.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer & Service Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Customer</h3>
                <p className="font-medium">{estimate.customer_name || 'Not specified'}</p>
                {estimate.customer_email && (
                  <p className="text-sm text-muted-foreground">{estimate.customer_email}</p>
                )}
                {estimate.location && (
                  <p className="text-sm text-muted-foreground">{estimate.location}</p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Service Details</h3>
                {estimate.service_type && (
                  <Badge variant="outline" className="capitalize">
                    {estimate.service_type}
                  </Badge>
                )}
                {estimate.estimated_duration && (
                  <p className="text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Est. Duration: {estimate.estimated_duration}
                  </p>
                )}
                {estimate.valid_until && (
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Valid until: {new Date(estimate.valid_until).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {estimate.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm">{estimate.description}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Line Items */}
            <div>
              <h3 className="font-medium mb-4">Estimate Breakdown</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium text-muted-foreground">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-center">Category</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-1 text-right">Rate</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border-t text-sm">
                    <div className="col-span-5">{item.description}</div>
                    <div className="col-span-2 text-center">
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-center">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="col-span-1 text-right">${Number(item.unit_price).toFixed(2)}</div>
                    <div className="col-span-2 text-right font-medium">${Number(item.total).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${Number(estimate.subtotal).toFixed(2)}</span>
                </div>
                {estimate.overhead > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overhead & Profit:</span>
                    <span>${Number(estimate.overhead).toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${Number(estimate.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {estimate.notes && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Notes & Recommendations</h3>
                <p className="text-sm text-blue-800">{estimate.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {estimate.status !== 'approved' && estimate.status !== 'declined' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleApprove}
                  disabled={approving}
                  className="flex-1 sm:flex-none sm:min-w-[200px]"
                >
                  {approving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Approve Estimate
                </Button>
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By approving, you agree to proceed with the services outlined above.
              </p>
            </CardContent>
          </Card>
        )}

        {estimate.status === 'approved' && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-900 mb-2">Estimate Approved!</h2>
              <p className="text-green-700">
                Thank you for your approval. We will contact you shortly to schedule your service.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-medium mb-1">Questions about this estimate?</h3>
                <p className="text-sm text-muted-foreground">
                  We're here to help. Contact us anytime.
                </p>
              </div>
              <div className="flex gap-3">
                {organization?.business_phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${organization.business_phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </a>
                  </Button>
                )}
                {organization?.business_email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${organization.business_email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email Us
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Licensed & Insured</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Satisfaction Guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>No Hidden Fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}
