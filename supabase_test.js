require('dotenv').config({ path: './.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL in environment variables');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test by trying to query the profiles table (should return empty array or error if table doesn't exist yet)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist yet
        console.log('✅ Connection successful! (Table does not exist yet, which is expected)');
        console.log('This means your Supabase credentials are correct.');
        console.log('Run the database migrations to create the tables.');
      } else {
        console.log('❌ Connection failed with error:', error.message);
      }
    } else {
      console.log('✅ Connection successful! Found profiles table.');
      console.log('Sample data:', data);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();