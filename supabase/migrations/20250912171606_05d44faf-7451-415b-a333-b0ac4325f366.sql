-- Fix users table RLS recursion and restore functionality safely

-- Drop problematic/select policies to replace them
DROP POLICY IF EXISTS "Organization owners can manage users in their org" ON public.users;
DROP POLICY IF EXISTS "Users can view users in their organization" ON public.users;

-- Keep: "Users can view their own record" (created earlier)

-- Create SECURITY DEFINER helper to fetch the requestor's org id without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.users
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
$$;

-- Recreate safe SELECT policy using helper (no direct subquery to users in policy)
CREATE POLICY "Users can view users in their org (safe)"
ON public.users
FOR SELECT
USING (
  -- allow viewing own row OR anyone in same org
  auth_user_id = auth.uid() OR organization_id = public.get_current_user_org_id()
);

-- Keep owner management via SECURITY DEFINER function (created earlier)
-- Ensure granular policies for INSERT/UPDATE/DELETE with proper WITH CHECK clauses
CREATE POLICY "Owners can insert users in their org"
ON public.users
FOR INSERT
WITH CHECK (public.is_organization_owner(organization_id));

CREATE POLICY "Owners can update users in their org"
ON public.users
FOR UPDATE
USING (public.is_organization_owner(organization_id))
WITH CHECK (public.is_organization_owner(organization_id));

CREATE POLICY "Owners can delete users in their org"
ON public.users
FOR DELETE
USING (public.is_organization_owner(organization_id));