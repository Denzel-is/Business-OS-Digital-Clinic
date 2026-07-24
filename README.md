# Business OS: Digital Clinic

Business OS: Digital Clinic is an interactive digital clinic for diagnosing operational friction
and turning it into fast, usable, and secure IT systems.

> Current status: stages 1–16 are complete. The monorepo contains the Java/Spring API, Next.js
> application, PostgreSQL and Redis persistence, protected administration foundation, security
> controls, layered tests, production containers, CI gates, and the complete project and
> operational documentation. Stage 17 is the final audit and release-readiness review.

## Product

The public experience explains services, presents honestly labelled demonstration cases, runs a
stateless Business Diagnostic, and provides a consent-based contact flow. Security Center is an
educational validation demonstration; it is not a scanner and does not claim to prove security.

The implemented administration boundary uses backend-enforced `EDITOR` and `ADMIN` roles. CRUD
publishing, MFA challenge delivery, account recovery, public media delivery, and production
infrastructure provisioning remain explicit limitations.

## Architecture

```text
browser
  -> Next.js frontend / same-origin BFF
      -> Spring Boot API
          -> PostgreSQL (system of record)
          -> Redis (rate-limit and security counters)
          -> private draft-upload volume
```

The frontend and backend ship as separate non-root containers. Production Compose publishes only
the frontend to the loopback interface; backend and data services remain on internal networks.
See [Architecture](docs/ARCHITECTURE.md) and the [documentation map](docs/README.md).

## Prerequisites for Windows

- Git 2.40 or newer;
- Java 21 LTS (Temurin recommended);
- Node.js 24 LTS and npm;
- Docker Desktop with Docker Compose v2.

Maven does not need a global installation because the repository includes the Maven Wrapper.

Verify in PowerShell:

```powershell
git --version
java -version
node --version
npm.cmd --version
docker --version
docker compose version
```

If PowerShell blocks `npm.ps1`, use `npm.cmd`; changing the machine execution policy is unnecessary.

## Install

```powershell
git clone https://github.com/Denzel-is/Business-OS-Digital-Clinic.git
cd Business-OS-Digital-Clinic
git switch master
Copy-Item .env.example .env
```

`.env.example` contains public local-development defaults. Edit the ignored `.env` only when
needed, and never put production credentials or personal data in it.

Install exact dependencies:

```powershell
cd backend
.\mvnw.cmd --version
cd ..\frontend
npm.cmd ci
cd ..
```

## Run the complete application with Docker

With Docker Desktop running:

```powershell
docker compose config
docker compose up -d --build
docker compose ps
```

Wait until all four services are `healthy`, then open:

- application: http://localhost:3000
- diagnostic: http://localhost:3000/diagnostic
- project cases: http://localhost:3000/projects
- Security Center: http://localhost:3000/security
- contact: http://localhost:3000/contact
- administrator login: http://localhost:3000/admin/login
- backend health: http://localhost:8080/actuator/health

View logs and stop without deleting named data volumes:

```powershell
docker compose logs -f backend frontend
docker compose down
```

Deleting volumes is a separate destructive operation and is not part of normal restart or update.

## Run applications from source

Start data services from the repository root:

```powershell
docker compose up -d postgres redis
```

Start the backend in one PowerShell window:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Start the frontend in a second window:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

The backend is available at `http://localhost:8080` and the frontend at
`http://localhost:3000`. If Java is not detected, set `JAVA_HOME` to a Java 21 JDK and add
`%JAVA_HOME%\bin` to `Path`.

## Optional local administrator

No administrator credential is committed. For one local bootstrap only, set the following in the
ignored `.env`:

```properties
BOOTSTRAP_ADMIN_ENABLED=true
BOOTSTRAP_ADMIN_EMAIL=your-local-admin@example.test
BOOTSTRAP_ADMIN_PASSWORD=use-at-least-16-characters
BOOTSTRAP_ADMIN_DISPLAY_NAME=Local administrator
```

Start the backend once, then set `BOOTSTRAP_ADMIN_ENABLED=false`, remove the password, and restart.
See [Authentication](docs/AUTHENTICATION.md). Production bootstrap requires a separately reviewed
secret-manager procedure and is intentionally not enabled by production Compose.

## Verify

Backend (Docker Desktop is required by Testcontainers):

```powershell
cd backend
.\mvnw.cmd clean verify
```

Frontend:

```powershell
cd frontend
npm.cmd ci
npm.cmd run format:check
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
npm.cmd audit --audit-level=high
```

Infrastructure:

```powershell
docker compose config
```

The complete release gate and test ownership are in [Testing](docs/TESTING.md). CI repeats backend,
frontend, browser, Compose, dependency, secret-history, image-build, and container scan checks.

## Production deployment

Production uses `docker-compose.prod.yml`, immutable registry digests, four protected secret files,
and an external TLS reverse proxy or Cloudflare Tunnel. Validate before rollout:

```powershell
docker compose -f docker-compose.prod.yml `
  --env-file C:\secure\business-os.production.env config
docker compose -f docker-compose.prod.yml `
  --env-file C:\secure\business-os.production.env up -d
docker compose -f docker-compose.prod.yml `
  --env-file C:\secure\business-os.production.env ps
```

Do not deploy by copying `.env.example`, use mutable image tags, expose the backend/data ports, or
place secrets in source control, image layers, command arguments, logs, or screenshots.

Follow [Deployment and recovery](docs/DEPLOYMENT.md), [Deployment security](docs/DEPLOYMENT_SECURITY.md),
[Threat model](docs/THREAT_MODEL.md), and [Incident response](docs/INCIDENT_RESPONSE.md) before a
real deployment.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Content guide](docs/CONTENT_GUIDE.md)
- [Media guide](docs/MEDIA_GUIDE.md)
- [Testing](docs/TESTING.md)
- [Security policy](SECURITY.md)
- [Complete documentation map](docs/README.md)

## Security and limitations

Security is layered risk reduction, not a promise of absolute protection. DDoS resilience requires
upstream capacity and edge controls; public content can be copied; scanners can miss issues; and
untested backups do not provide recovery.

The repository does not provision or claim an active production domain, Cloudflare configuration,
WAF, malware scanner, object-storage publication flow, monitoring provider, registry, deployment
credential, backup target, or supported production release. Demonstration content and results are
labelled and must not be presented as real client outcomes.

Report vulnerabilities privately through [SECURITY.md](SECURITY.md). Do not include secrets,
personal data, or exploit details in public issues.

## Git workflow

The canonical remote is
[Denzel-is/Business-OS-Digital-Clinic](https://github.com/Denzel-is/Business-OS-Digital-Clinic)
and the current integration branch is `master`. Use stage-focused Conventional Commits, review the
exact diff and checks before pushing, never force-push published history, and never commit secrets.
See [AGENTS.md](AGENTS.md) for repository rules.

## Delivery plan

Stages 1–16 are complete. Stage 17 covers the final repository audit, complete clean verification,
known-limitations review, and draft pull request/release handoff.
