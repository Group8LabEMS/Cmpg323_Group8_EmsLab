-- Ensure roles exist
INSERT INTO role (role_id, name) VALUES (1, 'Admin') ON DUPLICATE KEY UPDATE name='Admin';
INSERT INTO role (role_id, name) VALUES (2, 'Student') ON DUPLICATE KEY UPDATE name='Student';

-- Create an admin user
INSERT INTO user (user_id, sso_id, display_name, email, password, created_at)
VALUES (100, 'admin001', 'Admin User', 'admin@example.com', 'AdminPassword', NOW());

-- Create a student user
INSERT INTO user (user_id, sso_id, display_name, email, password, created_at)
VALUES (101, 'student001', 'Student User', 'student@example.com', 'StudentPassword', NOW());

-- Assign roles to users
INSERT INTO user_role (user_id, role_id) VALUES (100, 1); -- Admin role
INSERT INTO user_role (user_id, role_id) VALUES (101, 2); -- Student role


-- Initial data for lookup tables

-- Equipment Status initial values
INSERT INTO `equipment_status` (`name`, `description`) VALUES 
('Available', 'Equipment is available for booking'),
('In Use', 'Equipment is currently in use'),
('Under Maintenance', 'Equipment is currently under maintenance'),
('Out of Order', 'Equipment is not functional'),
('Reserved', 'Equipment is reserved for future use');

-- Equipment Type initial values
INSERT INTO `equipment_type` (`name`, `description`) VALUES 
('Lab Equipment', 'Specialized laboratory equipment');

-- Booking Status initial values
INSERT INTO `booking_status` (`name`, `description`) VALUES 
('Pending', 'Booking request is pending approval'),
('Approved', 'Booking has been approved'),
('Rejected', 'Booking request has been rejected'),
('Cancelled', 'Booking was cancelled'),
('Completed', 'Booking period has completed');

-- Maintenance Type initial values
INSERT INTO `maintenance_type` (`name`, `description`) VALUES 
('Routine', 'Regular scheduled maintenance'),
('Repair', 'Equipment repair'),
('Inspection', 'Safety or quality inspection'),
('Upgrade', 'Hardware or software upgrade'),
('Calibration', 'Equipment calibration');

-- Maintenance Status initial values
INSERT INTO `maintenance_status` (`name`, `description`) VALUES 
('Scheduled', 'Maintenance is scheduled for the future'),
('In Progress', 'Maintenance is currently in progress'),
('Completed', 'Maintenance has been completed'),
('Cancelled', 'Maintenance was cancelled'),
('Delayed', 'Maintenance has been delayed');