-- Enable PostGIS for location features if needed (optional but good for 'location_lat/lng')
create extension if not exists postgis;

-- Create user_role enum
create type user_role as enum ('customer', 'technician', 'admin');

-- Create profiles table
create table profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text, -- Copied from auth.users for easier queries
  full_name text,
  avatar_url text,
  role user_role default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create availability_status enum
create type availability_status as enum ('available', 'limited', 'unavailable');

-- Create technicians table
create table technicians (
  id uuid references profiles(id) on delete cascade not null primary key,
  bio text,
  specializations text[], -- Array of strings e.g. ['plumbing', 'electrical']
  certifications jsonb, -- Array of objects: [{name, issuer, year}]
  years_experience integer,
  hourly_rate numeric(10,2),
  callout_fee numeric(10,2),
  service_radius_miles integer,
  is_verified boolean default false,
  availability_status availability_status default 'available',
  location_lat float,
  location_lng float,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on technicians
alter table technicians enable row level security;

-- Policies for technicians
create policy "Technician details are viewable by everyone"
  on technicians for select
  using ( true );

create policy "Technicians can update their own details"
  on technicians for update
  using ( auth.uid() = id );
  
create policy "Technicians can insert their own details"
  on technicians for insert
  with check ( auth.uid() = id );

-- Create service_category enum
create type service_category as enum ('repair', 'installation', 'maintenance');

-- Create services table
create table services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  base_price numeric(10,2) not null,
  icon_name text,
  category service_category not null,
  created_at timestamptz default now()
);

-- Enable RLS on services
alter table services enable row level security;

-- Policies for services
create policy "Services are viewable by everyone"
  on services for select
  using ( true );

-- Create booking_status enum
create type booking_status as enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create bookings table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references profiles(id) not null,
  technician_id uuid references profiles(id) not null,
  service_id uuid references services(id) not null,
  status booking_status default 'pending',
  scheduled_date timestamptz not null,
  total_amount numeric(10,2) not null,
  description text,
  address text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on bookings
alter table bookings enable row level security;

-- Policies for bookings
create policy "Users can view their own bookings"
  on bookings for select
  using ( auth.uid() = customer_id or auth.uid() = technician_id );

create policy "Customers can create bookings"
  on bookings for insert
  with check ( auth.uid() = customer_id );
  
create policy "Affected users can update bookings"
  on bookings for update
  using ( auth.uid() = customer_id or auth.uid() = technician_id );

-- Create reviews table
create table reviews (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references bookings(id) unique not null,
  technician_id uuid references profiles(id) not null,
  customer_id uuid references profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- Enable RLS on reviews
alter table reviews enable row level security;

-- Policies for reviews
create policy "Reviews are viewable by everyone"
  on reviews for select
  using ( true );

create policy "Customers can create reviews for their bookings"
  on reviews for insert
  with check ( auth.uid() = customer_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Policies for avatar storage
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );