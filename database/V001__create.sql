-- ---- Nominal Tables ----- --
CREATE TABLE `equipment_status` (
    `equipment_status_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `equipment_type` (
    `equipment_type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `booking_status` (
    `booking_status_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `maintenance_type` (
    `maintenance_type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `maintenance_status` (
    `maintenance_status_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----- Users ----- --
CREATE TABLE `user` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `sso_id` VARCHAR(255) NOT NULL UNIQUE,
    `display_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----- Roles ----- --
CREATE TABLE `role` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----- UserRoles ----- --
CREATE TABLE `user_role` (
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----- Equipment ----- --
CREATE TABLE `equipment` (
    `equipment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `equipment_type_id` INT NOT NULL,
    `equipment_status_id` INT NOT NULL,
    `availability` VARCHAR(255),
    `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_type`(`equipment_type_id`),
    FOREIGN KEY (`equipment_status_id`) REFERENCES `equipment_status`(`equipment_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----- Bookings ----- --
CREATE TABLE `booking` (
    `booking_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `equipment_id` INT NOT NULL,
    `from_date` TIMESTAMP NOT NULL,
    `to_date` TIMESTAMP NOT NULL,
    `booking_status_id` INT NOT NULL,
    `notes` TEXT,
    `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`),
    FOREIGN KEY (`booking_status_id`) REFERENCES `booking_status`(`booking_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----- Maintenance ----- --
CREATE TABLE `maintenance` (
    `maintenance_id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_id` INT NOT NULL,
    `maintenance_type_id` INT NOT NULL,
    `maintenance_status_id` INT NOT NULL,
    `scheduled_for` TIMESTAMP NOT NULL,
    `started_at` TIMESTAMP NULL DEFAULT NULL,
    `completed_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`),
    FOREIGN KEY (`maintenance_type_id`) REFERENCES `maintenance_type`(`maintenance_type_id`),
    FOREIGN KEY (`maintenance_status_id`) REFERENCES `maintenance_status`(`maintenance_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----- AuditLog ----- --
CREATE TABLE `audit_log` (
    `auditlog_id` INT AUTO_INCREMENT PRIMARY KEY,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `user_id` INT,
    `action` VARCHAR(255) NOT NULL,
    `entity_type` VARCHAR(255) NOT NULL,
    `entity_id` INT NOT NULL,
    `details` JSON,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;