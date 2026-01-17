-- Create appointments table for GHL calendar sync
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  ghl_event_id TEXT UNIQUE,
  ghl_calendar_id TEXT,
  ghl_contact_id TEXT,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  assigned_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT,
  address TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_appointments_org_id ON public.appointments(organization_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_assigned_user ON public.appointments(assigned_user_id);
CREATE INDEX idx_appointments_ghl_event ON public.appointments(ghl_event_id);
CREATE INDEX idx_appointments_customer ON public.appointments(customer_id);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view appointments in their organization"
ON public.appointments FOR SELECT
USING (organization_id = public.get_current_user_org_id());

CREATE POLICY "Users can create appointments in their organization"
ON public.appointments FOR INSERT
WITH CHECK (organization_id = public.get_current_user_org_id());

CREATE POLICY "Users can update appointments in their organization"
ON public.appointments FOR UPDATE
USING (organization_id = public.get_current_user_org_id());

CREATE POLICY "Users can delete appointments in their organization"
ON public.appointments FOR DELETE
USING (organization_id = public.get_current_user_org_id());

-- Add trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add ghl_calendar_id to organizations table for storing default calendar
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS ghl_calendar_id TEXT;

-- Add ghl_user_id to users table for technician mapping
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ghl_user_id TEXT;