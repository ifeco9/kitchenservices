-- Provider Availability Table
CREATE TABLE provider_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE NOT NULL,
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(technician_id, day_of_week)
);

ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can manage their own availability"
  ON provider_availability
  USING (auth.uid() = technician_id)
  WITH CHECK (auth.uid() = technician_id);

CREATE POLICY "Availability is viewable by everyone"
  ON provider_availability FOR SELECT
  USING (true);

-- Technician Services Junction Table (for custom pricing and selection)
CREATE TABLE technician_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  custom_price NUMERIC(10,2), -- overrides base_price if set
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(technician_id, service_id)
);

ALTER TABLE technician_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can manage their own services"
  ON technician_services
  USING (auth.uid() = technician_id)
  WITH CHECK (auth.uid() = technician_id);

CREATE POLICY "Technician services are viewable by everyone"
  ON technician_services FOR SELECT
  USING (true);

-- Add rating columns to technicians
-- Note: Using IF NOT EXISTS to be safe if run multiple times, though normally migrations run once.
ALTER TABLE technicians ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0;
ALTER TABLE technicians ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Function to update technician rating
CREATE OR REPLACE FUNCTION update_technician_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_tech_id UUID;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    target_tech_id := OLD.technician_id;
  ELSE
    target_tech_id := NEW.technician_id;
  END IF;

  UPDATE technicians
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE technician_id = target_tech_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE technician_id = target_tech_id)
  WHERE id = target_tech_id;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_technician_rating();
