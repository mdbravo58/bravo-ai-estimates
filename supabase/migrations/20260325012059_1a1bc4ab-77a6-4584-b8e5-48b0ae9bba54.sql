-- 1. Fix estimates portal token policy: require token value match via header
DROP POLICY IF EXISTS "Anyone can view estimates by portal token" ON public.estimates;
CREATE POLICY "Anyone can view estimates by portal token"
  ON public.estimates FOR SELECT
  TO public
  USING (
    portal_token IS NOT NULL 
    AND portal_token = current_setting('request.headers', true)::json->>'x-portal-token'
  );

-- 2. Fix estimate_line_items portal token policy
DROP POLICY IF EXISTS "Anyone can view line items by estimate portal token" ON public.estimate_line_items;
CREATE POLICY "Anyone can view line items by estimate portal token"
  ON public.estimate_line_items FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM estimates e
      WHERE e.id = estimate_line_items.estimate_id
        AND e.portal_token IS NOT NULL
        AND e.portal_token = current_setting('request.headers', true)::json->>'x-portal-token'
    )
  );

-- 3. Fix promotion_eligibility: restrict to authenticated staff only
DROP POLICY IF EXISTS "system_manage_eligibility" ON public.promotion_eligibility;
CREATE POLICY "staff_manage_eligibility"
  ON public.promotion_eligibility FOR ALL
  TO authenticated
  USING (
    user_has_role(auth.uid(), 'owner'::app_role) 
    OR user_has_role(auth.uid(), 'instructor'::app_role)
  )
  WITH CHECK (
    user_has_role(auth.uid(), 'owner'::app_role) 
    OR user_has_role(auth.uid(), 'instructor'::app_role)
  );

-- 4. Fix leads public insert: require valid org_id
DROP POLICY IF EXISTS "public_insert_leads" ON public.leads;
CREATE POLICY "public_insert_leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    organization_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.organizations WHERE id = organization_id
    )
  );

-- 5. Fix GHL credential audit: restrict to authenticated users in the org
DROP POLICY IF EXISTS "System can insert GHL credential audit logs" ON public.ghl_credential_audit;
CREATE POLICY "Authenticated users can insert GHL credential audit logs"
  ON public.ghl_credential_audit FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id = get_current_user_org_id()
  );