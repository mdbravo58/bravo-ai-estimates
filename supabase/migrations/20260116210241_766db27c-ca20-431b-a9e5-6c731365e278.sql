-- Fix 1: Messages table - require authentication for all access
-- The current policy allows unauthenticated users to read broadcast messages

DROP POLICY IF EXISTS "Users can view messages sent to them" ON public.messages;

CREATE POLICY "Authenticated users can view relevant messages"
  ON public.messages
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      recipient_id = auth.uid()
      OR (
        recipient_type = 'all'
        AND EXISTS (
          SELECT 1 FROM public.users
          WHERE auth_user_id = auth.uid()
          AND organization_id = messages.organization_id
        )
      )
    )
  );

-- Fix 2: AI Usage Summary - drop the overly permissive "System can manage" policy
-- The recent migration added service_role policies, but the old permissive policy may still exist

DROP POLICY IF EXISTS "System can manage AI usage summary" ON public.ai_usage_summary;