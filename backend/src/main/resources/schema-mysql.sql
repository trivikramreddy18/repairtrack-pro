-- RepairTrack Pro MySQL Database Schema
CREATE DATABASE IF NOT EXISTS `repairtrack_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `repairtrack_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone` VARCHAR(20),
    `role` VARCHAR(20) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS `customers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100),
    `address` VARCHAR(255),
    `city` VARCHAR(100),
    `notes` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_cust_phone` (`phone`),
    INDEX `idx_cust_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Devices Table
CREATE TABLE IF NOT EXISTS `devices` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT NOT NULL,
    `device_type` VARCHAR(50) NOT NULL,
    `brand` VARCHAR(50) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `serial_number` VARCHAR(100),
    `color` VARCHAR(50),
    `condition_notes` TEXT,
    `accessories` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_device_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
    INDEX `idx_dev_serial` (`serial_number`),
    INDEX `idx_dev_brand_model` (`brand`, `model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Repairs Table
CREATE TABLE IF NOT EXISTS `repairs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ticket_number` VARCHAR(30) NOT NULL UNIQUE,
    `device_id` BIGINT NOT NULL,
    `reported_problem` TEXT NOT NULL,
    `diagnosis_details` TEXT,
    `technician_notes` TEXT,
    `status` VARCHAR(30) NOT NULL DEFAULT 'RECEIVED',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    `estimated_cost` DECIMAL(10, 2) DEFAULT 0.00,
    `parts_cost` DECIMAL(10, 2) DEFAULT 0.00,
    `labor_cost` DECIMAL(10, 2) DEFAULT 0.00,
    `final_cost` DECIMAL(10, 2) DEFAULT 0.00,
    `assigned_technician` VARCHAR(100),
    `received_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `estimated_completion_date` DATETIME,
    `completed_date` DATETIME,
    `delivered_date` DATETIME,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_repair_device` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE,
    INDEX `idx_rep_ticket` (`ticket_number`),
    INDEX `idx_rep_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Repair Status History Table
CREATE TABLE IF NOT EXISTS `repair_status_history` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `repair_id` BIGINT NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `changed_by` VARCHAR(100),
    `notes` TEXT,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_history_repair` FOREIGN KEY (`repair_id`) REFERENCES `repairs` (`id`) ON DELETE CASCADE,
    INDEX `idx_hist_repair` (`repair_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
