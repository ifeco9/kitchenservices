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
