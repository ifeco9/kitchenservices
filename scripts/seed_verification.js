const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or Key missing from .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const servicesData = [
    { name: 'Oven Repair', slug: 'oven-repair', description: 'Expert repair for all oven types including electric, gas, and fan ovens.', base_price: 85.00, icon_name: 'FireIcon', category: 'repair' },
    { name: 'Dishwasher Repair', slug: 'dishwasher-repair', description: 'Full diagnostics and repair for integrated and freestanding dishwashers.', base_price: 90.00, icon_name: 'SparklesIcon', category: 'repair' },
    { name: 'Refrigerator Repair', slug: 'refrigerator-repair', description: 'Repair services for fridges, freezers, and american style fridge-freezers.', base_price: 95.00, icon_name: 'SnowIcon', category: 'repair' },
    { name: 'Washing Machine Repair', slug: 'washing-machine-repair', description: 'Fixing leaks, spin cycle issues, and drum problems for all major brands.', base_price: 85.00, icon_name: 'ArrowPathIcon', category: 'repair' },
    { name: 'Dryer Repair', slug: 'dryer-repair', description: 'Safety checks and repairs for tumble dryers.', base_price: 80.00, icon_name: 'SunIcon', category: 'repair' },
    { name: 'Microwave Repair', slug: 'microwave-repair', description: 'Specialist repair for built-in and countertop microwaves.', base_price: 75.00, icon_name: 'BoltIcon', category: 'repair' },
    { name: 'Cooker Hood Repair', slug: 'cooker-hood-repair', description: 'Extraction motor and lighting repairs for cooker hoods.', base_price: 70.00, icon_name: 'CloudIcon', category: 'repair' },
    { name: 'Hob Repair', slug: 'hob-repair', description: 'Electric, induction, and ceramic hob repairs.', base_price: 80.00, icon_name: 'FireIcon', category: 'repair' },
    { name: 'Freezer Repair', slug: 'freezer-repair', description: 'Urgent repairs for chest and upright freezers.', base_price: 95.00, icon_name: 'SnowIcon', category: 'repair' },
    { name: 'Range Cooker Repair', slug: 'range-cooker-repair', description: 'Specialist attention for large range cookers.', base_price: 120.00, icon_name: 'FireIcon', category: 'repair' },
];

async function verifyAndSeed() {
    console.log('Checking services table...');

    const { count, error: countError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error checking services:', countError);
        return;
    }

    console.log(`Current service count: ${count}`);

    if (count === 0) {
        console.log('Seeding services...');
        const { data, error: insertError } = await supabase
            .from('services')
            .upsert(servicesData, { onConflict: 'slug' })
            .select();

        if (insertError) {
            console.error('Error seeding services:', insertError);
        } else {
            console.log(`Successfully seeded ${data.length} services.`);
        }
    } else {
        console.log(`Services table has ${count} entries. Listing them:`);
        const { data: currentServices, error: fetchError } = await supabase
            .from('services')
            .select('name, slug, category, icon_name');

        if (fetchError) {
            console.error('Error fetching services:', fetchError);
        } else {
            console.table(currentServices);

            // Check if we have what we need
            const oven = currentServices.find(s => s.slug === 'oven-repair');
            if (oven) {
                console.log('SUCCESS: Found "oven-repair". Database seems OK.');
            } else {
                console.warn('WARNING: "oven-repair" not found. The existing services might not be compatible with the hardcoded frontend map.');
            }
        }
    }
}

verifyAndSeed();
