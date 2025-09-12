-- Create demo organization with correct plan value
INSERT INTO public.organizations (id, name, plan, external_ref)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Bravo Service Demo',
  'basic',
  'demo-org-001'
) ON CONFLICT (id) DO NOTHING;

-- Create demo customers
INSERT INTO public.customers (id, organization_id, name, email, phone, address, ghl_contact_id)
VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174001',
    '123e4567-e89b-12d3-a456-426614174000',
    'Sarah Johnson',
    'sarah.johnson@example.com',
    '(555) 123-4567',
    '123 Oak Street, Springfield, IL 62701',
    'ghl_001'
  ),
  (
    '123e4567-e89b-12d3-a456-426614174002',
    '123e4567-e89b-12d3-a456-426614174000',
    'Mike Wilson',
    'mike.wilson@example.com',
    '(555) 234-5678',
    '456 Pine Avenue, Springfield, IL 62702',
    'ghl_002'
  )
ON CONFLICT (id) DO NOTHING;

-- Create demo jobs
INSERT INTO public.jobs (id, organization_id, customer_id, code, name, description, status, start_date, end_date, address)
VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174010',
    '123e4567-e89b-12d3-a456-426614174000',
    '123e4567-e89b-12d3-a456-426614174001',
    'JOB-2024-001',
    'Kitchen Plumbing Installation',
    'Complete kitchen plumbing upgrade including new fixtures and disposal unit',
    'in_progress',
    '2024-01-15',
    '2024-01-18',
    '123 Oak Street, Springfield, IL 62701'
  ),
  (
    '123e4567-e89b-12d3-a456-426614174011',
    '123e4567-e89b-12d3-a456-426614174000',
    '123e4567-e89b-12d3-a456-426614174002',
    'JOB-2024-002',
    'Bathroom Renovation',
    'Full bathroom renovation with new fixtures and tiling',
    'scheduled',
    '2024-01-20',
    '2024-01-25',
    '456 Pine Avenue, Springfield, IL 62702'
  )
ON CONFLICT (id) DO NOTHING;