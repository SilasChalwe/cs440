# University Student Loan & Allowance System Frontend

Frontend application for the CS440 assignment: **University Student Loan & Allowance System Using the Chinese Wall Security Model**.

## What This App Does

This UI provides role-based portals for:
- `Student`
- `Bank Officer`
- `University Admin`

It demonstrates:
- Chinese Wall conflict prevention (banks cannot access competing bank students)
- Loan and allowance processing flows
- Access denied warnings for policy violations
- Audit log visibility for administrators

## Main Features

- Role-based login and dashboards
- Student dashboard (profile, loans, allowances, messages)
- Bank dashboard (assigned students, transactions, disbursement)
- Admin dashboard (assignment management, user management, logs, report export)
- Access denied modal for Chinese Wall conflicts
- Mock mode for demo without backend
- HTTP mode for real backend integration

## Environment Configuration

Create `.env` (or copy from `.env.example`) and set:

```bash
VITE_BACKEND_API_MODE=mock
VITE_BACKEND_API_BASE_URL=http://localhost:8080
VITE_BACKEND_API_TIMEOUT_MS=10000
```

Use real backend:

```bash
VITE_BACKEND_API_MODE=http
VITE_BACKEND_API_BASE_URL=your_backend_api_url
```

Notes:
- `mock` mode uses in-memory demo data.
- `http` mode sends requests to your backend API.

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Lighthouse Audit

1. Build and run preview:

```bash
npm run build
npm run preview
```

2. In another terminal run Lighthouse:

```bash
npm run lighthouse
```

Report output:
- `lighthouse-report.html`

## Demo Accounts (Mock Mode)

- Student: `silas / pass123`
- Bank Officer (Zanaco): `zanaco_officer / pass123`
- Admin: `admin / admin123`

## Chinese Wall Demo Flow

1. Login as bank officer.
2. Open assigned student and process allowance.
3. Attempt to open competing bank student (blocked with Access Denied modal).
4. Login as admin and verify logs.

## Project Structure

- `src/pages/` role-based screens
- `src/components/` reusable UI components
- `src/services/` mock and HTTP service layers
- `src/config/api.ts` backend endpoint/env configuration
- `src/types/` domain models

## Assignment Alignment

This frontend covers the GUI and UX requirements for:
- Role-specific interfaces
- Chinese Wall conflict prevention visibility
- Loan/allowance operation workflows
- Dashboard and audit trail presentation

Backend-side enforcement and persistence must still be implemented in your API/database layer.
