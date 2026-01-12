-- Add customer profile fields to profiles table
-- This migration adds optional fields for customer-specific data

-- Create enum for preferred contact method
DO $$ BEGIN
    CREATE TYPE preferred_contact_method AS ENUM ('email', 'phone');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS postcode text,
ADD COLUMN IF NOT EXISTS preferred_contact preferred_contact_method DEFAULT 'email';

-- Add index on postcode for potential location-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_postcode ON profiles(postcode);

-- Add comment for documentation
COMMENT ON COLUMN profiles.phone IS 'Customer phone number for contact';
COMMENT ON COLUMN profiles.address IS 'Customer street address';
COMMENT ON COLUMN profiles.city IS 'Customer city';
COMMENT ON COLUMN profiles.postcode IS 'Customer postcode for location-based services';
COMMENT ON COLUMN profiles.preferred_contact IS 'Preferred method of contact (email or phone)';
