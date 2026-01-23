-- Enhanced debug script to check RLS and ID matching
-- Run this in Supabase SQL Editor

-- 1. Check bookings table with all details
SELECT 
    b.id,
    b.customer_id,
    b.technician_id,
    b.status,
    b.scheduled_date,
    b.total_amount,
    p_tech.email as tech_email,
    p_tech.full_name as tech_name,
    p_tech.role as tech_role,
    t.id as technician_record_exists
FROM bookings b
LEFT JOIN profiles p_tech ON b.technician_id = p_tech.id
LEFT JOIN technicians t ON b.technician_id = t.id
ORDER BY b.created_at DESC;

-- 2. Check if technician_id matches profile id or technician table id
SELECT 
    'Profiles with technician/provider role' as check_type,
    p.id,
    p.email,
    p.role,
    CASE 
        WHEN t.id IS NOT NULL THEN 'Has technician record'
        ELSE 'NO technician record'
    END as technician_status
FROM profiles p
LEFT JOIN technicians t ON p.id = t.id
WHERE p.role IN ('technician', 'provider', 'admin')
ORDER BY p.created_at DESC;

-- 3. Check RLS policies on bookings table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings';

-- 4. Find mismatched IDs
SELECT 
    b.id as booking_id,
    b.technician_id,
    'Booking technician_id does not exist in profiles' as issue
FROM bookings b
LEFT JOIN profiles p ON b.technician_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 
    b.id as booking_id,
    b.technician_id,
    'Booking technician_id exists in profiles but not in technicians table' as issue
FROM bookings b
INNER JOIN profiles p ON b.technician_id = p.id
LEFT JOIN technicians t ON b.technician_id = t.id
WHERE t.id IS NULL;
