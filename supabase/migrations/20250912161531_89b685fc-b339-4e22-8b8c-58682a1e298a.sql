-- Fix critical security vulnerability in customers table
-- The current policies are too permissive - all users in organization can view customer data
-- We need to restrict access to only roles that need customer information

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view data in their organization" ON public.customers;
DROP POLICY IF EXISTS "Users can manage data in their organization" ON public.customers;

-- Create more restrictive RLS policies for customers table
-- Only allow owners, managers, and sales roles to view customer data
CREATE POLICY "Only authorized roles can view customers" 
ON public.customers 
FOR SELECT 
USING (
  organization_id IN (
    SELECT users.organization_id
    FROM users
    WHERE users.auth_user_id = auth.uid() 
    AND users.role IN ('owner', 'manager', 'sales', 'admin')
  )
);

-- Only allow owners and managers to manage customer data
CREATE POLICY "Only senior roles can manage customers" 
ON public.customers 
FOR ALL 
USING (
  organization_id IN (
    SELECT users.organization_id
    FROM users
    WHERE users.auth_user_id = auth.uid() 
    AND users.role IN ('owner', 'manager')
  )
);

-- Create a separate policy for customer service roles to update customer info
CREATE POLICY "Customer service can update customer data" 
ON public.customers 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT users.organization_id
    FROM users
    WHERE users.auth_user_id = auth.uid() 
    AND users.role IN ('owner', 'manager', 'customer_service', 'admin')
  )
);

-- Ensure related tables follow similar security patterns
-- Update jobs table to ensure customer-related job data is also protected
DROP POLICY IF EXISTS "Users can view jobs in their organization" ON public.jobs;
DROP POLICY IF EXISTS "Users can manage jobs in their organization" ON public.jobs;

CREATE POLICY "Only authorized roles can view jobs" 
ON public.jobs 
FOR SELECT 
USING (
  organization_id IN (
    SELECT users.organization_id
    FROM users
    WHERE users.auth_user_id = auth.uid() 
    AND users.role IN ('owner', 'manager', 'technician', 'sales', 'admin')
  )
);

CREATE POLICY "Only senior roles can manage jobs" 
ON public.jobs 
FOR ALL 
USING (
  organization_id IN (
    SELECT users.organization_id
    FROM users
    WHERE users.auth_user_id = auth.uid() 
    AND users.role IN ('owner', 'manager')
  )
);