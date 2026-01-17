-- Add team-related columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES public.users(id);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS invite_accepted_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS job_title TEXT;

-- Create team invites table for secure invitations
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'technician',
  job_title TEXT,
  hourly_rate NUMERIC DEFAULT 0,
  invited_by UUID REFERENCES public.users(id),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for team_invites
CREATE INDEX IF NOT EXISTS idx_team_invites_org ON public.team_invites(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_token ON public.team_invites(token);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON public.team_invites(email);

-- Enable RLS on team_invites
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_invites
CREATE POLICY "Users can view invites for their organization"
ON public.team_invites FOR SELECT
USING (organization_id = get_current_user_org_id());

CREATE POLICY "Owners and managers can create invites"
ON public.team_invites FOR INSERT
WITH CHECK (
  organization_id = get_current_user_org_id()
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_user_id = auth.uid()
    AND role IN ('owner', 'manager', 'admin')
  )
);

CREATE POLICY "Owners and managers can update invites"
ON public.team_invites FOR UPDATE
USING (
  organization_id = get_current_user_org_id()
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_user_id = auth.uid()
    AND role IN ('owner', 'manager', 'admin')
  )
);

CREATE POLICY "Owners and managers can delete invites"
ON public.team_invites FOR DELETE
USING (
  organization_id = get_current_user_org_id()
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_user_id = auth.uid()
    AND role IN ('owner', 'manager', 'admin')
  )
);