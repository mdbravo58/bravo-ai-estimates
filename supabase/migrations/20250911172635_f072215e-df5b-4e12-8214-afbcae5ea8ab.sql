-- Job Costing Module Database Schema

-- Create enum types
CREATE TYPE job_status AS ENUM ('estimate', 'scheduled', 'in_progress', 'hold', 'complete', 'invoiced');
CREATE TYPE cost_code_type AS ENUM ('labor', 'material', 'subcontract', 'equipment', 'fee', 'overhead');
CREATE TYPE overhead_method AS ENUM ('percent_of_labor', 'percent_of_direct_cost', 'flat_per_hour');
CREATE TYPE time_entry_source AS ENUM ('mobile', 'admin');
CREATE TYPE invoice_method AS ENUM ('fixed', 't_and_m', 'progress', 'milestone');
CREATE TYPE integration_provider AS ENUM ('ghl', 'quickbooks', 'xero');

-- Customers table (linked to GHL contacts)
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  ghl_contact_id TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  status job_status NOT NULL DEFAULT 'estimate',
  start_date DATE,
  end_date DATE,
  project_manager_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, code)
);

-- Cost codes table
CREATE TABLE public.cost_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type cost_code_type NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, code)
);

-- Job budgets table
CREATE TABLE public.job_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  cost_code_id UUID NOT NULL REFERENCES public.cost_codes(id),
  qty_budget DECIMAL(10,2) DEFAULT 0,
  unit_cost_budget DECIMAL(10,2) DEFAULT 0,
  unit_price_budget DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, cost_code_id)
);

-- Time entries table
CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id),
  user_id UUID NOT NULL,
  cost_code_id UUID NOT NULL REFERENCES public.cost_codes(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  hours DECIMAL(5,2),
  burden_rate DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  source time_entry_source NOT NULL DEFAULT 'mobile',
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Items/materials catalog table
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  sku TEXT,
  name TEXT NOT NULL,
  description TEXT,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  unit_price DECIMAL(10,2) DEFAULT 0,
  unit_of_measure TEXT DEFAULT 'each',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Material lines table
CREATE TABLE public.material_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id),
  cost_code_id UUID NOT NULL REFERENCES public.cost_codes(id),
  item_id UUID REFERENCES public.items(id),
  vendor_id UUID REFERENCES public.vendors(id),
  description TEXT NOT NULL,
  qty DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  receipt_url TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subcontracts table
CREATE TABLE public.subcontracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  cost_code_id UUID NOT NULL REFERENCES public.cost_codes(id),
  po_number TEXT,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor bills table
CREATE TABLE public.vendor_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  bill_number TEXT,
  amount DECIMAL(10,2) NOT NULL,
  bill_date DATE NOT NULL,
  attachment_url TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Overhead rules table
CREATE TABLE public.overhead_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  method overhead_method NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id),
  invoice_number TEXT,
  qb_invoice_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  invoice_date DATE NOT NULL,
  method invoice_method NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcontracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overhead_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organization-based access
CREATE POLICY "Users can view data in their organization" ON public.customers FOR SELECT USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can manage data in their organization" ON public.customers FOR ALL USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager')));

CREATE POLICY "Users can view jobs in their organization" ON public.jobs FOR SELECT USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can manage jobs in their organization" ON public.jobs FOR ALL USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager')));

CREATE POLICY "Users can view cost codes in their organization" ON public.cost_codes FOR SELECT USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can manage cost codes in their organization" ON public.cost_codes FOR ALL USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager')));

CREATE POLICY "Users can view job budgets in their organization" ON public.job_budgets FOR SELECT USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can manage job budgets in their organization" ON public.job_budgets FOR ALL USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager'))));

CREATE POLICY "Users can view time entries in their organization" ON public.time_entries FOR SELECT USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can create their own time entries" ON public.time_entries FOR INSERT WITH CHECK (user_id = auth.uid() AND job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can update their own time entries" ON public.time_entries FOR UPDATE USING (user_id = auth.uid() OR job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager'))));

CREATE POLICY "Users can view vendors in their organization" ON public.vendors FOR SELECT USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can manage vendors in their organization" ON public.vendors FOR ALL USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager')));

CREATE POLICY "Users can view items in their organization" ON public.items FOR SELECT USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can manage items in their organization" ON public.items FOR ALL USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager')));

CREATE POLICY "Users can view material lines in their organization" ON public.material_lines FOR SELECT USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can manage material lines in their organization" ON public.material_lines FOR ALL USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));

CREATE POLICY "Users can view subcontracts in their organization" ON public.subcontracts FOR SELECT USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can manage subcontracts in their organization" ON public.subcontracts FOR ALL USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager'))));

CREATE POLICY "Users can view vendor bills in their organization" ON public.vendor_bills FOR SELECT USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can manage vendor bills in their organization" ON public.vendor_bills FOR ALL USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager'))));

CREATE POLICY "Users can view overhead rules in their organization" ON public.overhead_rules FOR SELECT USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can manage overhead rules in their organization" ON public.overhead_rules FOR ALL USING (organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager')));

CREATE POLICY "Users can view invoices in their organization" ON public.invoices FOR SELECT USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can manage invoices in their organization" ON public.invoices FOR ALL USING (job_id IN (SELECT jobs.id FROM jobs WHERE jobs.organization_id IN (SELECT users.organization_id FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('owner', 'manager'))));

-- Create indexes for better performance
CREATE INDEX idx_customers_organization_id ON public.customers(organization_id);
CREATE INDEX idx_jobs_organization_id ON public.jobs(organization_id);
CREATE INDEX idx_jobs_customer_id ON public.jobs(customer_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_cost_codes_organization_id ON public.cost_codes(organization_id);
CREATE INDEX idx_time_entries_job_id ON public.time_entries(job_id);
CREATE INDEX idx_time_entries_user_id ON public.time_entries(user_id);
CREATE INDEX idx_material_lines_job_id ON public.material_lines(job_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_budgets_updated_at BEFORE UPDATE ON public.job_budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_material_lines_updated_at BEFORE UPDATE ON public.material_lines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subcontracts_updated_at BEFORE UPDATE ON public.subcontracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_bills_updated_at BEFORE UPDATE ON public.vendor_bills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_overhead_rules_updated_at BEFORE UPDATE ON public.overhead_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default cost codes for plumbing business
INSERT INTO public.cost_codes (organization_id, code, name, type) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'LAB-PLUM', 'Labor - Plumbing', 'labor'),
  ('00000000-0000-0000-0000-000000000000', 'MAT-WH', 'Materials - Water Heater', 'material'),
  ('00000000-0000-0000-0000-000000000000', 'SUB-PERMIT', 'Permit/Inspection', 'subcontract'),
  ('00000000-0000-0000-0000-000000000000', 'EQ-RNT', 'Equipment Rental', 'equipment'),
  ('00000000-0000-0000-0000-000000000000', 'FEE-DISP', 'Disposal Fee', 'fee'),
  ('00000000-0000-0000-0000-000000000000', 'OH-ALLOC', 'Allocated Overhead', 'overhead');