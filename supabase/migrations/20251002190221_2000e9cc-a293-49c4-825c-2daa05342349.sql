-- Create AI usage tracking table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  feature TEXT NOT NULL, -- 'chat', 'estimate', 'voice', 'analytics'
  model TEXT NOT NULL, -- 'gemini-2.5-flash', 'whisper-1', etc.
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly usage summary table
CREATE TABLE IF NOT EXISTS public.ai_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of the month
  feature TEXT NOT NULL,
  total_requests INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, month, feature)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_org_created ON public.ai_usage_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_summary_org_month ON public.ai_usage_summary(organization_id, month DESC);

-- Enable RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_usage_logs
CREATE POLICY "Users can view their org's AI usage logs"
  ON public.ai_usage_logs
  FOR SELECT
  USING (organization_id = get_current_user_org_id());

CREATE POLICY "System can insert AI usage logs"
  ON public.ai_usage_logs
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for ai_usage_summary
CREATE POLICY "Users can view their org's AI usage summary"
  ON public.ai_usage_summary
  FOR SELECT
  USING (organization_id = get_current_user_org_id());

CREATE POLICY "System can manage AI usage summary"
  ON public.ai_usage_summary
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to update usage summary
CREATE OR REPLACE FUNCTION update_ai_usage_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ai_usage_summary (organization_id, month, feature, total_requests, total_cost_usd)
  VALUES (
    NEW.organization_id,
    DATE_TRUNC('month', NEW.created_at)::DATE,
    NEW.feature,
    1,
    NEW.cost_usd
  )
  ON CONFLICT (organization_id, month, feature)
  DO UPDATE SET
    total_requests = ai_usage_summary.total_requests + 1,
    total_cost_usd = ai_usage_summary.total_cost_usd + NEW.cost_usd,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update summary on new log
CREATE TRIGGER trigger_update_ai_usage_summary
  AFTER INSERT ON public.ai_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_usage_summary();