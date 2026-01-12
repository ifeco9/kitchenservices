INSERT INTO services (name, slug, description, base_price, duration_minutes, is_active)
VALUES
  ('Oven Repair', 'oven-repair', 'Expert repair for all oven types including electric, gas, and fan ovens.', 85.00, 60, true),
  ('Dishwasher Repair', 'dishwasher-repair', 'Full diagnostics and repair for integrated and freestanding dishwashers.', 90.00, 60, true),
  ('Refrigerator Repair', 'refrigerator-repair', 'Repair services for fridges, freezers, and american style fridge-freezers.', 95.00, 90, true),
  ('Washing Machine Repair', 'washing-machine-repair', 'Fixing leaks, spin cycle issues, and drum problems for all major brands.', 85.00, 60, true),
  ('Dryer Repair', 'dryer-repair', 'Safety checks and repairs for tumble dryers.', 80.00, 45, true),
  ('Microwave Repair', 'microwave-repair', 'Specialist repair for built-in and countertop microwaves.', 75.00, 45, true),
  ('Cooker Hood Repair', 'cooker-hood-repair', 'Extraction motor and lighting repairs for cooker hoods.', 70.00, 45, true),
  ('Hob Repair', 'hob-repair', 'Electric, induction, and ceramic hob repairs.', 80.00, 60, true),
  ('Freezer Repair', 'freezer-repair', 'Urgent repairs for chest and upright freezers.', 95.00, 60, true),
  ('Range Cooker Repair', 'range-cooker-repair', 'Specialist attention for large range cookers.', 120.00, 120, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  duration_minutes = EXCLUDED.duration_minutes,
  is_active = EXCLUDED.is_active;
