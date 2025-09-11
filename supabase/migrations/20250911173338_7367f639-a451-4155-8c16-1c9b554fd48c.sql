-- Create a demo organization first
INSERT INTO public.organizations (id, name, plan) VALUES 
  ('demo-org-0000-0000-0000-000000000000', 'Demo Service Company', 'premium');

-- Create a demo user account (this will be linked when they sign up)
INSERT INTO public.users (organization_id, email, name, role) VALUES 
  ('demo-org-0000-0000-0000-000000000000', 'demo@bravoservice.com', 'Demo User', 'owner');

-- Update sample data to use the demo organization
UPDATE public.customers SET organization_id = 'demo-org-0000-0000-0000-000000000000';
UPDATE public.cost_codes SET organization_id = 'demo-org-0000-0000-0000-000000000000';
UPDATE public.items SET organization_id = 'demo-org-0000-0000-0000-000000000000';
UPDATE public.vendors SET organization_id = 'demo-org-0000-0000-0000-000000000000';
UPDATE public.overhead_rules SET organization_id = 'demo-org-0000-0000-0000-000000000000';

-- Create some sample jobs for the demo
INSERT INTO public.jobs (organization_id, customer_id, code, name, description, address, status, start_date, project_manager_id) VALUES 
  ('demo-org-0000-0000-0000-000000000000', 
   (SELECT id FROM public.customers WHERE name = 'Johnson Residence' LIMIT 1), 
   'JOB-25001-001', 
   'Water Heater Replacement', 
   'Replace 40-gallon gas water heater and update connections',
   '123 Oak Street, Springfield, IL 62701',
   'in_progress',
   CURRENT_DATE,
   NULL),
  ('demo-org-0000-0000-0000-000000000000', 
   (SELECT id FROM public.customers WHERE name = 'Chen Property Management' LIMIT 1), 
   'JOB-25001-002', 
   'Kitchen Plumbing Renovation', 
   'Complete kitchen plumbing renovation for rental property',
   '456 Maple Ave, Springfield, IL 62702',
   'scheduled',
   CURRENT_DATE + INTERVAL '3 days',
   NULL),
  ('demo-org-0000-0000-0000-000000000000', 
   (SELECT id FROM public.customers WHERE name = 'Davis Home Improvements' LIMIT 1), 
   'JOB-25001-003', 
   'Emergency Leak Repair', 
   'Emergency pipe leak repair in basement',
   '789 Pine Street, Springfield, IL 62703',
   'complete',
   CURRENT_DATE - INTERVAL '2 days',
   NULL);