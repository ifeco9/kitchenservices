// Debug script to test booking queries
// Run this with: node scripts/test_booking_query.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugBookings() {
    console.log('🔍 Debugging Booking Queries\n');

    // 1. Get all bookings
    console.log('1️⃣ Fetching all bookings...');
    const { data: allBookings, error: allError } = await supabase
        .from('bookings')
        .select('*');

    if (allError) {
        console.error('❌ Error fetching bookings:', allError);
    } else {
        console.log(`✅ Found ${allBookings.length} total bookings`);
        console.log('Bookings:', JSON.stringify(allBookings, null, 2));
    }

    // 2. Get all technicians/providers
    console.log('\n2️⃣ Fetching all technicians/providers...');
    const { data: techs, error: techError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .in('role', ['technician', 'provider']);

    if (techError) {
        console.error('❌ Error fetching technicians:', techError);
    } else {
        console.log(`✅ Found ${techs.length} technicians/providers`);
        techs.forEach(t => {
            console.log(`  - ${t.full_name} (${t.email}) - ID: ${t.id}`);
        });
    }

    // 3. Test the actual query used in the dashboard
    if (techs && techs.length > 0) {
        const testTechId = techs[0].id;
        console.log(`\n3️⃣ Testing dashboard query for technician: ${techs[0].full_name} (${testTechId})`);

        const { data: techBookings, error: queryError } = await supabase
            .from('bookings')
            .select('*, profiles:customer_id(full_name, avatar_url), services:service_id(name)')
            .eq('technician_id', testTechId)
            .order('scheduled_date', { ascending: true });

        if (queryError) {
            console.error('❌ Error with dashboard query:', queryError);
        } else {
            console.log(`✅ Dashboard query returned ${techBookings.length} bookings`);
            if (techBookings.length > 0) {
                console.log('Bookings:', JSON.stringify(techBookings, null, 2));
            } else {
                console.log('⚠️ No bookings found for this technician');

                // Check if there are bookings with this ID
                const { data: directCheck } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('technician_id', testTechId);

                console.log(`Direct check: ${directCheck?.length || 0} bookings with technician_id = ${testTechId}`);
            }
        }
    }

    // 4. Check for ID mismatches
    console.log('\n4️⃣ Checking for potential ID mismatches...');
    if (allBookings && techs) {
        const techIds = new Set(techs.map(t => t.id));
        const orphanedBookings = allBookings.filter(b => !techIds.has(b.technician_id));

        if (orphanedBookings.length > 0) {
            console.log(`⚠️ Found ${orphanedBookings.length} bookings with invalid technician_id:`);
            orphanedBookings.forEach(b => {
                console.log(`  - Booking ${b.id}: technician_id = ${b.technician_id} (doesn't exist in profiles)`);
            });
        } else {
            console.log('✅ All bookings have valid technician_ids');
        }
    }

    console.log('\n✅ Debug complete!');
}

debugBookings().catch(console.error);
