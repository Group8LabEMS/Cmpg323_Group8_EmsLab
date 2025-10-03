-- Add default user
INSERT INTO user (user_id, sso_id, display_name, email, created_at)
VALUES (1, 'user', 'Static User', 'user@example.com', NOW());

-- Add default booking status
INSERT INTO booking_status (booking_status_id, name, description)
VALUES (1, 'Active', 'Active booking');

-- Add default equipment status and type (required for equipment)
INSERT INTO equipment_status (equipment_status_id, name, description)
VALUES (1, 'Available', 'Available for booking');

INSERT INTO equipment_type (equipment_type_id, name, description)
VALUES (1, 'General', 'General equipment type');

-- Add default equipment
INSERT INTO equipment (equipment_id, name, equipment_type_id, equipment_status_id, availability, created_date)
VALUES (1, 'Demo Equipment', 1, 1, 'true', NOW());
