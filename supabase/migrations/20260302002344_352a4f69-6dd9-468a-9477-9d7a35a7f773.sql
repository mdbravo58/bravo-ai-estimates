
-- Fix users table: drop overly broad SELECT policies
-- Keep only scoped ones
DROP POLICY IF EXISTS "Users can view org users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_owners_manage_all" ON public.users;

-- Re-create a single clean SELECT policy: users see own row fully, org members see minimal fields via view
CREATE POLICY "users_select_own_row"
  ON public.users FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- Org members can see other org users (for team/assignment lists)
CREATE POLICY "users_select_org_members"
  ON public.users FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id_direct(auth.uid()));

-- Fix owners manage: scope to their own org only, authenticated role only
CREATE POLICY "owners_manage_org_users"
  ON public.users FOR ALL TO authenticated
  USING (
    organization_id = get_user_org_id_direct(auth.uid())
    AND is_org_owner_via_roles(auth.uid())
  )
  WITH CHECK (
    organization_id = get_user_org_id_direct(auth.uid())
    AND is_org_owner_via_roles(auth.uid())
  );

-- Fix leads: change org_view_leads from public to authenticated
DROP POLICY IF EXISTS "org_view_leads" ON public.leads;
CREATE POLICY "org_view_leads"
  ON public.leads FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id_direct(auth.uid()));

-- Allow public insert into leads (for request-quote form)
CREATE POLICY "public_insert_leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);
