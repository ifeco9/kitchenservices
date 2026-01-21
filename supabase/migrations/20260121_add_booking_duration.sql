-- Add booking duration support
-- This migration adds a duration_hours field to bookings table

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 2;

COMMENT ON COLUMN bookings.duration_hours IS 'Duration of the booking in hours (default: 2)';
