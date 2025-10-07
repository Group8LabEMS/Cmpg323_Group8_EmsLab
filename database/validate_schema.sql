-- Validation script to check database schema and data integrity
-- Run this after executing the Flyway migrations

-- Check if all tables exist
SELECT 'Tables Check' as validation_type, 
       COUNT(*) as table_count,
       GROUP_CONCAT(table_name) as tables
FROM information_schema.tables 
WHERE table_schema = 'ems_lab' 
  AND table_type = 'BASE TABLE';

-- Check foreign key constraints
SELECT 'Foreign Keys Check' as validation_type,
       COUNT(*) as constraint_count
FROM information_schema.key_column_usage 
WHERE table_schema = 'ems_lab' 
  AND referenced_table_name IS NOT NULL;

-- Check data counts
SELECT 'Role Count' as validation_type, COUNT(*) as record_count FROM role;
SELECT 'User Count' as validation_type, COUNT(*) as record_count FROM user;
SELECT 'Equipment Status Count' as validation_type, COUNT(*) as record_count FROM equipment_status;
SELECT 'Equipment Type Count' as validation_type, COUNT(*) as record_count FROM equipment_type;
SELECT 'Equipment Count' as validation_type, COUNT(*) as record_count FROM equipment;
SELECT 'Booking Count' as validation_type, COUNT(*) as record_count FROM booking;
SELECT 'Maintenance Count' as validation_type, COUNT(*) as record_count FROM maintenance;
SELECT 'Audit Log Count' as validation_type, COUNT(*) as record_count FROM audit_log;

-- Check referential integrity
SELECT 'Equipment FK Check' as validation_type,
       COUNT(*) as valid_references
FROM equipment e
JOIN equipment_type et ON e.equipment_type_id = et.equipment_type_id
JOIN equipment_status es ON e.equipment_status_id = es.equipment_status_id;

SELECT 'Booking FK Check' as validation_type,
       COUNT(*) as valid_references
FROM booking b
JOIN user u ON b.user_id = u.user_id
JOIN equipment e ON b.equipment_id = e.equipment_id
JOIN booking_status bs ON b.booking_status_id = bs.booking_status_id;