-- Add GHL integration fields to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS ghl_location_id TEXT,
ADD COLUMN IF NOT EXISTS ghl_api_key_hash TEXT,
ADD COLUMN IF NOT EXISTS ghl_connected_at TIMESTAMP WITH TIME ZONE;

-- Add GHL opportunity tracking to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS ghl_opportunity_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_ghl_location ON public.organizations(ghl_location_id);
CREATE INDEX IF NOT EXISTS idx_customers_ghl_contact ON public.customers(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_jobs_ghl_opportunity ON public.jobs(ghl_opportunity_id);

-- Add unique constraint to prevent duplicate GHL contacts per org
ALTER TABLE public.customers
ADD CONSTRAINT unique_ghl_contact_per_org UNIQUE (organization_id, ghl_contact_id);