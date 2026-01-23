-- Debug script to check booking data
-- Run this in Supabase SQL Editor to diagnose booking display issues

-- 1. Check all bookings
SELECT 
    b.id,
    b.customer_id,
    b.technician_id,
    b.service_id,
    b.status,
    b.scheduled_date,
    b.total_amount,
    p_customer.full_name as customer_name,
    p_tech.full_name as technician_name,
    s.name as service_name
FROM bookings b
LEFT JOIN profiles p_customer ON b.customer_id = p_customer.id
LEFT JOIN profiles p_tech ON b.technician_id = p_tech.id
LEFT JOIN services s ON b.service_id = s.id
ORDER BY b.created_at DESC;

-- 2. Check technician profiles
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    t.id as technician_record_id
FROM profiles p
LEFT JOIN technicians t ON p.id = t.id
WHERE p.role IN ('technician', 'provider')
ORDER BY p.created_at DESC;

-- 3. Check if technician_id in bookings matches profile id
SELECT 
    b.technician_id,
    COUNT(*) as booking_count,
    p.full_name,
    p.role
FROM bookings b
LEFT JOIN profiles p ON b.technician_id = p.id
GROUP BY b.technician_id, p.full_name, p.role;

-- 4. Check for orphaned bookings (technician_id doesn't exist in profiles)
SELECT 
    b.*
FROM bookings b
LEFT JOIN profiles p ON b.technician_id = p.id
WHERE p.id IS NULL;
