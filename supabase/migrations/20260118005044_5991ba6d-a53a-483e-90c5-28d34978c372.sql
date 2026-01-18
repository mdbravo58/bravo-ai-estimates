-- Add new columns to invoices table for full functionality
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id),
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id);

-- Create index for organization filtering
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON public.invoices(organization_id);

-- Create index for due date queries (overdue tracking)
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);

-- Create index for customer lookups
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);

-- Update RLS policies for invoices to use organization_id
DROP POLICY IF EXISTS "Users can view invoices in their organization" ON public.invoices;
DROP POLICY IF EXISTS "Users can create invoices in their organization" ON public.invoices;
DROP POLICY IF EXISTS "Users can update invoices in their organization" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete invoices in their organization" ON public.invoices;

-- Enable RLS if not already enabled
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies
CREATE POLICY "Users can view invoices in their organization" 
ON public.invoices 
FOR SELECT 
USING (organization_id = get_current_user_org_id());

CREATE POLICY "Users can create invoices in their organization" 
ON public.invoices 
FOR INSERT 
WITH CHECK (organization_id = get_current_user_org_id());

CREATE POLICY "Users can update invoices in their organization" 
ON public.invoices 
FOR UPDATE 
USING (organization_id = get_current_user_org_id());

CREATE POLICY "Users can delete invoices in their organization" 
ON public.invoices 
FOR DELETE 
USING (organization_id = get_current_user_org_id());