-- ----- Initialize nominal types ----- --
-- Roles
INSERT INTO role (name) VALUES 
('Admin'), ('Student'), ('Faculty'), ('Lab Assistant'), ('Maintenance Staff'), ('Lab Manager'), ('Technician');

-- Equipment Status
INSERT INTO equipment_status (name, description) VALUES 
('Available', 'Equipment is available for booking'),
('In Use', 'Equipment is currently in use'),
('Under Maintenance', 'Equipment is currently under maintenance'),
('Out of Order', 'Equipment is not functional'),
('Reserved', 'Equipment is reserved for future use'),
('Decommissioned', 'Equipment is permanently removed from service'),
('On Loan', 'Equipment is loaned to another department');

-- Equipment Types
INSERT INTO equipment_type (name, description) VALUES 
('Lab Equipment', 'Specialized laboratory equipment'),
('Computer', 'Desktop or laptop computer'),
('Audio Visual', 'Projectors, screens, and other AV equipment'),
('Network', 'Network and connectivity equipment'),
('Measuring Device', 'Measurement and testing equipment');

-- Booking Status
INSERT INTO booking_status (name, description) VALUES 
('Pending', 'Booking request is pending approval'),
('Approved', 'Booking has been approved'),
('Rejected', 'Booking request has been rejected'),
('Cancelled', 'Booking was cancelled'),
('Completed', 'Booking period has completed');

-- Maintenance Types
INSERT INTO maintenance_type (name, description) VALUES 
('Routine', 'Regular scheduled maintenance'),
('Repair', 'Equipment repair'),
('Inspection', 'Safety or quality inspection'),
('Upgrade', 'Hardware or software upgrade'),
('Calibration', 'Equipment calibration');

-- Maintenance Status
INSERT INTO maintenance_status (name, description) VALUES 
('Scheduled', 'Maintenance is scheduled for the future'),
('In Progress', 'Maintenance is currently in progress'),
('Completed', 'Maintenance has been completed'),
('Cancelled', 'Maintenance was cancelled'),
('Delayed', 'Maintenance has been delayed');


-- ----- Populate dummy data ----- --
-- Users
-- Default password is 'password' for all dummy users
INSERT INTO user (sso_id, display_name, email, password) VALUES 
('admin001',     'Admin User',         'admin@example.com',              '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('student001',   'Student User',       'student@example.com',            '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('faculty001',   'Dr. Sarah Johnson',  'sarah.johnson@university.edu',   '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('faculty002',   'Prof. Michael Chen', 'michael.chen@university.edu',    '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('student002',   'Alice Smith',        'alice.smith@student.edu',        '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('student003',   'Bob Wilson',         'bob.wilson@student.edu',         '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('student004',   'Carol Davis',        'carol.davis@student.edu',        '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('student005',   'David Brown',        'david.brown@student.edu',        '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('labassist001', 'Emma Thompson',      'emma.thompson@university.edu',   '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('labassist002', 'James Rodriguez',    'james.rodriguez@university.edu', '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('maint001',     'Tom Martinez',       'tom.martinez@university.edu',    '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('maint002',     'Lisa Anderson',      'lisa.anderson@university.edu',   '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('manager001',   'Robert Taylor',      'robert.taylor@university.edu',   '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm'),
('tech001',      'Jennifer Lee',       'jennifer.lee@university.edu',    '$2a$12$snZOsJ0uWsyyaRUt0p1DVeAqCBnXuVjV5/8Vy3TlmnRMn4BmKV2jm');

-- User Roles
INSERT INTO user_role (user_id, role_id) 
SELECT u.user_id, r.role_id FROM user u, role r WHERE 
(u.sso_id = 'admin001' AND r.name = 'Admin') OR
(u.sso_id = 'student001' AND r.name = 'Student') OR
(u.sso_id = 'faculty001' AND r.name = 'Faculty') OR
(u.sso_id = 'faculty002' AND r.name = 'Faculty') OR
(u.sso_id = 'student002' AND r.name = 'Student') OR
(u.sso_id = 'student003' AND r.name = 'Student') OR
(u.sso_id = 'student004' AND r.name = 'Student') OR
(u.sso_id = 'student005' AND r.name = 'Student') OR
(u.sso_id = 'labassist001' AND r.name = 'Lab Assistant') OR
(u.sso_id = 'labassist002' AND r.name = 'Lab Assistant') OR
(u.sso_id = 'maint001' AND r.name = 'Maintenance Staff') OR
(u.sso_id = 'maint002' AND r.name = 'Maintenance Staff') OR
(u.sso_id = 'manager001' AND r.name = 'Lab Manager') OR
(u.sso_id = 'tech001' AND r.name = 'Technician');

-- Equipment
INSERT INTO equipment (name, equipment_type_id, equipment_status_id, availability) VALUES 
('Oscilloscope XR-500', 5, 1, 'Weekdays 9-5'),
('Dell Precision Workstation', 2, 1, 'Anytime'),
('Conference Projector P1000', 3, 2, 'By request'),
('Network Analyzer NA-2000', 4, 1, 'Weekdays only'),
('Spectrum Analyzer SA-100', 5, 3, 'Restricted'),
('MacBook Pro 16"', 2, 1, 'Weekdays 9-5'),
('Digital Multimeter DMM-500', 5, 1, 'Anytime'),
('Wireless Access Point WAP-2', 4, 5, 'By request'),
('HP EliteBook Laptop', 2, 1, 'Business hours'),
('Function Generator FG-200', 5, 1, 'Weekdays 8-6'),
('Smart Projector SP-400', 3, 1, 'By reservation'),
('Cisco Switch CS-24', 4, 1, 'Always available'),
('Power Supply PS-300', 5, 1, 'Lab hours only'),
('iMac 27" Workstation', 2, 2, 'Design lab only'),
('Logic Analyzer LA-100', 5, 1, 'Advanced users'),
('Ethernet Tester ET-50', 4, 1, 'Network lab'),
('Benchtop Oscilloscope BO-1000', 5, 1, 'Electronics lab'),
('Lenovo ThinkPad T14', 2, 1, 'Mobile use'),
('Signal Generator SG-250', 5, 3, 'Calibration required'),
('Interactive Whiteboard IW-75', 3, 1, 'Classroom use'),
('Managed Switch MS-48', 4, 1, 'Server room'),
('Portable Oscilloscope PO-200', 5, 1, 'Field work'),
('Gaming Laptop GL-17', 2, 1, 'Graphics lab'),
('Document Camera DC-12', 3, 1, 'Teaching aid'),
('Fiber Optic Tester FOT-10', 4, 1, 'Network testing'),
('Bench Power Supply BPS-500', 5, 1, 'Electronics bench'),
('Surface Pro Tablet SP-8', 2, 1, 'Portable computing'),
('Laser Projector LP-6000', 3, 1, 'Auditorium use'),
('Network Simulator NS-Pro', 4, 1, 'Training lab'),
('Frequency Counter FC-100', 5, 1, 'Measurement lab');

-- Bookings
INSERT INTO booking (user_id, equipment_id, from_date, to_date, booking_status_id, notes) VALUES 
((SELECT user_id FROM user WHERE sso_id = 'admin001'), 1, '2025-09-10 09:00:00', '2025-09-10 12:00:00', 2, 'Physics lab experiment - wave analysis'),
((SELECT user_id FROM user WHERE sso_id = 'student001'), 6, '2025-09-15 13:00:00', '2025-09-15 17:00:00', 1, 'Software development project'),
((SELECT user_id FROM user WHERE sso_id = 'student002'), 2, '2025-09-12 10:00:00', '2025-09-12 16:00:00', 2, 'CAD modeling assignment'),
((SELECT user_id FROM user WHERE sso_id = 'faculty001'), 3, '2025-09-18 14:00:00', '2025-09-18 15:30:00', 1, 'Research presentation'),
((SELECT user_id FROM user WHERE sso_id = 'student003'), 10, '2025-09-20 09:00:00', '2025-09-20 11:00:00', 2, 'Signal generation lab'),
((SELECT user_id FROM user WHERE sso_id = 'student004'), 12, '2025-09-22 13:00:00', '2025-09-22 17:00:00', 1, 'Network configuration lab'),
((SELECT user_id FROM user WHERE sso_id = 'student005'), 15, '2025-09-25 08:00:00', '2025-09-25 12:00:00', 2, 'Digital circuit analysis'),
((SELECT user_id FROM user WHERE sso_id = 'faculty002'), 18, '2025-09-28 14:00:00', '2025-09-28 18:00:00', 1, 'Mobile app development'),
((SELECT user_id FROM user WHERE sso_id = 'student002'), 20, '2025-10-01 10:00:00', '2025-10-01 12:00:00', 3, 'Equipment unavailable for requested time'),
((SELECT user_id FROM user WHERE sso_id = 'labassist001'), 22, '2025-10-03 09:00:00', '2025-10-03 15:00:00', 2, 'Field measurement project'),
((SELECT user_id FROM user WHERE sso_id = 'student003'), 25, '2025-10-05 11:00:00', '2025-10-05 13:00:00', 4, 'User cancelled due to schedule conflict'),
((SELECT user_id FROM user WHERE sso_id = 'faculty001'), 28, '2025-10-08 13:00:00', '2025-10-08 17:00:00', 5, 'Presentation completed successfully'),
((SELECT user_id FROM user WHERE sso_id = 'student004'), 30, '2025-10-10 08:00:00', '2025-10-10 16:00:00', 2, 'Frequency measurement lab');

-- Maintenance
INSERT INTO maintenance (equipment_id, maintenance_type_id, maintenance_status_id, scheduled_for, started_at, completed_at) VALUES 
(2, 1, 3, '2025-09-05 09:00:00', '2025-09-05 09:00:00', '2025-09-05 10:30:00'),
(3, 1, 1, '2025-09-13 17:00:00', NULL, NULL),
(5, 2, 2, '2025-09-01 10:00:00', '2025-09-01 10:00:00', NULL),
(7, 5, 1, '2025-09-20 14:00:00', NULL, NULL),
(1, 3, 3, '2025-08-25 09:00:00', '2025-08-25 09:15:00', '2025-08-25 10:45:00'),
(4, 4, 3, '2025-08-28 13:00:00', '2025-08-28 13:00:00', '2025-08-28 16:30:00'),
(8, 2, 5, '2025-09-04 09:00:00', NULL, NULL),
(9, 1, 3, '2025-08-30 08:00:00', '2025-08-30 08:15:00', '2025-08-30 09:45:00'),
(10, 5, 1, '2025-09-25 16:00:00', NULL, NULL),
(11, 1, 3, '2025-08-20 14:00:00', '2025-08-20 14:00:00', '2025-08-20 15:30:00'),
(12, 4, 2, '2025-09-15 10:00:00', '2025-09-15 10:00:00', NULL),
(13, 2, 3, '2025-08-18 11:00:00', '2025-08-18 11:00:00', '2025-08-18 12:30:00'),
(14, 1, 1, '2025-10-01 09:00:00', NULL, NULL),
(15, 3, 3, '2025-08-22 13:00:00', '2025-08-22 13:00:00', '2025-08-22 14:15:00'),
(16, 1, 1, '2025-09-30 15:00:00', NULL, NULL),
(17, 5, 2, '2025-09-18 08:00:00', '2025-09-18 08:00:00', NULL),
(18, 1, 3, '2025-08-15 10:00:00', '2025-08-15 10:00:00', '2025-08-15 11:00:00'),
(19, 2, 4, '2025-09-10 14:00:00', NULL, NULL),
(20, 1, 3, '2025-08-28 16:00:00', '2025-08-28 16:00:00', '2025-08-28 17:00:00'),
(21, 4, 1, '2025-10-05 11:00:00', NULL, NULL),
(22, 1, 3, '2025-08-25 12:00:00', '2025-08-25 12:00:00', '2025-08-25 13:30:00'),
(23, 2, 2, '2025-09-20 09:00:00', '2025-09-20 09:00:00', NULL),
(24, 1, 1, '2025-10-08 14:00:00', NULL, NULL),
(25, 3, 3, '2025-08-30 15:00:00', '2025-08-30 15:00:00', '2025-08-30 16:00:00'),
(26, 1, 1, '2025-10-12 10:00:00', NULL, NULL),
(27, 5, 2, '2025-09-22 13:00:00', '2025-09-22 13:00:00', NULL),
(28, 1, 3, '2025-08-20 11:00:00', '2025-08-20 11:00:00', '2025-08-20 12:00:00'),
(29, 4, 1, '2025-10-15 09:00:00', NULL, NULL),
(30, 5, 3, '2025-08-28 14:00:00', '2025-08-28 14:00:00', '2025-08-28 15:30:00');

-- Audit Logs
INSERT INTO audit_log (user_id, action, entity_type, entity_id, details) VALUES 
((SELECT user_id FROM user WHERE sso_id = 'admin001'), 'CREATE', 'Booking', 1, '{"equipment_id": 1, "from_date": "2025-09-10 09:00:00", "to_date": "2025-09-10 12:00:00"}'),
((SELECT user_id FROM user WHERE sso_id = 'manager001'), 'UPDATE', 'Booking', 1, '{"old_status": "Pending", "new_status": "Approved"}'),
((SELECT user_id FROM user WHERE sso_id = 'admin001'), 'CREATE', 'Equipment', 9, '{"name": "HP EliteBook Laptop", "type": "Computer"}'),
((SELECT user_id FROM user WHERE sso_id = 'maint001'), 'UPDATE', 'Equipment', 1, '{"maintenance_completed": true, "inspection_result": "Passed"}'),
((SELECT user_id FROM user WHERE sso_id = 'tech001'), 'UPDATE', 'Equipment', 4, '{"maintenance_completed": true, "software_updated": true, "firmware_version": "2.3.4"}'),
((SELECT user_id FROM user WHERE sso_id = 'student002'), 'CREATE', 'Booking', 3, '{"equipment_id": 2, "duration": "6 hours"}'),
((SELECT user_id FROM user WHERE sso_id = 'faculty001'), 'UPDATE', 'Booking', 4, '{"status_change": "Pending to Approved", "approved_by": "faculty001"}'),
((SELECT user_id FROM user WHERE sso_id = 'maint002'), 'CREATE', 'Maintenance', 8, '{"type": "Routine", "equipment": "HP EliteBook Laptop"}'),
((SELECT user_id FROM user WHERE sso_id = 'tech001'), 'UPDATE', 'Equipment', 10, '{"calibration_completed": true, "next_calibration": "2025-12-20"}'),
((SELECT user_id FROM user WHERE sso_id = 'student003'), 'DELETE', 'Booking', 9, '{"reason": "User cancellation", "cancelled_by": "student003"}'),
((SELECT user_id FROM user WHERE sso_id = 'labassist001'), 'UPDATE', 'Equipment', 15, '{"status_change": "Available to Under Maintenance"}'),
((SELECT user_id FROM user WHERE sso_id = 'admin001'), 'CREATE', 'User', 12, '{"role": "Student", "department": "Engineering"}'),
((SELECT user_id FROM user WHERE sso_id = 'student004'), 'UPDATE', 'Booking', 12, '{"extension_requested": true, "additional_hours": 2}'),
((SELECT user_id FROM user WHERE sso_id = 'maint001'), 'UPDATE', 'Equipment', 20, '{"repair_completed": true, "parts_replaced": ["display", "keyboard"]}'),
((SELECT user_id FROM user WHERE sso_id = 'faculty002'), 'CREATE', 'Booking', 13, '{"priority": "High", "research_project": true}');