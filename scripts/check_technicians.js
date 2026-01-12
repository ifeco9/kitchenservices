
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using anon key for reading public data usually, but service role is better for debug

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTechnicians() {
    console.log('Checking technicians table...');

    const { data: technicians, error } = await supabase
        .from('technicians')
        .select(`
      *,
      profiles:id (full_name, email)
    `);

    if (error) {
        console.error('Error fetching technicians:', error);
        return;
    }

    console.log(`Found ${technicians.length} technicians.`);

    if (technicians.length === 0) {
        console.log('No technicians found in the database. You may need to create one.');
    } else {
        technicians.forEach((tech, index) => {
            console.log(`\nTechnician #${index + 1}:`);
            console.log(`  Name: ${tech.profiles?.full_name} (${tech.profiles?.email})`);
            console.log(`  ID: ${tech.id}`);
            console.log(`  Verified: ${tech.is_verified}`);
            console.log(`  Availability: ${tech.availability_status}`);
            console.log(`  Location: Lat ${tech.location_lat}, Lng ${tech.location_lng}`);
            console.log(`  Service Radius: ${tech.service_radius_miles} miles`);
            console.log(`  Specializations: ${tech.specializations}`);
        });
    }
}

checkTechnicians();
