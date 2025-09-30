-- Synthetic data for normalized EMS Lab database
-- This script inserts at least 5 records per table

-- We're assuming the lookup tables have already been populated with the basic values
-- from the create_tables scripts, but we'll add a couple more for completeness

-- Additional Equipment Status values
INSERT INTO `equipment_status` (`name`, `description`) VALUES 
('Decommissioned', 'Equipment is permanently removed from service'),
('On Loan', 'Equipment is loaned to another department');

-- Additional Equipment Type values
INSERT INTO `equipment_type` (`name`, `description`) VALUES 
('Computer', 'Desktop or laptop computer'),
('Audio Visual', 'Projectors, screens, and other AV equipment'),
('Network', 'Network and connectivity equipment'),
('Measuring Device', 'Measurement and testing equipment');

-- Insert User data
INSERT INTO `user` (`sso_id`, `display_name`, `email`, `created_at`) VALUES 
('sso_12345', 'John Smith', 'john.smith@university.edu', '2024-01-15 08:30:00'),
('sso_23456', 'Sarah Johnson', 'sarah.johnson@university.edu', '2024-01-20 09:15:00'),
('sso_34567', 'Michael Brown', 'michael.brown@university.edu', '2024-02-10 10:45:00'),
('sso_45678', 'Emily Davis', 'emily.davis@university.edu', '2024-02-25 14:20:00'),
('sso_56789', 'David Wilson', 'david.wilson@university.edu', '2024-03-05 11:30:00'),
('sso_67890', 'Jessica Taylor', 'jessica.taylor@university.edu', '2024-03-10 16:00:00'),
('sso_78901', 'Thomas Lee', 'thomas.lee@university.edu', '2024-04-01 09:00:00');

-- Insert Role data
INSERT INTO `role` (`name`) VALUES 
('Student'),
('Faculty'),
('Lab Assistant'),
('Administrator'),
('Maintenance Staff');

-- Insert UserRole relationships
INSERT INTO `user_role` (`user_id`, `role_id`) VALUES 
(1, 1), -- John is a Student
(2, 2), -- Sarah is Faculty
(3, 3), -- Michael is a Lab Assistant
(4, 4), -- Emily is an Administrator
(5, 1), -- David is a Student
(6, 3), -- Jessica is a Lab Assistant
(7, 5); -- Thomas is Maintenance Staff

-- Insert additional role assignments (some users have multiple roles)
INSERT INTO `user_role` (`user_id`, `role_id`) VALUES 
(2, 4), -- Sarah is also an Administrator
(3, 5), -- Michael is also Maintenance Staff
(6, 2); -- Jessica is also Faculty

-- Insert Equipment data
INSERT INTO `equipment` (`name`, `equipment_type_id`, `equipment_status_id`, `availability`, `created_date`) VALUES 
('Oscilloscope XR-500', 4, 1, 'Weekdays 9-5', '2024-01-10 08:00:00'),
('Dell Precision Workstation', 1, 1, 'Anytime', '2024-01-15 09:30:00'),
('Conference Projector P1000', 2, 2, 'By request', '2024-01-20 10:15:00'),
('Network Analyzer NA-2000', 3, 1, 'Weekdays only', '2024-02-01 11:00:00'),
('Spectrum Analyzer SA-100', 4, 3, 'Restricted', '2024-02-05 13:45:00'),
('MacBook Pro 16"', 1, 1, 'Weekdays 9-5', '2024-02-15 14:30:00'),
('Digital Multimeter DMM-500', 4, 1, 'Anytime', '2024-03-01 09:20:00'),
('Wireless Access Point WAP-2', 3, 5, 'By request', '2024-03-10 10:45:00');

-- Insert Booking data
INSERT INTO `booking` (`user_id`, `equipment_id`, `from_date`, `to_date`, `booking_status_id`, `notes`, `created_date`) VALUES 
(1, 1, '2025-09-10 09:00:00', '2025-09-10 12:00:00', 2, 'Needed for Physics lab experiment', '2025-09-01 10:30:00'),
(1, 6, '2025-09-15 13:00:00', '2025-09-15 17:00:00', 1, 'Software development project', '2025-09-05 11:15:00'),
(2, 3, '2025-09-12 14:00:00', '2025-09-12 16:00:00', 2, 'Department presentation', '2025-09-02 09:00:00'),
(3, 4, '2025-09-14 09:00:00', '2025-09-14 17:00:00', 2, 'Network troubleshooting', '2025-09-03 16:20:00'),
(5, 7, '2025-09-18 10:00:00', '2025-09-18 12:00:00', 1, 'Electronic circuit testing', '2025-09-06 13:45:00'),
(2, 2, '2025-09-20 09:00:00', '2025-09-20 17:00:00', 3, 'Research computation - rejected due to maintenance', '2025-09-07 14:30:00'),
(6, 8, '2025-09-25 13:00:00', '2025-09-25 15:00:00', 2, 'Wireless network demonstration for class', '2025-09-08 10:15:00');

-- Insert Maintenance data
INSERT INTO `maintenance` (`equipment_id`, `maintenance_type_id`, `maintenance_status_id`, `scheduled_for`, `started_at`, `completed_at`) VALUES 
(2, 1, 3, '2025-09-05 09:00:00', '2025-09-05 09:00:00', '2025-09-05 10:30:00'),
(3, 1, 1, '2025-09-13 17:00:00', NULL, NULL),
(5, 2, 2, '2025-09-01 10:00:00', '2025-09-01 10:00:00', NULL),
(7, 5, 1, '2025-09-20 14:00:00', NULL, NULL),
(1, 3, 3, '2025-08-25 09:00:00', '2025-08-25 09:15:00', '2025-08-25 10:45:00'),
(4, 4, 3, '2025-08-28 13:00:00', '2025-08-28 13:00:00', '2025-08-28 16:30:00'),
(8, 2, 5, '2025-09-04 09:00:00', NULL, NULL);

-- Insert AuditLog data
INSERT INTO `auditlog` (`timestamp`, `user_id`, `action`, `entity_type`, `entity_id`, `details`) VALUES 
('2025-09-01 10:35:00', 1, 'CREATE', 'Booking', 1, '{"equipment_id": 1, "from_date": "2025-09-10 09:00:00", "to_date": "2025-09-10 12:00:00"}'),
('2025-09-01 10:40:00', 4, 'UPDATE', 'Booking', 1, '{"old_status": "Pending", "new_status": "Approved", "approved_by": 4}'),
('2025-09-02 09:05:00', 2, 'CREATE', 'Booking', 3, '{"equipment_id": 3, "from_date": "2025-09-12 14:00:00", "to_date": "2025-09-12 16:00:00"}'),
('2025-09-02 14:30:00', 4, 'UPDATE', 'Booking', 3, '{"old_status": "Pending", "new_status": "Approved", "approved_by": 4}'),
('2025-09-03 16:25:00', 3, 'CREATE', 'Booking', 4, '{"equipment_id": 4, "from_date": "2025-09-14 09:00:00", "to_date": "2025-09-14 17:00:00"}'),
('2025-09-05 10:35:00', 7, 'UPDATE', 'Equipment', 2, '{"old_status": "Under Maintenance", "new_status": "Available", "maintenance_id": 1}'),
('2025-09-07 15:00:00', 4, 'UPDATE', 'Booking', 6, '{"old_status": "Pending", "new_status": "Rejected", "reason": "Equipment scheduled for maintenance"}'),
('2025-09-08 10:20:00', 6, 'CREATE', 'Booking', 7, '{"equipment_id": 8, "from_date": "2025-09-25 13:00:00", "to_date": "2025-09-25 15:00:00"}'),
('2025-09-08 11:30:00', 4, 'UPDATE', 'Booking', 7, '{"old_status": "Pending", "new_status": "Approved", "approved_by": 4}');

-- Additional AuditLog entries for Equipment changes
INSERT INTO `auditlog` (`timestamp`, `user_id`, `action`, `entity_type`, `entity_id`, `details`) VALUES 
('2025-08-25 10:50:00', 7, 'UPDATE', 'Equipment', 1, '{"maintenance_completed": true, "inspection_result": "Passed"}'),
('2025-08-28 16:35:00', 7, 'UPDATE', 'Equipment', 4, '{"maintenance_completed": true, "software_updated": true, "firmware_version": "2.3.4"}'),
('2025-09-01 10:10:00', 7, 'UPDATE', 'Equipment', 5, '{"status_change": "Available to Under Maintenance", "reason": "Faulty readings"}'),
('2025-09-04 09:30:00', 7, 'UPDATE', 'Equipment', 8, '{"maintenance_delayed": true, "reason": "Parts on backorder", "new_date": "2025-09-15"}');
