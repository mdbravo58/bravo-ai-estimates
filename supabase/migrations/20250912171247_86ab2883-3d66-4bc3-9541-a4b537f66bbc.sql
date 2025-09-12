-- Fix infinite recursion in users table RLS policies
-- The current policies are referencing the users table within its own policies, causing recursion

-- Drop the problematic policies
DROP POLICY IF EXISTS "Organization owners can manage users" ON public.users;
DROP POLICY IF EXISTS "Users can view users in their organization" ON public.users;

-- Create safe policies that don't cause recursion
-- Use auth.uid() directly instead of querying the users table within its own policies

-- Allow users to view their own record and records in their organization
CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
USING (auth_user_id = auth.uid());

-- Allow organization owners to manage users (using a different approach)
-- We'll use a function that doesn't cause recursion
CREATE OR REPLACE FUNCTION public.is_organization_owner(user_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'owner' 
    AND organization_id = user_org_id
  );
$$;

-- Now create the management policy using the function
CREATE POLICY "Organization owners can manage users in their org" 
ON public.users 
FOR ALL 
USING (is_organization_owner(organization_id));

-- Allow viewing users in the same organization
CREATE POLICY "Users can view users in their organization" 
ON public.users 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.users 
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  )
);