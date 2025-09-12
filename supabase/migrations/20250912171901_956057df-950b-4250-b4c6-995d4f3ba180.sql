-- Simplify users RLS to eliminate recursion and restore app functionality
-- Drop any users-table policies that reference helper functions or subqueries
DROP POLICY IF EXISTS "Users can view users in their org (safe)" ON public.users;
DROP POLICY IF EXISTS "Organization owners can manage users in their org" ON public.users;
DROP POLICY IF EXISTS "Owners can insert users in their org" ON public.users;
DROP POLICY IF EXISTS "Owners can update users in their org" ON public.users;
DROP POLICY IF EXISTS "Owners can delete users in their org" ON public.users;

-- Optional: drop helper functions that query users to avoid future recursion
DROP FUNCTION IF EXISTS public.is_organization_owner(uuid);
DROP FUNCTION IF EXISTS public.get_current_user_org_id();

-- Ensure minimal, safe policies are present
-- Keep: Users can view their own record
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can view their own record'
  ) THEN
    CREATE POLICY "Users can view their own record" 
    ON public.users 
    FOR SELECT 
    USING (auth_user_id = auth.uid());
  END IF;
END $$;

-- Allow users to update ONLY their own record
CREATE POLICY IF NOT EXISTS "Users can update their own record"
ON public.users
FOR UPDATE
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());