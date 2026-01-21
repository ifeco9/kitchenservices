-- Add 'provider' to user_role enum
-- This migration fixes the schema mismatch where the app uses 'provider' role
-- but the database enum only has 'customer', 'technician', 'admin'

-- Add 'provider' as a valid role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'provider';

-- Note: In PostgreSQL, you cannot remove enum values easily
-- The 'provider' role is now equivalent to 'technician' in functionality
-- Both can manage services, availability, and bookings
