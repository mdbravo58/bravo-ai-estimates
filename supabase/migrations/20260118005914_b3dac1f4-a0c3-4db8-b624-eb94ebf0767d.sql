-- Create organization_service_types table
CREATE TABLE public.organization_service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  base_price numeric,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organization_service_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their org service types"
  ON public.organization_service_types FOR SELECT
  USING (organization_id = public.get_current_user_org_id());

CREATE POLICY "Owners and admins can insert service types"
  ON public.organization_service_types FOR INSERT
  WITH CHECK (organization_id = public.get_current_user_org_id());

CREATE POLICY "Owners and admins can update service types"
  ON public.organization_service_types FOR UPDATE
  USING (organization_id = public.get_current_user_org_id());

CREATE POLICY "Owners and admins can delete service types"
  ON public.organization_service_types FOR DELETE
  USING (organization_id = public.get_current_user_org_id());

-- Create index for performance
CREATE INDEX idx_org_service_types_org_id ON public.organization_service_types(organization_id);
CREATE INDEX idx_org_service_types_active ON public.organization_service_types(organization_id, is_active);

-- Add trigger for updated_at
CREATE TRIGGER update_organization_service_types_updated_at
  BEFORE UPDATE ON public.organization_service_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add industry column to organizations if not exists
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS industry text;

-- Function to populate default service types based on industry
CREATE OR REPLACE FUNCTION public.populate_default_service_types(p_organization_id uuid, p_industry text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Delete existing service types for this org (fresh start)
  DELETE FROM public.organization_service_types WHERE organization_id = p_organization_id;
  
  -- Insert industry-specific defaults
  CASE p_industry
    WHEN 'plumbing' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Leak Repair', 'Fix water leaks in pipes, faucets, or fixtures', 150, 1),
        (p_organization_id, 'Drain Cleaning', 'Clear clogged drains and sewer lines', 125, 2),
        (p_organization_id, 'Water Heater Installation', 'Install new water heater unit', 1200, 3),
        (p_organization_id, 'Water Heater Repair', 'Repair existing water heater', 250, 4),
        (p_organization_id, 'Faucet Replacement', 'Replace kitchen or bathroom faucets', 175, 5),
        (p_organization_id, 'Toilet Repair', 'Fix running, clogged, or leaking toilets', 125, 6),
        (p_organization_id, 'Pipe Repair', 'Repair or replace damaged pipes', 300, 7),
        (p_organization_id, 'Sewer Line Service', 'Camera inspection and sewer line repair', 450, 8),
        (p_organization_id, 'Gas Line Service', 'Gas line installation or repair', 400, 9),
        (p_organization_id, 'Emergency Plumbing', '24/7 emergency plumbing service', 200, 10);
        
    WHEN 'hvac' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'AC Installation', 'Install new air conditioning system', 3500, 1),
        (p_organization_id, 'AC Repair', 'Diagnose and repair AC issues', 175, 2),
        (p_organization_id, 'Heating System Repair', 'Repair furnace or heating system', 200, 3),
        (p_organization_id, 'Duct Cleaning', 'Clean and sanitize air ducts', 350, 4),
        (p_organization_id, 'Thermostat Installation', 'Install smart or programmable thermostat', 150, 5),
        (p_organization_id, 'Furnace Service', 'Annual furnace maintenance', 125, 6),
        (p_organization_id, 'Heat Pump Service', 'Heat pump installation or repair', 400, 7),
        (p_organization_id, 'Indoor Air Quality', 'Air quality assessment and solutions', 250, 8),
        (p_organization_id, 'Emergency HVAC', '24/7 emergency HVAC service', 250, 9);
        
    WHEN 'electrical' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Panel Upgrade', 'Upgrade electrical panel capacity', 1500, 1),
        (p_organization_id, 'Outlet Installation', 'Install new electrical outlets', 125, 2),
        (p_organization_id, 'Lighting Installation', 'Install interior or exterior lighting', 200, 3),
        (p_organization_id, 'Ceiling Fan Installation', 'Install or replace ceiling fans', 150, 4),
        (p_organization_id, 'Wiring Repair', 'Repair or replace electrical wiring', 300, 5),
        (p_organization_id, 'Generator Installation', 'Install backup generator', 2500, 6),
        (p_organization_id, 'EV Charger Installation', 'Install electric vehicle charger', 800, 7),
        (p_organization_id, 'Circuit Breaker Repair', 'Repair or replace circuit breakers', 175, 8),
        (p_organization_id, 'Emergency Electrical', '24/7 emergency electrical service', 200, 9);
        
    WHEN 'roofing' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Roof Inspection', 'Complete roof inspection and report', 150, 1),
        (p_organization_id, 'Shingle Repair', 'Repair or replace damaged shingles', 300, 2),
        (p_organization_id, 'Roof Replacement', 'Full roof replacement', 8000, 3),
        (p_organization_id, 'Leak Repair', 'Find and fix roof leaks', 400, 4),
        (p_organization_id, 'Gutter Installation', 'Install new gutter system', 1200, 5),
        (p_organization_id, 'Gutter Cleaning', 'Clean and maintain gutters', 150, 6),
        (p_organization_id, 'Skylight Installation', 'Install new skylights', 1500, 7),
        (p_organization_id, 'Storm Damage Repair', 'Emergency storm damage repair', 500, 8);
        
    WHEN 'landscaping' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Lawn Maintenance', 'Regular lawn mowing and care', 75, 1),
        (p_organization_id, 'Landscape Design', 'Custom landscape design services', 500, 2),
        (p_organization_id, 'Tree Trimming', 'Trim and shape trees', 250, 3),
        (p_organization_id, 'Tree Removal', 'Remove trees safely', 600, 4),
        (p_organization_id, 'Irrigation Installation', 'Install sprinkler system', 2500, 5),
        (p_organization_id, 'Irrigation Repair', 'Repair sprinkler system', 150, 6),
        (p_organization_id, 'Mulching', 'Apply fresh mulch to beds', 200, 7),
        (p_organization_id, 'Hardscaping', 'Patios, walkways, retaining walls', 3000, 8),
        (p_organization_id, 'Seasonal Cleanup', 'Spring or fall cleanup', 175, 9);
        
    WHEN 'painting' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Interior Painting', 'Paint interior walls and ceilings', 400, 1),
        (p_organization_id, 'Exterior Painting', 'Paint home exterior', 2500, 2),
        (p_organization_id, 'Cabinet Painting', 'Refinish kitchen cabinets', 1500, 3),
        (p_organization_id, 'Deck Staining', 'Stain and seal outdoor deck', 600, 4),
        (p_organization_id, 'Drywall Repair', 'Patch and repair drywall', 200, 5),
        (p_organization_id, 'Wallpaper Removal', 'Remove old wallpaper', 300, 6),
        (p_organization_id, 'Wallpaper Installation', 'Install new wallpaper', 400, 7),
        (p_organization_id, 'Color Consultation', 'Professional color selection', 100, 8);
        
    WHEN 'cleaning' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Regular Cleaning', 'Routine house cleaning', 150, 1),
        (p_organization_id, 'Deep Cleaning', 'Thorough deep clean service', 300, 2),
        (p_organization_id, 'Move-In/Move-Out', 'Complete cleaning for moves', 350, 3),
        (p_organization_id, 'Carpet Cleaning', 'Professional carpet cleaning', 200, 4),
        (p_organization_id, 'Window Cleaning', 'Interior and exterior windows', 175, 5),
        (p_organization_id, 'Post-Construction', 'Clean after renovation work', 400, 6),
        (p_organization_id, 'Office Cleaning', 'Commercial office cleaning', 250, 7),
        (p_organization_id, 'Pressure Washing', 'Exterior pressure washing', 225, 8);
        
    WHEN 'pest_control' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'General Pest Control', 'Treatment for common pests', 150, 1),
        (p_organization_id, 'Termite Inspection', 'Inspect for termite activity', 100, 2),
        (p_organization_id, 'Termite Treatment', 'Eliminate termite infestation', 800, 3),
        (p_organization_id, 'Rodent Control', 'Remove mice and rats', 200, 4),
        (p_organization_id, 'Bed Bug Treatment', 'Eliminate bed bugs', 500, 5),
        (p_organization_id, 'Mosquito Control', 'Yard mosquito treatment', 125, 6),
        (p_organization_id, 'Wildlife Removal', 'Humane wildlife removal', 300, 7),
        (p_organization_id, 'Quarterly Service', 'Preventive quarterly treatment', 100, 8);
        
    WHEN 'appliance_repair' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Refrigerator Repair', 'Diagnose and repair refrigerator', 175, 1),
        (p_organization_id, 'Washer Repair', 'Washing machine repair', 150, 2),
        (p_organization_id, 'Dryer Repair', 'Dryer repair and maintenance', 150, 3),
        (p_organization_id, 'Dishwasher Repair', 'Dishwasher service and repair', 125, 4),
        (p_organization_id, 'Oven/Range Repair', 'Stove and oven repair', 175, 5),
        (p_organization_id, 'Microwave Repair', 'Microwave diagnosis and repair', 100, 6),
        (p_organization_id, 'Garbage Disposal', 'Disposal repair or replacement', 125, 7),
        (p_organization_id, 'Ice Maker Repair', 'Ice maker service', 125, 8);
        
    WHEN 'general_contractor' THEN
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Kitchen Remodel', 'Full kitchen renovation', 15000, 1),
        (p_organization_id, 'Bathroom Remodel', 'Complete bathroom renovation', 8000, 2),
        (p_organization_id, 'Basement Finishing', 'Finish basement space', 20000, 3),
        (p_organization_id, 'Room Addition', 'Add new room to home', 30000, 4),
        (p_organization_id, 'Deck Construction', 'Build new outdoor deck', 5000, 5),
        (p_organization_id, 'Flooring Installation', 'Install new flooring', 3000, 6),
        (p_organization_id, 'Drywall Installation', 'Hang and finish drywall', 2000, 7),
        (p_organization_id, 'Framing', 'Structural framing work', 4000, 8),
        (p_organization_id, 'Handyman Services', 'General repairs and maintenance', 100, 9);
        
    ELSE
      -- Default general services for unrecognized industries
      INSERT INTO public.organization_service_types (organization_id, name, description, base_price, sort_order) VALUES
        (p_organization_id, 'Consultation', 'Initial consultation and assessment', 75, 1),
        (p_organization_id, 'Standard Service', 'Standard service call', 150, 2),
        (p_organization_id, 'Premium Service', 'Premium service package', 300, 3),
        (p_organization_id, 'Emergency Service', '24/7 emergency service', 250, 4),
        (p_organization_id, 'Maintenance', 'Routine maintenance service', 125, 5);
  END CASE;
END;
$$;