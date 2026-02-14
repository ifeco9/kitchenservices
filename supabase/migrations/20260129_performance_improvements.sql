-- Add performance indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_technician_id ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_reviews_technician_id ON reviews(technician_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);

CREATE INDEX IF NOT EXISTS idx_technicians_verification_status ON technicians(is_verified);
CREATE INDEX IF NOT EXISTS idx_technicians_availability_status ON technicians(availability_status);

-- Add location-based index for technicians (for proximity search)
-- Note: This requires the earthdistance extension
-- CREATE EXTENSION IF NOT EXISTS cube;
-- CREATE EXTENSION IF NOT EXISTS earthdistance;
-- CREATE INDEX IF NOT EXISTS idx_technicians_location ON technicians USING GIST (
--   ll_to_earth(location_lat, location_lng)
-- );

-- Create booking_items table for multi-service bookings
CREATE TABLE IF NOT EXISTS booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  price_at_booking DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on booking_items
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their booking items" ON booking_items;
DROP POLICY IF EXISTS "Customers can insert booking items" ON booking_items;
DROP POLICY IF EXISTS "Customers can update their booking items" ON booking_items;
DROP POLICY IF EXISTS "Customers can delete their booking items" ON booking_items;

-- RLS Policies for booking_items
CREATE POLICY "Users can view their booking items"
ON booking_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_items.booking_id
    AND (bookings.customer_id = auth.uid() OR bookings.technician_id = auth.uid())
  )
);

CREATE POLICY "Customers can insert booking items"
ON booking_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_items.booking_id
    AND bookings.customer_id = auth.uid()
  )
);

CREATE POLICY "Customers can update their booking items"
ON booking_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_items.booking_id
    AND bookings.customer_id = auth.uid()
  )
);

CREATE POLICY "Customers can delete their booking items"
ON booking_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_items.booking_id
    AND bookings.customer_id = auth.uid()
  )
);
