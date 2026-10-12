-- RepairTrack Pro Sample Seed Data for MySQL
USE `repairtrack_db`;

-- Users (admin: admin123, tech: tech123, staff: staff123)
INSERT INTO `users` (`username`, `password`, `full_name`, `email`, `phone`, `role`, `active`) VALUES
('admin', 'admin123', 'Sarah Jenkins', 'admin@repairtrack.com', '+1-555-0101', 'ROLE_ADMIN', TRUE),
('alex_tech', 'tech123', 'Alex Rivera', 'alex.r@repairtrack.com', '+1-555-0102', 'ROLE_TECHNICIAN', TRUE),
('david_tech', 'tech123', 'David Chen', 'david.c@repairtrack.com', '+1-555-0103', 'ROLE_TECHNICIAN', TRUE),
('emma_staff', 'staff123', 'Emma Watson', 'emma.w@repairtrack.com', '+1-555-0104', 'ROLE_STAFF', TRUE);

-- Customers
INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `address`, `city`, `notes`) VALUES
(1, 'Marcus Sterling', '+1-555-234-5678', 'marcus.sterling@example.com', '742 Evergreen Terrace', 'Springfield', 'VIP Customer. Fast turnaround requested.'),
(2, 'Elena Rostova', '+1-555-345-6789', 'elena.r@techmail.io', '1204 Pine Street, Apt 3B', 'Seattle', 'Graphic designer.'),
(3, 'Jameson Vance', '+1-555-456-7890', 'jvance@summitcorp.com', '88 Market Square, Suite 400', 'San Francisco', 'Corporate fleet.'),
(4, 'Aaliyah Patel', '+1-555-567-8901', 'aaliyah.p@outlook.com', '450 Magnolia Blvd', 'Austin', 'Student discount eligible.'),
(5, 'Robert Miller', '+1-555-678-9012', 'bob.miller@vintageaudio.net', '19 Elm Street', 'Boston', 'Vintage audio collector.');

-- Devices
INSERT INTO `devices` (`id`, `customer_id`, `device_type`, `brand`, `model`, `serial_number`, `color`, `condition_notes`, `accessories`) VALUES
(1, 1, 'Smartphone', 'Apple', 'iPhone 14 Pro Max', 'IMEI-358921004928172', 'Space Black', 'Cracked front glass', 'Leather case'),
(2, 1, 'Smartwatch', 'Apple', 'Apple Watch Ultra 2', 'SN-H39GK9923P', 'Titanium', 'Crown button stuck', 'Alpine loop'),
(3, 2, 'Laptop', 'Apple', 'MacBook Pro 16\" (M2)', 'SN-C02GF91PQ4', 'Space Gray', 'Keyboard sticky keys', '140W Charger'),
(4, 3, 'Laptop', 'Dell', 'XPS 15 9530', 'SN-DELL-883921B', 'Silver', 'No power / blinking LED', 'Power adapter'),
(5, 4, 'Smartphone', 'Samsung', 'Galaxy S23 Ultra', 'IMEI-992811400291845', 'Green', 'Rear camera glass broken', 'Silicone case'),
(6, 5, 'Gaming Console', 'Sony', 'PlayStation 5 Disc', 'SN-PS5-449102839', 'White', 'Overheats after 15m', 'Controller, HDMI');

-- Repairs
INSERT INTO `repairs` (`id`, `ticket_number`, `device_id`, `reported_problem`, `diagnosis_details`, `technician_notes`, `status`, `priority`, `estimated_cost`, `parts_cost`, `labor_cost`, `final_cost`, `assigned_technician`, `received_date`, `completed_date`, `delivered_date`) VALUES
(1, 'REP-20261001-1001', 1, 'Cracked OLED screen and touch glitch', 'Digitizer damaged', 'OEM panel pre-tested', 'IN_REPAIR', 'HIGH', 280.00, 190.00, 80.00, 270.00, 'Alex Rivera', NOW() - INTERVAL 2 DAY, NULL, NULL),
(2, 'REP-20261002-1002', 3, 'Coffee spill on keyboard', 'Key mechanism sticky', 'Installed replacement top case', 'READY_FOR_PICKUP', 'URGENT', 350.00, 210.00, 120.00, 330.00, 'David Chen', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 3 HOUR, NULL),
(3, 'REP-20261003-1003', 4, 'Will not turn on or charge', 'Motherboard power IC suspected', 'Voltage rails under test', 'DIAGNOSING', 'MEDIUM', 220.00, 45.00, 150.00, 195.00, 'David Chen', NOW() - INTERVAL 1 DAY, NULL, NULL),
(4, 'REP-20260928-1004', 5, 'Broken camera lens cover', 'Sensor clean, lens fractured', 'Installed sapphire glass cover', 'DELIVERED', 'LOW', 110.00, 35.00, 60.00, 95.00, 'Alex Rivera', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 7 DAY),
(5, 'REP-20261008-1005', 6, 'Loud fan and overheat shutdown', 'Liquid metal & dust buildup', 'Awaiting bench assignment', 'RECEIVED', 'MEDIUM', 130.00, 25.00, 90.00, 115.00, 'David Chen', NOW() - INTERVAL 4 HOUR, NULL, NULL);
