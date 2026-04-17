-- Convert UK-specific fields to Nigerian format

-- Rename postcode to state (Nigerian addresses use states, not postcodes)
ALTER TABLE profiles 
RENAME COLUMN postcode TO state;

COMMENT ON COLUMN profiles.state IS 'Customer state for location-based services (e.g., Lagos, Abuja, Rivers)';

-- Rename service_radius_miles to service_radius_km (Nigeria uses metric system)
ALTER TABLE technicians 
RENAME COLUMN service_radius_miles TO service_radius_km;

COMMENT ON COLUMN technicians.service_radius_km IS 'Service radius in kilometers (Nigeria uses metric system)';

-- Update index name
DROP INDEX IF EXISTS idx_profiles_postcode;
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);
