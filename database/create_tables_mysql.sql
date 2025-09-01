-- User Table
CREATE TABLE `user` (
    `user_id`       INT AUTO_INCREMENT PRIMARY KEY,
    `sso_id`        VARCHAR(255) NOT NULL,
    `display_name`  VARCHAR(255) NOT NULL,
    `email`         VARCHAR(255) NOT NULL,
    `created_at`    TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Role Table
CREATE TABLE `role` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- UserRole Table (Many-to-Many)
CREATE TABLE `user_role` (
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Equipment Table
CREATE TABLE `equipment` (
    `equipment_id`  INT AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(255) NOT NULL,
    `type`          VARCHAR(255) NOT NULL,
    `status`        VARCHAR(50) NOT NULL,
    `availability`  VARCHAR(255),
    `created_date`  TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Booking Table
CREATE TABLE `booking` (
    `booking_id`    INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`       INT NOT NULL,
    `equipment_id`  INT NOT NULL,
    `from_date`     TIMESTAMP NOT NULL,  
    `to_date`       TIMESTAMP NOT NULL,  
    `status`        VARCHAR(50) NOT NULL,
    `notes`         TEXT,
    `created_date`  TIMESTAMP NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Maintenance Table
CREATE TABLE `maintenance` (
    `maintenance_id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_id`   INT NOT NULL,
    `type`           VARCHAR(50) NOT NULL,
    `status`         VARCHAR(50) NOT NULL,
    `scheduled_for`  TIMESTAMP NOT NULL,
    `started_at`     TIMESTAMP NULL DEFAULT NULL,
    `completed_at`   TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AuditLog Table
CREATE TABLE `auditlog` (
    `auditlog_id`  INT AUTO_INCREMENT PRIMARY KEY,
    `timestamp`    TIMESTAMP NOT NULL,
    `user_id`      INT,
    `action`       VARCHAR(255) NOT NULL,
    `entity_type`  VARCHAR(255) NOT NULL,
    `entity_id`    INT NOT NULL,
    `details`      JSON,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
