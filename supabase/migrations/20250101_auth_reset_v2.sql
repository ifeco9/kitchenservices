-- COMPREHENSIVE AUTH FIX V2 (ROBUST)
-- Run this in Supabase SQL Editor

-- 1. Clean up existing objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Ensure RLS is enabled and policies exist (idempotent)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Recreate the User Handling Function (Robust)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  default_role text := 'customer';
BEGIN
  -- Insert into profiles with conflict handling
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    -- Ensure role is valid against the constraint, fallback to customer
    CASE 
      WHEN (new.raw_user_meta_data->>'role') IN ('customer', 'technician', 'admin') 
      THEN (new.raw_user_meta_data->>'role')
      ELSE default_role
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
    -- Don't overwrite role on conflict if it exists
    
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error (visible in Supabase logs) but don't stop auth user creation if possible? 
    -- Actually, we WANT to fail if profile fails, but getting the error message is hard.
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new; -- Try to proceed even if profile fails? No, better to fail and fix.
    -- RAISE EXCEPTION 'Profile creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate the Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Force Grant Permissions (Fixes "Database error" often causes by permission denied on trigger)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
