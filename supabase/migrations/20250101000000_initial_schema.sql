-- Consolidated Initial Schema for Kitchen Services
-- This replaces: 20240523000000_init_schema.sql, 20250101000000_kitchen_services_schema.sql,
-- 001_initial_schema.sql (empty)

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('customer', 'technician', 'admin');
CREATE TYPE availability_status AS ENUM ('available', 'limited', 'unavailable');
CREATE TYPE service_category AS ENUM ('repair', 'installation', 'maintenance');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE preferred_contact_method AS ENUM ('email', 'phone');

-- ============================================================
-- PROFILES TABLE (Extends Supabase Auth)
-- ============================================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT, -- Nigerian state (e.g., Lagos, Abuja, Rivers)
    preferred_contact preferred_contact_method DEFAULT 'email',
    role user_role DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- TECHNICIANS TABLE
-- ============================================================

CREATE TABLE public.technicians (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    bio TEXT,
    specializations TEXT[],
    certifications JSONB,
    years_experience INTEGER DEFAULT 0,
    hourly_rate NUMERIC(10,2),
    callout_fee NUMERIC(10,2),
    service_radius_km INTEGER DEFAULT 10,
    is_verified BOOLEAN DEFAULT false,
    availability_status availability_status DEFAULT 'unavailable',
    location_lat NUMERIC(10,8),
    location_lng NUMERIC(11,8),
    address TEXT,
    rating NUMERIC(3,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technician details are viewable by everyone"
    ON technicians FOR SELECT USING (true);

CREATE POLICY "Technicians can update their own details"
    ON technicians FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Technicians can insert their own details"
    ON technicians FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- PROVIDER AVAILABILITY TABLE
-- ============================================================

CREATE TABLE public.provider_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE NOT NULL,
    day_of_week TEXT NOT NULL,
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
    ON provider_availability FOR SELECT USING (true);

-- ============================================================
-- SERVICES TABLE
-- ============================================================

CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2),
    icon_name TEXT,
    category service_category NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone"
    ON services FOR SELECT USING (true);

-- ============================================================
-- TECHNICIAN SERVICES JUNCTION TABLE
-- ============================================================

CREATE TABLE public.technician_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    custom_price NUMERIC(10,2),
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
    ON technician_services FOR SELECT USING (true);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================

CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) NOT NULL,
    technician_id UUID REFERENCES technicians(id) NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    status booking_status DEFAULT 'pending',
    scheduled_date TIMESTAMPTZ NOT NULL,
    duration_hours INTEGER DEFAULT 2,
    total_amount NUMERIC(10,2) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = customer_id OR auth.uid() = technician_id);

CREATE POLICY "Customers can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Affected users can update bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = customer_id OR auth.uid() = technician_id);

-- ============================================================
-- BOOKING ITEMS TABLE (multi-service bookings)
-- ============================================================

CREATE TABLE IF NOT EXISTS booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    quantity INTEGER DEFAULT 1,
    price_at_booking NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

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

-- ============================================================
-- REVIEWS TABLE
-- ============================================================

CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
    technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES profiles(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their bookings"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- ============================================================
-- NOTIFICATIONS TABLE (real-time updates)
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET FOR AVATARS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================================
-- AUTH FUNCTIONS & TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  default_role user_role := 'customer';
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(
      (new.raw_user_meta_data->>'role')::user_role,
      default_role
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RATING TRIGGER
-- ============================================================

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

DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_technician_rating();

-- ============================================================
-- GRANT PERMISSIONS (minimal: anon only gets USAGE)
-- ============================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated, service_role;

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_technician_id ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reviews_technician_id ON reviews(technician_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_technicians_verification_status ON technicians(is_verified);
CREATE INDEX IF NOT EXISTS idx_technicians_availability_status ON technicians(availability_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
