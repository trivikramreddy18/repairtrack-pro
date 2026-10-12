# RepairTrack Pro: Electronics Repair Management System

**RepairTrack Pro** is a full-stack web application designed for small and medium-sized electronics repair centers. It replaces manual paperwork with a centralized, automated system for tracking customers, devices, diagnostic findings, and the entire repair lifecycle with clear cost transparency.

---

## 🛠️ System Architecture

### 1. Backend (Spring Boot & Maven)
- **Framework**: Spring Boot 3.3.4 (Java 21 LTS)
- **Architecture**: Layered Architecture (`Controller` -> `Service` -> `Repository` -> `Entity` / `DTO`)
- **Data Persistence**: Spring Data JPA & Hibernate
- **Database Support**:
  - **Zero-Setup Default**: Embedded H2 database in MySQL compatibility mode (`jdbc:h2:mem:repairtrack_db;MODE=MySQL`). Runs out of the box with zero configuration!
  - **Production MySQL**: Standard MySQL 8.x configuration provided via `application-mysql.properties`, `schema-mysql.sql`, and `data-mysql.sql`.
- **Validation & Duplicate Checking**: Jakarta Validation (`@NotBlank`, `@Email`, `@Pattern`, `@PositiveOrZero`) with custom duplicate checking on phone numbers, emails, and device serial numbers.
- **RESTful Endpoints**: Full JSON API for Customers, Devices, Repairs, Status Transitions, Dashboard Analytics, and Authentication.

### 2. Frontend (React & Vite)
- **Framework**: React 19 + Vite
- **Styling**: Modern Tailwind CSS utility design with responsive layouts and `@media print` styling for printable sheets.
- **Iconography**: Lucide React
- **Views**:
  - **Operational Dashboard**: KPI cards, repair pipeline progress bars, active work valuation, and recent jobs.
  - **Repair Jobs Management**: Interactive Kanban Board & Filterable Table view with one-click status advancement.
  - **Customer Directory**: Customer profiles, duplicate detection alerts, linked devices, and repair count summaries.
  - **Device Registry**: Electronics catalog with owner associations, intake condition notes, and historical service timelines.
  - **Public Ticket Tracker**: Customer-facing portal with a 5-stage visual progress stepper.
  - **Staff & Roles**: Admin management of technicians and reception staff with role-based permissions.
  - **Printable Invoices & Receipts**: Printable Intake Tickets and Service Invoices with itemized parts & labor costs.

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** installed
- **Node.js** (v18+) & **npm** installed

### 1. Running the Backend
From the project root:
```bash
cd backend

# Run with zero-setup H2 (MySQL Mode):
.\mvnw.cmd spring-boot:run

# Or run with external MySQL (requires MySQL server running on port 3306):
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```
The backend starts at `http://localhost:8080/`.
- H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:repairtrack_db`, user: `sa`, password: blank)
- API Health / Dashboard Check: `http://localhost:8080/api/dashboard/stats`

### 2. Running the Frontend
From the project root in a separate terminal:
```bash
cd frontend

# Install dependencies (already installed):
npm install

# Start Vite dev server:
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 👥 Pre-Seeded Accounts & Role-Based Access

The top header includes an **Acting Role Switcher** to quickly test role-based capabilities without logging out:

| Username | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | **Administrator** | Manage staff, view revenue analytics, delete records, full CRUD |
| `alex_tech` | `tech123` | **Technician** | Update diagnostics, bench notes, parts & labor costs, advance repair status |
| `david_tech` | `tech123` | **Technician** | Micro-soldering specialist, advance repair status |
| `emma_staff` | `staff123` | **Front Desk / Staff** | Customer intake, device registration, print intake tickets & invoices, mark delivered |

---

## 🎫 Sample Ticket Numbers for Tracking

You can paste any of these into the **Track Ticket** tab or click the sample pill buttons:
- `REP-20261001-1001` (iPhone 14 Pro Max - *In Repair*)
- `REP-20261002-1002` (MacBook Pro 16" - *Ready for Pickup*)
- `REP-20261003-1003` (Dell XPS 15 - *Diagnosing*)
- `REP-20260928-1004` (Galaxy S23 Ultra - *Delivered & Paid*)
- `REP-20261008-1005` (PlayStation 5 Disc Edition - *Received*)

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── pom.xml
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/repairtrack/
│       │   │   ├── RepairTrackApplication.java
│       │   │   ├── config/             # WebConfig (CORS), DataInitializer
│       │   │   ├── controller/         # Customer, Device, Repair, Dashboard, User, Auth
│       │   │   ├── dto/                # Request & Response DTOs
│       │   │   ├── entity/             # JPA Entities: Customer, Device, Repair, User, History
│       │   │   ├── exception/          # GlobalExceptionHandler, Custom exceptions
│       │   │   ├── repository/         # Spring Data JPA Repositories
│       │   │   └── service/            # Business logic layer
│       │   └── resources/
│       │       ├── application.properties         # Zero-setup H2 (MySQL Mode)
│       │       ├── application-mysql.properties   # Production MySQL config
│       │       ├── schema-mysql.sql               # MySQL DDL script
│       │       └── data-mysql.sql                 # MySQL seed data script
│       └── test/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                     # Master state & view router
│       ├── main.jsx
│       ├── index.css
│       ├── components/                 # Sidebar, Header, Modals, Printable Invoice, Toast
│       ├── services/                   # api.js client
│       ├── utils/                      # statusHelper.js (colors, transitions, formatting)
│       └── views/                      # Dashboard, Repairs, Customers, Devices, TrackJob, Staff
└── README.md
```

---

## 📋 Key Functional Requirements Satisfied

1. **Customer Management**: Add, view, edit, delete, and search customers with validation and duplicate phone/email detection.
2. **Device Management**: Link devices to owners with device type, brand, model, serial number/IMEI, physical intake condition, and accessories.
3. **Repair Tracking Workflow**: Strict status progression (`Received` -> `Diagnosing` -> `In Repair` -> `Ready for Pickup` -> `Delivered` -> `Cancelled`).
4. **Service History Audit Trail**: Every status change logs the author, timestamp, and notes in an immutable history table.
5. **Cost Calculation**: Automated computation of parts cost, labor cost, subtotal, tax, and final amount due.
6. **Dashboard Overview**: Summary counters for active jobs, devices awaiting pickup, completed jobs, pipeline value, and collected revenue.
7. **Printable Documentation**: Print-optimized Customer Intake Receipts and itemized Service Invoices.
8. **Role-Based Access Control**: Tailored experiences for Administrators, Repair Technicians, and Front-Desk Staff.
