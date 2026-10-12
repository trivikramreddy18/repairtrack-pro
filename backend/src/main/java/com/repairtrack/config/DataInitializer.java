package com.repairtrack.config;

import com.repairtrack.entity.*;
import com.repairtrack.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final DeviceRepository deviceRepository;
    private final RepairRepository repairRepository;
    private final RepairStatusHistoryRepository historyRepository;

    public DataInitializer(UserRepository userRepository,
                           CustomerRepository customerRepository,
                           DeviceRepository deviceRepository,
                           RepairRepository repairRepository,
                           RepairStatusHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.deviceRepository = deviceRepository;
        this.repairRepository = repairRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Users
        User admin = new User("admin", "admin123", "Sarah Jenkins", "admin@repairtrack.com", "+1-555-0101", Role.ROLE_ADMIN);
        User tech1 = new User("alex_tech", "tech123", "Alex Rivera", "alex.r@repairtrack.com", "+1-555-0102", Role.ROLE_TECHNICIAN);
        User tech2 = new User("david_tech", "tech123", "David Chen", "david.c@repairtrack.com", "+1-555-0103", Role.ROLE_TECHNICIAN);
        User staff = new User("emma_staff", "staff123", "Emma Watson", "emma.w@repairtrack.com", "+1-555-0104", Role.ROLE_STAFF);

        userRepository.save(admin);
        userRepository.save(tech1);
        userRepository.save(tech2);
        userRepository.save(staff);

        // 2. Seed Customers
        Customer c1 = new Customer("Marcus Sterling", "+1-555-234-5678", "marcus.sterling@example.com", "742 Evergreen Terrace", "Springfield", "Preferred VIP customer. Fast turnaround requested.");
        Customer c2 = new Customer("Elena Rostova", "+1-555-345-6789", "elena.r@techmail.io", "1204 Pine Street, Apt 3B", "Seattle", "Graphic designer, requires color accuracy verified on display repairs.");
        Customer c3 = new Customer("Jameson Vance", "+1-555-456-7890", "jvance@summitcorp.com", "88 Market Square, Suite 400", "San Francisco", "Corporate laptop fleet manager.");
        Customer c4 = new Customer("Aaliyah Patel", "+1-555-567-8901", "aaliyah.p@outlook.com", "450 Magnolia Blvd", "Austin", "Student, call after 2 PM.");
        Customer c5 = new Customer("Robert 'Bob' Miller", "+1-555-678-9012", "bob.miller@vintageaudio.net", "19 Elm Street", "Boston", "Collector of vintage electronics and gaming consoles.");

        customerRepository.save(c1);
        customerRepository.save(c2);
        customerRepository.save(c3);
        customerRepository.save(c4);
        customerRepository.save(c5);

        // 3. Seed Devices
        Device d1 = new Device(c1, "Smartphone", "Apple", "iPhone 14 Pro Max", "IMEI-358921004928172", "Space Black", "Deep screen impact crack, display glitching", "Leather wallet case");
        Device d2 = new Device(c1, "Smartwatch", "Apple", "Apple Watch Ultra 2", "SN-H39GK9923P", "Titanium", "Crown button unresponsive after ocean swim", "Orange Alpine loop");
        Device d3 = new Device(c2, "Laptop", "Apple", "MacBook Pro 16\" (M2 Max)", "SN-C02GF91PQ4", "Space Gray", "Keys sticky on row 3, thermal fan loud", "Original 140W MagSafe Charger");
        Device d4 = new Device(c3, "Laptop", "Dell", "XPS 15 9530", "SN-DELL-883921B", "Platinum Silver", "No power on, amber blinking charging LED", "Dell 130W USB-C brick");
        Device d5 = new Device(c4, "Smartphone", "Samsung", "Galaxy S23 Ultra", "IMEI-992811400291845", "Phantom Green", "Rear periscope camera lens shattered", "Clear silicone protector");
        Device d6 = new Device(c5, "Gaming Console", "Sony", "PlayStation 5 Disc Edition", "SN-PS5-449102839", "White / Custom Black", "Shuts down abruptly after 15 mins with fan noise", "DualSense Controller, HDMI cable");

        deviceRepository.save(d1);
        deviceRepository.save(d2);
        deviceRepository.save(d3);
        deviceRepository.save(d4);
        deviceRepository.save(d5);
        deviceRepository.save(d6);

        // 4. Seed Repairs
        // Repair 1: In Repair
        Repair r1 = new Repair();
        r1.setDevice(d1);
        r1.setTicketNumber("REP-20261001-1001");
        r1.setReportedProblem("Severe screen glass fracture. Touch sensitivity failing intermittently on upper half.");
        r1.setDiagnosisDetails("Digitizer damaged. Front sensor flex cable intact. OLED panel replacement required.");
        r1.setTechnicianNotes("OEM Super Retina XDR panel pre-tested. TrueTone serialization in progress.");
        r1.setStatus(RepairStatus.IN_REPAIR);
        r1.setPriority(Priority.HIGH);
        r1.setEstimatedCost(new BigDecimal("280.00"));
        r1.setPartsCost(new BigDecimal("190.00"));
        r1.setLaborCost(new BigDecimal("80.00"));
        r1.setFinalCost(new BigDecimal("270.00"));
        r1.setAssignedTechnician("Alex Rivera");
        r1.setReceivedDate(LocalDateTime.now().minusDays(2));
        r1.setEstimatedCompletionDate(LocalDateTime.now().plusDays(1));
        repairRepository.save(r1);

        historyRepository.save(new RepairStatusHistory(r1, RepairStatus.RECEIVED, "Emma Watson", "Intake inspection completed. Provided customer estimate."));
        historyRepository.save(new RepairStatusHistory(r1, RepairStatus.DIAGNOSING, "Alex Rivera", "Internal teardown confirms OLED damage. Digitizer harness ordered."));
        historyRepository.save(new RepairStatusHistory(r1, RepairStatus.IN_REPAIR, "Alex Rivera", "Disassembly completed. Mounting new original display."));

        // Repair 2: Ready for Pickup
        Repair r2 = new Repair();
        r2.setDevice(d3);
        r2.setTicketNumber("REP-20261002-1002");
        r2.setReportedProblem("Liquid coffee splash on keyboard. Spacebar and command keys sticking.");
        r2.setDiagnosisDetails("Top case keyboard mechanism sticky. Logic board free of corrosion, passivated in ultrasonic bath.");
        r2.setTechnicianNotes("Installed replacement top case assembly. Stress tested CPU/GPU for 2 hours, thermals within spec.");
        r2.setStatus(RepairStatus.READY_FOR_PICKUP);
        r2.setPriority(Priority.URGENT);
        r2.setEstimatedCost(new BigDecimal("350.00"));
        r2.setPartsCost(new BigDecimal("210.00"));
        r2.setLaborCost(new BigDecimal("120.00"));
        r2.setFinalCost(new BigDecimal("330.00"));
        r2.setAssignedTechnician("David Chen");
        r2.setReceivedDate(LocalDateTime.now().minusDays(4));
        r2.setCompletedDate(LocalDateTime.now().minusHours(3));
        repairRepository.save(r2);

        historyRepository.save(new RepairStatusHistory(r2, RepairStatus.RECEIVED, "Emma Watson", "Intake complete. Customer noted spilled cappuccino."));
        historyRepository.save(new RepairStatusHistory(r2, RepairStatus.DIAGNOSING, "David Chen", "Motherboard tested clean. Key switches gummed up."));
        historyRepository.save(new RepairStatusHistory(r2, RepairStatus.IN_REPAIR, "David Chen", "Replaced top case and sanitized chassis."));
        historyRepository.save(new RepairStatusHistory(r2, RepairStatus.READY_FOR_PICKUP, "David Chen", "Quality check verified. SMS notification sent to customer."));

        // Repair 3: Diagnosing
        Repair r3 = new Repair();
        r3.setDevice(d4);
        r3.setTicketNumber("REP-20261003-1003");
        r3.setReportedProblem("Laptop will not power on or take charge. 3 amber and 5 white diagnostic LED blinks.");
        r3.setDiagnosisDetails("Investigating power delivery IC rails (USB-C controller chip TPS65988).");
        r3.setTechnicianNotes("Voltage injection shows short circuit on 19.5V main power rail near input MOSFETs.");
        r3.setStatus(RepairStatus.DIAGNOSING);
        r3.setPriority(Priority.MEDIUM);
        r3.setEstimatedCost(new BigDecimal("220.00"));
        r3.setPartsCost(new BigDecimal("45.00"));
        r3.setLaborCost(new BigDecimal("150.00"));
        r3.setFinalCost(new BigDecimal("195.00"));
        r3.setAssignedTechnician("David Chen");
        r3.setReceivedDate(LocalDateTime.now().minusDays(1));
        repairRepository.save(r3);

        historyRepository.save(new RepairStatusHistory(r3, RepairStatus.RECEIVED, "Emma Watson", "Device checked in from corporate client Jameson Vance."));
        historyRepository.save(new RepairStatusHistory(r3, RepairStatus.DIAGNOSING, "David Chen", "Micro-soldering inspection under microscope underway."));

        // Repair 4: Delivered (Completed with revenue)
        Repair r4 = new Repair();
        r4.setDevice(d5);
        r4.setTicketNumber("REP-20260928-1004");
        r4.setReportedProblem("Rear 10x periscope telephoto lens glass cracked, blurry focus.");
        r4.setDiagnosisDetails("Camera glass fractured; telephoto sensor prism intact without dust infiltration.");
        r4.setTechnicianNotes("Precision micro-removal of glass shards done without opening IP68 chassis. New sapphire glass heat-sealed.");
        r4.setStatus(RepairStatus.DELIVERED);
        r4.setPriority(Priority.LOW);
        r4.setEstimatedCost(new BigDecimal("110.00"));
        r4.setPartsCost(new BigDecimal("35.00"));
        r4.setLaborCost(new BigDecimal("60.00"));
        r4.setFinalCost(new BigDecimal("95.00"));
        r4.setAssignedTechnician("Alex Rivera");
        r4.setReceivedDate(LocalDateTime.now().minusDays(10));
        r4.setCompletedDate(LocalDateTime.now().minusDays(8));
        r4.setDeliveredDate(LocalDateTime.now().minusDays(7));
        repairRepository.save(r4);

        historyRepository.save(new RepairStatusHistory(r4, RepairStatus.RECEIVED, "Emma Watson", "Received Galaxy S23 Ultra in store."));
        historyRepository.save(new RepairStatusHistory(r4, RepairStatus.IN_REPAIR, "Alex Rivera", "Installed sapphire camera lens with waterproof adhesive."));
        historyRepository.save(new RepairStatusHistory(r4, RepairStatus.READY_FOR_PICKUP, "Alex Rivera", "Camera focus calibration and dust test passed 100%."));
        historyRepository.save(new RepairStatusHistory(r4, RepairStatus.DELIVERED, "Emma Watson", "Customer tested camera and paid invoice via card."));

        // Repair 5: Received
        Repair r5 = new Repair();
        r5.setDevice(d6);
        r5.setTicketNumber("REP-20261008-1005");
        r5.setReportedProblem("Console shuts down after 10-15 minutes of gaming with high pitch fan spinning.");
        r5.setDiagnosisDetails("Liquid metal thermal interface displacement suspected, plus heatsink dust blockage.");
        r5.setTechnicianNotes("Awaiting technician bench assignment.");
        r5.setStatus(RepairStatus.RECEIVED);
        r5.setPriority(Priority.MEDIUM);
        r5.setEstimatedCost(new BigDecimal("130.00"));
        r5.setPartsCost(new BigDecimal("25.00"));
        r5.setLaborCost(new BigDecimal("90.00"));
        r5.setFinalCost(new BigDecimal("115.00"));
        r5.setAssignedTechnician("David Chen");
        r5.setReceivedDate(LocalDateTime.now().minusHours(4));
        repairRepository.save(r5);

        historyRepository.save(new RepairStatusHistory(r5, RepairStatus.RECEIVED, "Emma Watson", "Intake recorded with controller and HDMI cable."));
    }
}
