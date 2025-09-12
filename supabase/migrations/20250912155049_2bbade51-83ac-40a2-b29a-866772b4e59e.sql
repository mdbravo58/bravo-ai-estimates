-- Fix critical security vulnerability in students table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can manage students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;

-- Create security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create restrictive RLS policies for students table
-- Only allow instructors, managers, and owners to view all students
CREATE POLICY "Instructors and staff can view students" 
ON public.students 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner') OR
  user_id = auth.uid()  -- Students can view their own data
);

-- Only allow instructors, managers, and owners to manage students
CREATE POLICY "Instructors and staff can manage students" 
ON public.students 
FOR ALL 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner')
);

-- Students can update their own profile data (limited fields)
CREATE POLICY "Students can update their own profile" 
ON public.students 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add role-based policies for instructors table as well for consistency
DROP POLICY IF EXISTS "Authenticated users can manage instructors" ON public.instructors;
DROP POLICY IF EXISTS "Authenticated users can view instructors" ON public.instructors;

CREATE POLICY "Staff can view instructors" 
ON public.instructors 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner') OR
  user_id = auth.uid()
);

CREATE POLICY "Managers and owners can manage instructors" 
ON public.instructors 
FOR ALL 
USING (
  public.get_current_user_role() IN ('manager', 'owner')
);

-- Instructors can update their own profile
CREATE POLICY "Instructors can update their own profile" 
ON public.instructors 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix belt_tests table security as well
DROP POLICY IF EXISTS "Authenticated users can manage belt tests" ON public.belt_tests;
DROP POLICY IF EXISTS "Authenticated users can view belt tests" ON public.belt_tests;

CREATE POLICY "Staff can view belt tests" 
ON public.belt_tests 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner')
);

CREATE POLICY "Instructors and staff can manage belt tests" 
ON public.belt_tests 
FOR ALL 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner')
);

-- Fix class_enrollments table security
DROP POLICY IF EXISTS "Authenticated users can manage enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "Authenticated users can view enrollments" ON public.class_enrollments;

CREATE POLICY "Staff can view enrollments" 
ON public.class_enrollments 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner')
);

CREATE POLICY "Staff can manage enrollments" 
ON public.class_enrollments 
FOR ALL 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner')
);

-- Fix classes table security
DROP POLICY IF EXISTS "Authenticated users can manage classes" ON public.classes;
DROP POLICY IF EXISTS "Authenticated users can view classes" ON public.classes;

CREATE POLICY "Staff can view classes" 
ON public.classes 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner')
);

CREATE POLICY "Staff can manage classes" 
ON public.classes 
FOR ALL 
USING (
  public.get_current_user_role() IN ('instructor', 'manager', 'owner')
);