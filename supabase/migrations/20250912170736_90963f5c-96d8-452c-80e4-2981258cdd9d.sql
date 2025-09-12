-- Create demo user (will be linked to auth user after signup)
INSERT INTO public.users (id, auth_user_id, email, name, role, organization_id, status)
VALUES (
  '123e4567-e89b-12d3-a456-426614174100',
  NULL,
  'demo@bravoservice.com',
  'Demo Owner',
  'owner',
  '123e4567-e89b-12d3-a456-426614174000',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Create additional demo cost codes
INSERT INTO public.cost_codes (id, organization_id, code, name, type, active)
VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174020',
    '123e4567-e89b-12d3-a456-426614174000',
    'LABOR',
    'Labor Hours',
    'labor',
    true
  ),
  (
    '123e4567-e89b-12d3-a456-426614174021',
    '123e4567-e89b-12d3-a456-426614174000',
    'MAT',
    'Materials',
    'material',
    true
  ),
  (
    '123e4567-e89b-12d3-a456-426614174022',
    '123e4567-e89b-12d3-a456-426614174000',
    'EQUIP',
    'Equipment',
    'equipment',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Create demo items/materials
INSERT INTO public.items (id, organization_id, name, description, sku, unit_cost, unit_price, unit_of_measure, active)
VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174030',
    '123e4567-e89b-12d3-a456-426614174000',
    'Kitchen Sink - Undermount',
    'Stainless steel undermount kitchen sink',
    'SINK-001',
    250.00,
    450.00,
    'each',
    true
  ),
  (
    '123e4567-e89b-12d3-a456-426614174031',
    '123e4567-e89b-12d3-a456-426614174000',
    'Garbage Disposal',
    'InSinkErator Evolution Excel 1HP',
    'DISP-001',
    280.00,
    380.00,
    'each',
    true
  ),
  (
    '123e4567-e89b-12d3-a456-426614174032',
    '123e4567-e89b-12d3-a456-426614174000',
    'Supply Lines',
    'Braided stainless steel water supply lines',
    'SUPP-001',
    35.00,
    75.00,
    'pair',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Create demo vendors
INSERT INTO public.vendors (id, organization_id, name, email, phone, address, active)
VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174040',
    '123e4567-e89b-12d3-a456-426614174000',
    'Home Depot Supply',
    'orders@homedepot.com',
    '(555) 789-0123',
    '789 Supply Street, Springfield, IL 62703',
    true
  ),
  (
    '123e4567-e89b-12d3-a456-426614174041',
    '123e4567-e89b-12d3-a456-426614174000',
    'Ferguson Plumbing',
    'sales@ferguson.com',
    '(555) 890-1234',
    '456 Trade Avenue, Springfield, IL 62704',
    true
  )
ON CONFLICT (id) DO NOTHING;