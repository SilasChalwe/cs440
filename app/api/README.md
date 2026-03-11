# Student Loan System Backend

Spring Boot backend for university student loan and allowance processing with role-based access and JWT authentication.

## Stack
- Java 17
- Spring Boot 4
- Spring Security (JWT)
- Spring Data JPA
- SQLite
- Springdoc OpenAPI (Swagger UI)

## Quick Start
1. Create a `.env` file in the project root (or copy from `.env.example`):
```bash
cp .env.example .env
```
2. Set values in `.env`:
```env
APP_JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
APP_JWT_EXPIRATION_MS=900000
APP_REQUIRE_SSL=false
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
APP_MONTHLY_ALLOWANCE=1500.00
APP_MONTHLY_ALLOWANCE_NOTE=Monthly allowance disbursement
APP_MONTHLY_ALLOWANCE_CRON=0 0 8 1 * *
```
3. Run the app:
```bash
mvn spring-boot:run
```

App starts on `http://localhost:8080`.

## API Docs
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Main Endpoints
- `POST /api/auth/login` (public)
- `GET /api/health` (public)
- `GET /api/admin/**` (ROLE_ADMIN)
- `POST /api/admin/students` (ROLE_ADMIN)
- `PUT /api/admin/students/{studentId}/bank` (ROLE_ADMIN)
- `POST /api/admin/monthly-allowances/run` (ROLE_ADMIN)
- `GET/POST /api/bank/**` (ROLE_BANK)
- `GET /api/student/**` (ROLE_STUDENT)

## Demo Flow (Backend)
1. Login as `bank_zanaco` and access `/api/bank/students/1` (allowed).
2. Access `/api/bank/students/2` with same token (blocked by Chinese Wall with `403`).
3. Login as `admin` and open `/api/admin/access-logs` to show ALLOWED and DENIED entries.
4. Trigger monthly batch through `/api/admin/monthly-allowances/run`.

## Testing
Run all tests:
```bash
mvn test
```

## Database Initialization
- SQL scripts are executed automatically by Spring Boot (no custom runner class required).
- Triggered by:
  - `spring.sql.init.mode=always` in [application.properties](/home/silas/repo/student-loan-system-backend/src/main/resources/application.properties)
- Files executed on startup:
  - [schema.sql](/home/silas/repo/student-loan-system-backend/src/main/resources/schema.sql)
  - [data.sql](/home/silas/repo/student-loan-system-backend/src/main/resources/data.sql)
- Current seed includes:
  - 5 banks
  - 40 students
  - 1 admin user
  - student logins with uniform password `test1234`
- Because seed uses `INSERT OR IGNORE`, existing rows are not overwritten.  
  To fully refresh seeded data:
```bash
rm -f student-loan-system.db
mvn spring-boot:run
```

## Security Notes
- JWT secret is loaded from `APP_JWT_SECRET` and is required.
- JWT expiry is controlled by `APP_JWT_EXPIRATION_MS` (default: `900000` = 15 minutes).
- CORS allowed origins are controlled by `APP_CORS_ALLOWED_ORIGINS` (comma-separated).
- `.env` is loaded automatically from project root.
- HTTP security headers are enabled (HSTS, frame deny, no-referrer, content-type options).
- API is stateless and uses JWT bearer tokens.
- `APP_REQUIRE_SSL=true` forces secure channel (`https`) at Spring Security level.
- Demo seed users in `src/main/resources/data.sql` are for local testing only and must be replaced for production.

## Production Checklist
- Use HTTPS with valid certificates (reverse proxy or direct TLS).
- Store `APP_JWT_SECRET` in a secure secret manager and rotate regularly.
- Replace demo credentials and enforce strong password policies.
- Restrict CORS to trusted frontend origins only.
- Add audit logging/monitoring and rate limiting for auth and money endpoints.
