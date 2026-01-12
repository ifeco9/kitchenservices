
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTechnician() {
    console.log('Fixing technician data...');

    // Target John Okafor by ID from the previous list
    const techId = '874f41ff-cd71-4f59-b20e-37046915f6db';

    console.log(`Updating technician ${techId}...`);

    const { data, error } = await supabase
        .from('technicians')
        .update({
            is_verified: true,
            availability_status: 'available',
            location_lat: 51.5074, // London
            location_lng: -0.1278,
            service_radius_miles: 20,
            specializations: ['Oven', 'Dishwasher', 'Microwave', 'Hob'], // Array of strings
            hourly_rate: 65.00,
            callout_fee: 45.00
        })
        .eq('id', techId)
        .select();

    if (error) {
        console.error('Error updating technician:', error);
        return;
    }

    console.log('Technician updated successfully:', data);
}

fixTechnician();
