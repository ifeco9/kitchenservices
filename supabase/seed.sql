-- Seed Data for Services Table

INSERT INTO public.services (name, slug, description, base_price, icon_name, category)
VALUES
  (
    'Oven Repair',
    'oven-repair',
    'Diagnosis and repair of electric and gas ovens. Includes thermostat replacement, heating element fix, and door seal repair.',
    85.00,
    'FireIcon',
    'repair'
  ),
  (
    'Dishwasher Maintenance',
    'dishwasher-maintenance',
    'Deep cleaning and maintenance service for dishwashers. Includes filter cleaning, spray arm check, and descaling.',
    70.00,
    'SparklesIcon',
    'maintenance'
  ),
  (
    'Washing Machine Installation',
    'washing-machine-installation',
    'Professional installation of new washing machines. Includes leveling, water connection, and initial test run.',
    90.00,
    'WrenchIcon',
    'installation'
  ),
  (
    'Refrigerator Repair',
    'refrigerator-repair',
    'Expert repair for all refrigerator brands. Fixes cooling issues, leaks, and ice maker problems.',
    95.00,
    'SnowIcon',
    'repair'
  ),
  (
    'Cooker Hood Installation',
    'cooker-hood-installation',
    'Mounting and electrical connection of cooker hoods and extractors.',
    80.00,
    'ArrowUpTrayIcon',
    'installation'
  ),
  (
    'Microwave Repair',
    'microwave-repair',
    'Safety checks and repairs for built-in and countertop microwaves.',
    60.00,
    'BoltIcon',
    'repair'
  )
ON CONFLICT (slug) DO NOTHING;

-- Seed Data for Sample Technicians

-- Create sample user profiles first
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES
  ('6f7b3b1e-1d1e-4d8e-9b1e-1d1e4d8e9b1e', 'john.technician@example.com', crypt('password123', gen_salt('bf')), NOW()),
  ('7g8c4c2f-2e2f-5e9f-0c2f-2e2f5e9f0c2f', 'sarah.technician@example.com', crypt('password123', gen_salt('bf')), NOW()),
  ('8h9d5d3g-3f3g-6f0g-1d3g-3f3g6f0g1d3g', 'mike.technician@example.com', crypt('password123', gen_salt('bf')), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert into profiles table
INSERT INTO public.profiles (id, email, full_name, role, created_at)
VALUES
  ('6f7b3b1e-1d1e-4d8e-9b1e-1d1e4d8e9b1e', 'john.technician@example.com', 'John Smith', 'technician', NOW()),
  ('7g8c4c2f-2e2f-5e9f-0c2f-2e2f5e9f0c2f', 'sarah.technician@example.com', 'Sarah Johnson', 'technician', NOW()),
  ('8h9d5d3g-3f3g-6f0g-1d3g-3f3g6f0g1d3g', 'mike.technician@example.com', 'Mike Williams', 'technician', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert into technicians table
INSERT INTO public.technicians (id, bio, specializations, certifications, years_experience, hourly_rate, callout_fee, service_radius_miles, is_verified, availability_status, location_lat, location_lng, address)
VALUES
  ('6f7b3b1e-1d1e-4d8e-9b1e-1d1e4d8e9b1e', 'Expert appliance technician with over 10 years of experience. Specializes in oven and cooker repairs.', ARRAY['Oven Repair', 'Cooker Installation', 'Range Repair'], '[{"name": "Gas Safe", "issuer": "Gas Safe Register", "verified": true}]', 10, 45.00, 35.00, 15, true, 'available', 51.5074, -0.1278, 'London, UK'),
  ('7g8c4c2f-2e2f-5e9f-0c2f-2e2f5e9f0c2f', 'Professional technician specializing in washing machines and dishwashers. Customer-focused service.', ARRAY['Washing Machine Repair', 'Dishwasher Repair', 'Laundry Appliance Service'], '[{"name": "F-Gas Certified", "issuer": "REFRIGERATION & AIR-CONDITIONING SKILLS ALLIANCE", "verified": true}]', 8, 40.00, 30.00, 20, true, 'available', 53.4808, -2.2426, 'Manchester, UK'),
  ('8h9d5d3g-3f3g-6f0g-1d3g-3f3g6f0g1d3g', 'Experienced technician with expertise in all kitchen appliances. Fast and reliable service.', ARRAY['Refrigerator Repair', 'Microwave Repair', 'All Kitchen Appliances'], '[{"name": "City & Guilds", "issuer": "NPTC", "verified": true}]', 12, 50.00, 40.00, 25, true, 'available', 52.4862, -1.8904, 'Birmingham, UK')
ON CONFLICT (id) DO NOTHING;
