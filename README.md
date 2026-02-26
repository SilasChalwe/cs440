CS440 – University Student Loan & Allowance System

Chinese Wall Security Model Implementation

    

Course: CS440 – Information Security Models
Architecture: Full-Stack Application (Monorepo)
Frontend: React + TypeScript + Vite
Backend: Spring Boot


---

▣ Project Overview

This system implements a University Student Loan & Allowance Management System that enforces the Chinese Wall Security Model to prevent conflicts of interest between banks.

The university distributes student loans and monthly allowances through multiple banks (e.g., Zanaco, FNB). Each student is assigned to a specific bank.

The system guarantees:

▸ Strict bank-to-bank data isolation

▸ Enforcement of Chinese Wall conflict-of-interest rules

▸ Controlled access to student financial records

▸ Audit logging of all access attempts

▸ A complete graphical interface for demonstration



---

▣ Repository Structure

cs440-chinese-wall-model/
│
├── apps/
│   ├── api/        # Spring Boot Backend
│   └── web/        # React Frontend (Vite + TypeScript)
│
├── docs/           # Assignment documentation & screenshots
└── README.md       # Root project documentation

This project follows a professional monorepo structure, where both the backend (API) and frontend (Web application) are maintained inside a single repository while remaining logically separated into independent applications.


---

▣ Backend – Spring Boot API

The backend is responsible for:

Chinese Wall access control enforcement

Loan processing

Monthly allowance distribution

Bank–student isolation logic

Access logging and auditing

Database interaction


API Endpoints & Technical Documentation

All endpoint definitions, request/response formats, controller details, and database configuration are documented inside:

➡ apps/api/README.md

This keeps backend documentation isolated and professionally structured.


---

▣ Frontend – React + TypeScript + Vite

The frontend provides a graphical interface for:

Bank login and secure access

Student record viewing

Loan and allowance processing

University administrative dashboard

Real-time conflict detection alerts


The GUI clearly highlights blocked access attempts when a bank tries to access unauthorized student data.

Frontend Architecture & UI Documentation

Component structure, routing, state management, and UI flow are documented inside:

➡ apps/web/README.md

This separation ensures clean documentation per application layer.


---

▣ Chinese Wall Model Enforcement Example

Example Setup:

Alice → Assigned to Zanaco

Bob → Assigned to FNB


Demonstration Flow:

1. Zanaco logs in → Can access Alice’s data.


2. Zanaco attempts to access Bob → Access Denied.


3. FNB logs in → Can access Bob’s data.



The system prevents cross-bank interference and logs all access attempts.


---

▣ Quick Start Guide

1. Start Backend

cd apps/api
./mvnw spring-boot:run

Backend runs at:

http://localhost:8080


---

2. Start Frontend

cd apps/web
npm install
npm run dev

Frontend runs at:

http://localhost:5173

The frontend communicates with the backend through REST APIs.


---

▣ Production Build

▸ Build Backend

cd apps/api
./mvnw clean package

JAR file location:

apps/api/target/

Run:

java -jar target/*.jar


---

▸ Build Frontend

cd apps/web
npm run build

Production files will be generated in:

apps/web/dist/

These can be served using Spring Boot static resources or any web server.


---

▣ Environment Requirements

Ensure the following are installed:

Java 17+

Node.js (v18+ recommended)

Maven Wrapper (included)

Database configured in application.yml


Database configuration file:

apps/api/src/main/resources/application.yml


---

▣ Screenshots

Place screenshots inside:

/docs/screenshots/

Suggested screenshots:

Bank Dashboard View

Conflict Access Denied Alert

University Admin Dashboard

Loan Processing Interface



---

▣ Key Features

Role-based graphical interface

Secure loan processing

Allowance management

Chinese Wall conflict prevention

Access logging & auditing

Clean separation of frontend and backend layers



---

▣ Academic Purpose

This project was developed for CS440 – Information Security Models to demonstrate a practical, full-stack implementation of the Chinese Wall security model with a working graphical user interface.

It is intended for academic presentation and demonstration of conflict-of-interest enforcement in distributed financial systems.
