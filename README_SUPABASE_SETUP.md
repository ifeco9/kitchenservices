# Kitchen Services - Supabase Database Setup

## Overview

This document provides instructions for setting up the Supabase database for the Kitchen Services application. The database schema includes tables for user profiles, technicians, services, bookings, and reviews with appropriate security policies.

## Prerequisites

Before setting up the database, ensure you have:

1. **Node.js** installed on your system
2. **Supabase CLI** installed globally:
   ```bash
   npm install -g @supabase/cli
   ```

## Environment Configuration

To configure your environment variables:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public API key

**To find your credentials**:
1. Visit your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Project Settings > API
4. Copy the "Project URL" and "anon/public" key

## Database Schema

The migration file `supabase/migrations/20250101000000_kitchen_services_schema.sql` contains:

1. **Custom Types**:
   - `user_role`: enum ('customer', 'technician', 'admin')
   - `availability_status`: enum ('available', 'limited', 'unavailable')
   - `service_category`: enum ('repair', 'installation', 'maintenance')
   - `booking_status`: enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')

2. **Tables**:
   - `profiles`: User profiles with email, name, role, etc.
   - `technicians`: Technician-specific details (bio, specializations, rates, etc.)
   - `services`: Service catalog with pricing and categories
   - `bookings`: Service booking records
   - `reviews`: Customer reviews for technicians

3. **Features**:
   - Row Level Security (RLS) policies for data protection
   - Authentication integration with automatic profile creation
   - Storage bucket for user avatars

## Setup Steps

### Option 1: Using Supabase CLI (Recommended)

1. **Login to Supabase** (if not already logged in):
   ```bash
   supabase login
   ```

2. **Link your project**:
   ```bash
   supabase link --project-ref teqncmgveqiglxnoyxch
   ```

3. **Run the database migrations**:
   ```bash
   supabase db push
   ```

### Option 2: Manual SQL Execution

1. Go to your [Supabase Dashboard](https://app.supabase.com/project/teqncmgveqiglxnoyxch/sql/new)
2. Copy the contents of `supabase/migrations/20250101000000_kitchen_services_schema.sql`
3. Paste and execute the SQL commands in the SQL Editor

## Verification

After running the migrations, you can verify the setup by:

1. Checking the Database section in your Supabase dashboard
2. Confirming that all tables (profiles, technicians, services, bookings, reviews) have been created
3. Verifying that Row Level Security is enabled on all tables
4. Testing the authentication flow in your application

## Next Steps

Once the database is set up:

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Test the authentication flow in your application
3. Verify that user registration and profile creation work properly

## Troubleshooting

- If you encounter connection issues, verify that your environment variables are correctly set
- If RLS policies prevent access, check the policy definitions in the migration file
- For authentication issues, ensure the auth trigger is properly set up

Your Kitchen Services application database is now ready to use!