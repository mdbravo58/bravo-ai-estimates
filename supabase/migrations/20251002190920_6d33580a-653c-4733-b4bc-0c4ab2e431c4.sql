-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'manager', 'admin', 'technician', 'sales', 'customer_service', 'hr', 'student', 'instructor');

-- Create user_roles table with proper security
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Owners can manage roles in their org"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u1
      JOIN public.users u2 ON u1.organization_id = u2.organization_id
      WHERE u1.auth_user_id = auth.uid() 
      AND u1.role = 'owner'
      AND u2.auth_user_id = user_roles.user_id
    )
  );

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL, -- 'starter', 'professional', 'enterprise'
  status TEXT NOT NULL DEFAULT 'trialing', -- 'trialing', 'active', 'past_due', 'canceled'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription limits table
CREATE TABLE public.subscription_limits (
  plan_name TEXT PRIMARY KEY,
  ai_chats_per_month INTEGER NOT NULL,
  voice_calls_per_month INTEGER NOT NULL,
  reports_per_month INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert plan limits
INSERT INTO public.subscription_limits (plan_name, ai_chats_per_month, voice_calls_per_month, reports_per_month, price_cents) VALUES
  ('starter', 500, 0, 100, 29700),
  ('professional', 1000, 200, 200, 49700),
  ('enterprise', 999999, 999999, 999999, 99700);

-- Usage tracking per organization
CREATE TABLE public.monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  month DATE NOT NULL, -- First day of month
  ai_chats_used INTEGER DEFAULT 0,
  voice_calls_used INTEGER DEFAULT 0,
  reports_generated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, month)
);

ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Owners can view their org subscription"
  ON public.subscriptions
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM public.users 
    WHERE auth_user_id = auth.uid() AND role = 'owner'
  ));

CREATE POLICY "Owners can manage their org subscription"
  ON public.subscriptions
  FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM public.users 
    WHERE auth_user_id = auth.uid() AND role = 'owner'
  ));

-- RLS for usage tracking
CREATE POLICY "Users can view their org usage"
  ON public.monthly_usage
  FOR SELECT
  USING (organization_id = get_current_user_org_id());

-- Add onboarding_completed to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_usage_updated_at
  BEFORE UPDATE ON public.monthly_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();