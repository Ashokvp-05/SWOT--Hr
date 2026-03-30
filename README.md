# Rudratic HR — Global Personnel Intelligence Hub

[![UX-Enterprise](https://img.shields.io/badge/UX-Enterprise--Grade-6366f1)](#)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016%20(Turbopack)-black)](#)
[![Stack](https://img.shields.io/badge/Stack-Full--Stack%20Typescript-3178c6)](#)
[![Security](https://img.shields.io/badge/Security-Multi--Tenant%20RBAC-059669)](#)

**Rudratic HR** is a high-fidelity, professional HR Intelligence and Management Platform designed for modern enterprises. Inspired by Zoho-style aesthetics, it provides a unified "One True Navbar" experience with specialized command centers for every role in the organizational hierarchy.

---

## 🚀 Vision & Core Pillars

### 🏬 Unified Global Governance
A sophisticated, glassmorphism-based **Global Navbar** that synchronizes platform-wide search, notifications, and role-based portal switching. It dynamically adjusts to provide custom sub-navigation for Super Admins and specialized modules.

### 🏛️ Role-Based Command Centers
- **Root Authority (Super Admin)**: Global platform oversight, tenant provisioning, system health monitoring, and security audit streams.
- **Strategic Management (HR Manager)**: Full-lifecycle workforce management including Attendance Rate Pulses, Leave Approval Centers, and Performance Kudos.
- **Operational Leadership (Manager)**: Team oversight, objective tracking, and departmental performance diagnostics.
- **Compliance & Audit**: Forensic visibility into system logs, data integrity verification, and labor law compliance monitoring.
- **Personnel Hub (Employee)**: Intuitive attendance terminal (Office/Remote), leave inventory tracking, and personal development insights.

### 🛡️ Enterprise Security (RBAC)
Robust Role-Based Access Control (RBAC) implemented via **NextAuth v5 (Beta)** and a custom `RoleGate` architecture. Every module is protected by strict permission inheritance, ensuring sensitive HR data is only accessible to authorized personnel.

---

## 🛠️ Technical Ecosystem

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router) | High-performance Server Components & Turbopack. |
| **Logic** | TypeScript (Strict) | End-to-end type safety for HR operations. |
| **Database** | PostgreSQL + Prisma ORM | Relational data integrity for global personnel records. |
| **Security** | Next-Auth v5 + JWT | Enterprise-grade authentication and session management. |
| **UI System** | Tailwind CSS + Lucide | Zoho-inspired "Professional-Grade" design system. |
| **Real-time** | Node-Cron + Node-Cache | Background task orchestration and performance optimization. |

---

## 📂 Project Governance Structure

- **`/frontend`**: The unified UI hub.
  - `/src/app/(dashboard)`: Unified dashboard routes inheriting global navigation.
  - `/src/components/layout`: Core "One True Navbar" and global layout architecture.
  - `/src/components/auth`: RBAC implementation and Security Gates.
- **`/backend`**: The robust API core.
  - `/src/routes`: Atomic API endpoint distribution for RBAC-filtered data.
  - `/prisma/schema.prisma`: The "Single Source of Truth" for organizational data.
  - `/src/services`: Core business logic (Payroll, Attendance, etc.).

---

## 🔧 Operational History & Troubleshooting

During the initial deployment phase, the following engineering challenges were identified and systematically resolved:

### 1. **Infrastructure Handshake Failure**
- **Issue**: Docker Desktop API (`npipe`) was inaccessible during initial orchestration, blocking automated containerized database provisioning.
- **Resolution**: Transitioned to localized runtime services (Node.js/Next.js) with host-level PostgreSQL integration to restore full operational status.

### 2. **Development Runtime Instability**
- **Issue**: The Next.js dev server encountered premature exits (Code 1) during Turbopack initialization on the unified dashboard port (3000).
- **Resolution**: Stabilized the build process via manual `npx next dev` sequences with increased wait-times to ensure full compilation of the enterprise design system.

### 3. **Data Connection Verification Timeout**
- **Issue**: Standard `check_db.ts` handshake failure during initial schema synchronization.
- **Resolution**: Established stable database connection through manual schema push and Prisma client regeneration, ensuring high-fidelity data synchronization for the company.

---

*Note: Every system mutation is captured in the Company Audit Logs to maintain absolute transparency and security integrity.*

---

*Engineered for Tactical HR Excellence. (C) 2026 Rudratic Personnel Core.*
