import { supabase } from '@/lib/supabaseClient';

export const seedServices = async () => {
    const services = [
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

    const results = [];

    for (const service of services) {
        const { data, error } = await supabase
            .from('services')
            .upsert(service, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error(`Error seeding ${service.name}:`, error);
            results.push({ name: service.name, status: 'error', error: error.message });
        } else {
            results.push({ name: service.name, status: 'success' });
        }
    }

    return results;
};
