# Technician Update Instructions

## Problem
The technician update script failed because Row-Level Security (RLS) policies prevent the anonymous key from updating technician records. Only authenticated users who own their technician record can update it.

## Solution: Update via Supabase Dashboard

Since we cannot update technician data programmatically with the anon key, you need to update it manually via the Supabase dashboard:

### Steps:

1. **Go to Supabase Dashboard**:
   - Navigate to: https://teqncmgveqiglxnoyxch.supabase.co
   - Sign in to your Supabase account

2. **Open Table Editor**:
   - Click on "Table Editor" in the left sidebar
   - Select the `technicians` table

3. **Find John Okafor's Record**:
   - Look for the row with ID: `874f41ff-cd71-4f59-b20e-37046915f6db`
   - Or filter by email: `johnokafor@gmail.com`

4. **Update the Following Fields**:
   - `is_verified`: Change to `true`
   - `availability_status`: Change to `available`
   - `location_lat`: Set to `51.5074` (London)
   - `location_lng`: Set to `-0.1278` (London)
   - `service_radius_miles`: Set to `20`
   - `hourly_rate`: Set to `65.00`
   - `callout_fee`: Set to `45.00`

5. **Save Changes**:
   - Click "Save" or press Enter to confirm

6. **Refresh Your Application**:
   - Go back to your booking page
   - Refresh the browser
   - You should now see "John Okafor" as an available technician

## Alternative: Use Service Role Key (Advanced)

If you have access to the service role key (with full admin permissions), you can update the script to use it instead of the anon key. However, **never commit the service role key to version control** as it bypasses all RLS policies.

## RLS Policy Reference

Current RLS policy on `technicians` table (from migration):
```sql
create policy "Technicians can update their own details"
  on technicians for update
  using ( auth.uid() = id );
```

This means only the authenticated user whose `id` matches the technician record can update it.
