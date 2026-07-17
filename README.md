# Business OS: Digital Clinic

Business OS: Digital Clinic is an interactive digital clinic for diagnosing operational friction and turning it into fast, usable, and secure IT systems.

> Current status: monorepo initialization complete. Shared repository contracts and module boundaries exist; application code, Compose services, tests, and production workflows will be added in the staged implementation that follows. Commands below become runnable as their respective foundation stages land.

## Product direction

The product will position its owner as an IT specialist who analyzes business processes, identifies digital problems, designs practical solutions, improves UX, automates manual work, integrates AI responsibly, and measures business impact without presenting demo data as real client results.

Core message:

> Диагностирую цифровые проблемы бизнеса и превращаю их в быстрые, удобные и защищённые IT-системы.

## Planned architecture

```text
Business_OS_Digital_Clinic/
├── backend/                 Java/Spring Boot module contract
├── frontend/                Next.js/React module contract
├── infrastructure/          deployment and platform contract
├── docs/                    architecture and documentation map
├── .github/
│   └── workflows/           CI contract; workflows arrive with build targets
├── .editorconfig            editor-independent formatting baseline
├── .gitattributes           deterministic text and binary handling
├── .env.example             non-secret local configuration contract
├── AGENTS.md                repository contribution rules
├── docker-compose.yml       local stack (planned)
├── docker-compose.prod.yml  production stack (planned)
├── .gitignore
├── README.md
└── SECURITY.md              vulnerability reporting policy
```

The backend will use package-by-feature boundaries. The frontend will use Server Components by default and isolate interactive browser code. PostgreSQL is the system of record; Redis supports bounded caching and rate-limit counters. Frontend and backend will ship as separate production containers behind a Cloudflare-ready edge configuration.

## Delivery plan

1. Audit and preparation baseline — complete.
2. Monorepo initialization — complete.
3. Backend foundation.
4. Frontend foundation.
5. Design system.
6. Homepage and accessible content structure.
7. Motion design with reduced-motion support.
8. Business Diagnostic.
9. Demo projects and cases.
10. Security Center.
11. Database model and migrations.
12. Authentication and protected administration.
13. Security hardening.
14. Automated testing.
15. Docker and CI/CD.
16. Complete project documentation.
17. Final audit and draft pull request.

Each stage is reviewed, verified, committed, and pushed independently before the next stage starts.

## Prerequisites for Windows

- Git 2.40 or newer.
- Java 21 LTS (Temurin recommended); set `JAVA_HOME` and add `%JAVA_HOME%\bin` to `Path`.
- Node.js LTS with npm.
- Docker Desktop with Docker Compose v2.
- Maven does not need a global installation: use `backend\mvnw.cmd` once the backend foundation is present.

Verify the tools in PowerShell:

```powershell
git --version
java -version
node --version
npm.cmd --version
docker --version
docker compose version
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` as shown throughout this guide; changing the machine execution policy is not required.

## Installation on Windows

```powershell
git clone https://github.com/Denzel-is/Business-OS-Digital-Clinic.git
cd Business-OS-Digital-Clinic
git switch codex/initial-development
Copy-Item .env.example .env
```

Edit `.env` locally with development-only values. Never commit `.env`.

Install project dependencies after the application foundations exist:

```powershell
cd backend
.\mvnw.cmd --version
cd ..\frontend
npm.cmd ci
cd ..
```

## Environment variables

`.env.example` is the current contract for names and safe local defaults. It will be refined alongside implementation. Its groups include:

- PostgreSQL connection and database names.
- Redis host and port.
- Backend and frontend public origins.
- Cookie and CORS settings.
- Cloudflare Turnstile site/secret keys for deployed public forms.
- Bootstrap administrator settings handled without committing credentials.

Use a secret manager for deployed environments. Do not place real secrets in Compose files, Docker images, browser-exposed variables, source control, or logs.

## Start PostgreSQL and Redis

After `docker-compose.yml` is added:

```powershell
docker compose up -d postgres redis
docker compose ps
```

Stop the local services without deleting their data:

```powershell
docker compose stop
```

## Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The local API and health endpoint will be documented in `docs/API.md` when the backend foundation is implemented.

## Start the frontend

In a second PowerShell window:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:3000`.

## Testing

Backend:

```powershell
cd backend
.\mvnw.cmd clean verify
```

Frontend:

```powershell
cd frontend
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

## Docker

Validate and start the complete local stack after Compose configuration is implemented:

```powershell
docker compose config
docker compose up -d --build
docker compose ps
```

Use the production definition only with an explicit production environment file managed outside Git:

```powershell
docker compose -f docker-compose.prod.yml --env-file .env.production config
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## Production build

```powershell
cd backend
.\mvnw.cmd clean verify
```

```powershell
cd frontend
npm.cmd ci
npm.cmd run build
```

Container builds, deployment checks, Cloudflare configuration, backup/restore procedures, and rollback steps will be documented before production readiness is claimed.

## Security

Security is a layered risk-reduction practice, not a promise of absolute protection. Application controls will be combined with validation, authorization, secure sessions, rate limiting, monitoring, dependency scanning, backups, and edge controls such as CDN and WAF. Public content cannot be made impossible to copy, and DDoS mitigation cannot be provided by Java code alone.

Report vulnerabilities privately through the process in `SECURITY.md`. Do not include secrets or personal data in issues.

## Repository workflow

The canonical remote is [Denzel-is/Business-OS-Digital-Clinic](https://github.com/Denzel-is/Business-OS-Digital-Clinic). The baseline is created on `main`; subsequent development uses `codex/initial-development`. Force pushes and committed secrets are prohibited. See `AGENTS.md` for the complete working agreement.
