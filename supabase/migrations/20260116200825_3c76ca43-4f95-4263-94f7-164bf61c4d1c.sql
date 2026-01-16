-- Create estimates table
CREATE TABLE public.estimates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  estimate_number text NOT NULL,
  service_type text,
  description text,
  urgency text DEFAULT 'standard',
  labor_hours numeric DEFAULT 0,
  material_costs numeric DEFAULT 0,
  subtotal numeric DEFAULT 0,
  overhead numeric DEFAULT 0,
  total numeric DEFAULT 0,
  notes text,
  estimated_duration text,
  valid_until date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'declined', 'expired')),
  sent_at timestamptz,
  sent_via text,
  ghl_message_id text,
  portal_token text UNIQUE,
  viewed_at timestamptz,
  approved_at timestamptz,
  approved_package text,
  customer_name text,
  customer_email text,
  customer_phone text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create estimate line items table
CREATE TABLE public.estimate_line_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id uuid NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  description text NOT NULL,
  category text CHECK (category IN ('labor', 'material', 'equipment')),
  quantity numeric DEFAULT 1,
  unit text DEFAULT 'each',
  unit_price numeric DEFAULT 0,
  total numeric DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_line_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for estimates
CREATE POLICY "Users can view estimates in their organization"
  ON public.estimates FOR SELECT
  USING (organization_id = public.get_current_user_org_id());

CREATE POLICY "Users can create estimates in their organization"
  ON public.estimates FOR INSERT
  WITH CHECK (organization_id = public.get_current_user_org_id());

CREATE POLICY "Users can update estimates in their organization"
  ON public.estimates FOR UPDATE
  USING (organization_id = public.get_current_user_org_id());

CREATE POLICY "Users can delete estimates in their organization"
  ON public.estimates FOR DELETE
  USING (organization_id = public.get_current_user_org_id());

-- Public access for portal viewing (by token)
CREATE POLICY "Anyone can view estimates by portal token"
  ON public.estimates FOR SELECT
  USING (portal_token IS NOT NULL);

-- RLS policies for estimate line items
CREATE POLICY "Users can view line items for their estimates"
  ON public.estimate_line_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.estimates e 
    WHERE e.id = estimate_id 
    AND e.organization_id = public.get_current_user_org_id()
  ));

CREATE POLICY "Users can create line items for their estimates"
  ON public.estimate_line_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.estimates e 
    WHERE e.id = estimate_id 
    AND e.organization_id = public.get_current_user_org_id()
  ));

CREATE POLICY "Users can update line items for their estimates"
  ON public.estimate_line_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.estimates e 
    WHERE e.id = estimate_id 
    AND e.organization_id = public.get_current_user_org_id()
  ));

CREATE POLICY "Users can delete line items for their estimates"
  ON public.estimate_line_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.estimates e 
    WHERE e.id = estimate_id 
    AND e.organization_id = public.get_current_user_org_id()
  ));

-- Public access for portal viewing line items
CREATE POLICY "Anyone can view line items by estimate portal token"
  ON public.estimate_line_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.estimates e 
    WHERE e.id = estimate_id 
    AND e.portal_token IS NOT NULL
  ));

-- Create indexes
CREATE INDEX idx_estimates_organization_id ON public.estimates(organization_id);
CREATE INDEX idx_estimates_customer_id ON public.estimates(customer_id);
CREATE INDEX idx_estimates_portal_token ON public.estimates(portal_token);
CREATE INDEX idx_estimates_status ON public.estimates(status);
CREATE INDEX idx_estimate_line_items_estimate_id ON public.estimate_line_items(estimate_id);

-- Update trigger for estimates
CREATE TRIGGER update_estimates_updated_at
  BEFORE UPDATE ON public.estimates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();