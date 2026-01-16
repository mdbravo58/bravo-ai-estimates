-- Restrict AI usage tables to service_role only
-- This prevents users from manipulating their own billing/usage records

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "System can insert AI usage logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "System can manage AI usage summary" ON public.ai_usage_summary;

-- Create restrictive policies for ai_usage_logs
-- Only service_role can insert (edge functions use service role client)
CREATE POLICY "Service role can insert AI usage logs"
  ON public.ai_usage_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Users can only read their organization's logs (existing policy may cover this, but ensure it)
CREATE POLICY "Users can view org AI usage logs"
  ON public.ai_usage_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_user_id = auth.uid()
      AND u.organization_id = ai_usage_logs.organization_id
    )
  );

-- Create restrictive policies for ai_usage_summary
-- Only service_role can manage (insert/update/delete)
CREATE POLICY "Service role can manage AI usage summary"
  ON public.ai_usage_summary FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Users can only read their organization's summary
CREATE POLICY "Users can view org AI usage summary"
  ON public.ai_usage_summary FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_user_id = auth.uid()
      AND u.organization_id = ai_usage_summary.organization_id
    )
  );