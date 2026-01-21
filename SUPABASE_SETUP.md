# Supabase Setup for Kitchen Services

## Prerequisites

1. Make sure you have Node.js installed
2. Install the Supabase CLI if not already installed:
   ```bash
   npm install -g @supabase/cli
   ```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**To get your credentials**:
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Project Settings > API
4. Copy the "Project URL" and "anon/public" API key

### 2. Database Migration

To apply the database schema to your Supabase project, follow these steps:

1. Make sure you're logged in to your Supabase CLI:
   ```bash
   supabase login
   ```

2. Link your local project to your Supabase project:
   ```bash
   supabase link --project-ref your_project_ref
   ```
   
   Replace `your_project_ref` with your actual project reference ID from the Supabase dashboard.

3. Run the database migrations:
   ```bash
   supabase db push
   ```

### 3. Alternative: Direct SQL Execution

If you prefer to run the SQL commands directly:

1. Go to your Supabase Dashboard > SQL Editor
   - Navigate to https://app.supabase.com/project/YOUR_PROJECT_ID/sql/new
2. Copy and paste the contents of `supabase/migrations/20250101000000_kitchen_services_schema.sql`
3. Click "Run" to execute the SQL commands

## Database Schema Overview

The following tables and features are included in the migration:

- **profiles**: User profiles (customers and technicians)
- **technicians**: Additional technician-specific information
- **services**: Service catalog
- **bookings**: Service booking management
- **reviews**: Customer reviews for technicians
- **Row Level Security (RLS)**: Proper access controls
- **Authentication integration**: Automatic profile creation on signup
- **provider_availability**: Technician weekly schedule
- **technician_services**: Custom service offerings and pricing for technicians
- **Storage bucket**: For user avatars

## Next Steps

After setting up the database:

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Test the authentication and database functionality in your application.

Your Kitchen Services application database is now ready to use!