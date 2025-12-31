-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (if not handled by trigger, but trigger handles it)
-- Trigger Update: specificy role from metadata if present
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'customer') -- Use metadata role or default to customer
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
