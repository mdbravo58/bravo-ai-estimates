-- Insert sample customers (using placeholder organization ID)
INSERT INTO public.customers (organization_id, name, email, phone, address) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Johnson Residence', 'sarah.johnson@email.com', '(555) 123-4567', '123 Oak Street, Springfield, IL 62701'),
  ('00000000-0000-0000-0000-000000000000', 'Chen Property Management', 'mike.chen@chenpm.com', '(555) 987-6543', '456 Maple Ave, Springfield, IL 62702'),
  ('00000000-0000-0000-0000-000000000000', 'Davis Home Improvements', 'emma.davis@email.com', '(555) 456-7890', '789 Pine Street, Springfield, IL 62703');

-- Insert sample items for the catalog
INSERT INTO public.items (organization_id, sku, name, description, unit_cost, unit_price, unit_of_measure) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'WH-40-GAS', '40 Gallon Gas Water Heater', 'Residential 40-gallon natural gas water heater', 450.00, 650.00, 'each'),
  ('00000000-0000-0000-0000-000000000000', 'PIPE-CU-0.5', '1/2" Copper Pipe', 'Type L copper pipe, 1/2 inch diameter', 3.50, 5.25, 'foot'),
  ('00000000-0000-0000-0000-000000000000', 'FIT-CU-ELB', 'Copper Elbow 1/2"', 'Copper 90-degree elbow fitting', 2.25, 4.50, 'each'),
  ('00000000-0000-0000-0000-000000000000', 'VALVE-SHUT', 'Water Shut-off Valve', 'Quarter-turn ball valve', 15.00, 25.00, 'each');

-- Insert sample vendors
INSERT INTO public.vendors (organization_id, name, email, phone, address) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Springfield Plumbing Supply', 'orders@springplumbing.com', '(555) 111-2222', '100 Industrial Blvd, Springfield, IL'),
  ('00000000-0000-0000-0000-000000000000', 'Metro Electrical Wholesale', 'sales@metroelectric.com', '(555) 333-4444', '200 Commerce St, Springfield, IL');

-- Insert additional cost codes
INSERT INTO public.cost_codes (organization_id, code, name, type) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'LAB-ELEC', 'Labor - Electrical', 'labor'),
  ('00000000-0000-0000-0000-000000000000', 'LAB-HVAC', 'Labor - HVAC', 'labor'),
  ('00000000-0000-0000-0000-000000000000', 'MAT-PIPE', 'Materials - Piping', 'material'),
  ('00000000-0000-0000-0000-000000000000', 'MAT-ELEC', 'Materials - Electrical', 'material'),
  ('00000000-0000-0000-0000-000000000000', 'EQ-TRUCK', 'Equipment - Truck/Van', 'equipment'),
  ('00000000-0000-0000-0000-000000000000', 'FEE-TRIP', 'Trip Charge', 'fee');

-- Insert default overhead rule
INSERT INTO public.overhead_rules (organization_id, name, method, value) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Standard Overhead', 'percent_of_labor', 0.20);