-- Re-run without IF NOT EXISTS (Postgres doesn't support it for CREATE POLICY)

-- Ensure minimal, safe policies are present
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

-- Drop existing update policy if present, then recreate
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can update their own record'
  ) THEN
    DROP POLICY "Users can update their own record" ON public.users;
  END IF;
END $$;

CREATE POLICY "Users can update their own record"
ON public.users
FOR UPDATE
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());