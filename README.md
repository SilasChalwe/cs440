# CS440 — University Student Loan & Allowance System

## ◈ Chinese Wall Security Model Implementation

[INFO] **Course:** CS440 — Information Security Models
[INFO] **Architecture:** Full-Stack Application (Monorepo)
[INFO] **Frontend:** React + TypeScript + Vite
[INFO] **Backend:** Spring Boot

---

## ▣ Project Overview

This project implements a **University Student Loan & Allowance Management System** that enforces the **Chinese Wall Security Model** to prevent conflicts of interest between banks.

In this scenario, the university distributes student loans and monthly allowances through multiple banks (for example: Zanaco and FNB). Each student is assigned to a specific bank.

### ◇ What the system guarantees

- [SEC] Strict bank-to-bank data isolation
- [SEC] Enforcement of Chinese Wall conflict-of-interest rules
- [SEC] Controlled access to student financial records
- [AUDIT] Logging of all access attempts
- [UI] A complete graphical interface for demonstrations

---

## ▣ Repository Structure

```text
cs440-chinese-wall-model/
├── apps/
│   ├── api/        # Spring Boot backend
│   └── web/        # React frontend (Vite + TypeScript)
├── docs/           # Assignment documentation & screenshots
└── README.md       # Root project documentation
```

The monorepo keeps backend and frontend in one repository while maintaining clear separation between application layers.

---

## ▣ Backend — Spring Boot API

The backend handles:

- Chinese Wall access control enforcement
- Loan processing
- Monthly allowance distribution
- Bank–student isolation logic
- Access logging and auditing
- Database interaction

[LINK] **Backend technical documentation:** `apps/api/README.md`

---

## ▣ Frontend — React + TypeScript + Vite

The frontend provides interfaces for:

- Bank login and secure access
- Student record viewing
- Loan and allowance processing
- University administrative dashboard
- Real-time conflict detection alerts

The UI highlights blocked access attempts when a bank tries to access unauthorized student data.

[LINK] **Frontend documentation:** `apps/web/README.md`

---

## ▣ Chinese Wall Enforcement Example

### ◇ Example setup

- Alice → Assigned to Zanaco
- Bob → Assigned to FNB

### ◇ Demonstration flow

1. Zanaco logs in → can access Alice's data.
2. Zanaco attempts to access Bob → access denied.
3. FNB logs in → can access Bob's data.

All cross-bank unauthorized attempts are blocked and logged.

---

## ▣ Quick Start

### 1) Start backend

```bash
cd apps/api
./mvnw spring-boot:run
```

Backend URL: `http://localhost:8080`

### 2) Start frontend

```bash
cd apps/web
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

The frontend communicates with the backend using REST APIs.

---

## ▣ Production Build

### ◇ Backend build

```bash
cd apps/api
./mvnw clean package
java -jar target/*.jar
```

Build output: `apps/api/target/`

### ◇ Frontend build

```bash
cd apps/web
npm run build
```

Build output: `apps/web/dist/`

These files can be served by Spring Boot static resources or any web server.

---

## ▣ Environment Requirements

Install and configure:

- Java 17+
- Node.js (v18+ recommended)
- Maven Wrapper (included)
- Database settings in `application.yml`

Configuration file:

- `apps/api/src/main/resources/application.yml`

---

## ▣ Screenshots

Store screenshots in:

- `docs/screenshots/`

Suggested captures:

- Bank dashboard view
- Conflict access denied alert
- University admin dashboard
- Loan processing interface

---

## ▣ Key Features

- Role-based graphical interface
- Secure loan processing
- Allowance management
- Chinese Wall conflict prevention
- Access logging and auditing
- Clean separation of frontend and backend layers

---

## ▣ Academic Purpose

This project was developed for **CS440 — Information Security Models** to demonstrate a practical full-stack implementation of the Chinese Wall model with a working GUI.

It is intended for academic presentation and demonstration of conflict-of-interest enforcement in distributed financial systems.
