-- Create a demo organization with basic plan
INSERT INTO public.organizations (id, name, plan) VALUES 
  ('12345678-1234-1234-1234-123456789000', 'Demo Service Company', 'basic');

-- Create a demo user account (this will be linked when they sign up)
INSERT INTO public.users (organization_id, email, name, role) VALUES 
  ('12345678-1234-1234-1234-123456789000', 'demo@bravoservice.com', 'Demo User', 'owner');

-- Update sample data to use the demo organization
UPDATE public.customers SET organization_id = '12345678-1234-1234-1234-123456789000';
UPDATE public.cost_codes SET organization_id = '12345678-1234-1234-1234-123456789000';
UPDATE public.items SET organization_id = '12345678-1234-1234-1234-123456789000';
UPDATE public.vendors SET organization_id = '12345678-1234-1234-1234-123456789000';
UPDATE public.overhead_rules SET organization_id = '12345678-1234-1234-1234-123456789000';

-- Create some sample jobs for the demo
INSERT INTO public.jobs (organization_id, customer_id, code, name, description, address, status, start_date) VALUES 
  ('12345678-1234-1234-1234-123456789000', 
   (SELECT id FROM public.customers WHERE name = 'Johnson Residence' LIMIT 1), 
   'JOB-25001-001', 
   'Water Heater Replacement', 
   'Replace 40-gallon gas water heater and update connections',
   '123 Oak Street, Springfield, IL 62701',
   'in_progress',
   CURRENT_DATE),
  ('12345678-1234-1234-1234-123456789000', 
   (SELECT id FROM public.customers WHERE name = 'Chen Property Management' LIMIT 1), 
   'JOB-25001-002', 
   'Kitchen Plumbing Renovation', 
   'Complete kitchen plumbing renovation for rental property',
   '456 Maple Ave, Springfield, IL 62702',
   'scheduled',
   CURRENT_DATE + INTERVAL '3 days'),
  ('12345678-1234-1234-1234-123456789000', 
   (SELECT id FROM public.customers WHERE name = 'Davis Home Improvements' LIMIT 1), 
   'JOB-25001-003', 
   'Emergency Leak Repair', 
   'Emergency pipe leak repair in basement',
   '789 Pine Street, Springfield, IL 62703',
   'complete',
   CURRENT_DATE - INTERVAL '2 days');