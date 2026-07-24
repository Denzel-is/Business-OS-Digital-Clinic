# Business OS: Digital Clinic

Business OS: Digital Clinic is an interactive digital clinic for diagnosing operational friction and turning it into fast, usable, and secure IT systems.

> Current status: the project is complete through stage 15. The complete four-service local stack,
> hardened production composition, separate application images, health checks, secret-file
> injection, CI test gates, dependency/secret/container scanning, and reproducible Docker builds are
> implemented. Complete operational and project documentation follows in stage 16.

## Product direction

The product will position its owner as an IT specialist who analyzes business processes, identifies digital problems, designs practical solutions, improves UX, automates manual work, integrates AI responsibly, and measures business impact without presenting demo data as real client results.

Core message:

> Диагностирую цифровые проблемы бизнеса и превращаю их в быстрые, удобные и защищённые IT-системы.

## Planned architecture

```text
Business_OS_Digital_Clinic/
├── backend/                 Java 21 and Spring Boot API foundation
├── frontend/                Next.js/React application foundation
├── infrastructure/          deployment and platform contract
├── docs/                    architecture and documentation map
├── .github/
│   └── workflows/           CI contract; workflows arrive with build targets
├── .editorconfig            editor-independent formatting baseline
├── .gitattributes           deterministic text and binary handling
├── .env.example             non-secret local configuration contract
├── AGENTS.md                repository contribution rules
├── docker-compose.yml       complete local stack
├── docker-compose.prod.yml  hardened production composition
├── .gitignore
├── README.md
└── SECURITY.md              vulnerability reporting policy
```

The backend will use package-by-feature boundaries. The frontend will use Server Components by default and isolate interactive browser code. PostgreSQL is the system of record; Redis supports bounded caching and rate-limit counters. Frontend and backend will ship as separate production containers behind a Cloudflare-ready edge configuration.

## Delivery plan

1. Audit and preparation baseline — complete.
2. Monorepo initialization — complete.
3. Backend foundation — complete.
4. Frontend foundation — complete.
5. Design system — complete.
6. Homepage and accessible content structure — complete.
7. Motion design with reduced-motion support — complete.
8. Business Diagnostic — complete.
9. Demo projects and cases — complete.
10. Security Center — complete.
11. Database model and migrations — complete.
12. Authentication and protected administration — complete.
13. Security hardening — complete.
14. Automated testing — complete.
15. Docker and CI/CD — complete.
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

Copy the matching local environment contract and start only the data services:

```powershell
Copy-Item .env.example .env
docker compose up -d postgres redis
docker compose ps
```

The documented password is a public local-development value, not a production secret. Replace it
outside local development and never commit `.env`.

Stop the local services without deleting their data:

```powershell
docker compose stop postgres redis
```

`docker compose down` removes containers and the network but preserves named volumes unless
`--volumes` is explicitly supplied.

## Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The local API, health endpoint, and Business Diagnostic contract are documented in `docs/API.md`.
If startup reports `SCRAM-based authentication, but no password was provided`, create the root
`.env` from `.env.example` and ensure the PostgreSQL container uses the same local password.

## Start the frontend

In a second PowerShell window:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:3000`. The interactive diagnostic is available at `http://localhost:3000/diagnostic`; Security Center is available at `http://localhost:3000/security`; the protected administration login is at `http://localhost:3000/admin/login`. Configure the one-time local administrator as documented in `docs/AUTHENTICATION.md`. These server-backed features require the backend on `http://localhost:8080` unless `BACKEND_PUBLIC_URL` is configured differently.

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

Validate and start the complete local stack:

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

Container builds and the local/production Compose boundaries are implemented. Deployment,
backup/restore, and rollback procedures are completed in stage 16.

## Security

Security is a layered risk-reduction practice, not a promise of absolute protection. Application controls will be combined with validation, authorization, secure sessions, rate limiting, monitoring, dependency scanning, backups, and edge controls such as CDN and WAF. Public content cannot be made impossible to copy, and DDoS mitigation cannot be provided by Java code alone.

Report vulnerabilities privately through the process in `SECURITY.md`. Do not include secrets or personal data in issues.

## Repository workflow

The canonical remote is [Denzel-is/Business-OS-Digital-Clinic](https://github.com/Denzel-is/Business-OS-Digital-Clinic). The baseline is created on `main`; subsequent development uses `codex/initial-development`. Force pushes and committed secrets are prohibited. See `AGENTS.md` for the complete working agreement.
