# AGENTS.md

## Scope

These instructions apply to the entire `Business_OS_Digital_Clinic` monorepo.

## Repository layout

- `backend/` — Java 21 and Spring Boot API.
- `frontend/` — Next.js App Router application.
- `infrastructure/` — deployment and platform configuration.
- `docs/` — architecture, API, design, security, operations, and testing guides.
- `.github/workflows/` — CI, security, and container workflows.

The repository is currently at the preparation stage. Do not treat placeholder directories as implemented applications.

## Local commands

Run commands from the repository root unless a command starts with `cd`.

### Development

```powershell
docker compose up -d postgres redis
cd backend
.\mvnw.cmd spring-boot:run
```

In a second terminal:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

### Verification

```powershell
cd backend
.\mvnw.cmd clean verify
```

```powershell
cd frontend
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

```powershell
docker compose config
```

### Formatting

Use the formatter configured by each application. Do not introduce a formatter without documenting and enforcing it in CI.

```powershell
cd backend
.\mvnw.cmd spotless:check
```

```powershell
cd frontend
npm.cmd run format:check
```

These commands become mandatory once their configuration is added in the corresponding foundation stage.

## Java rules

- Target Java 21 and use the Maven Wrapper.
- Organize code package-by-feature, then by `api`, `application`, `domain`, and `infrastructure` where those layers add value.
- Use constructor injection; never use field injection.
- Keep JPA entities internal and expose immutable DTOs, preferably records where suitable.
- Put transaction boundaries in the application/service layer.
- Use Bean Validation, centralized Problem Details, pagination, indexes, Flyway migrations, and optimistic locking where conflicts are possible.
- Use JPA or parameterized queries; never build SQL by string concatenation.
- Do not return stack traces, secrets, or internal exception details to clients.
- Avoid Lombok and MapStruct unless their benefit is concrete and documented.

## TypeScript rules

- Keep TypeScript strict mode enabled.
- Prefer React Server Components; use Client Components only for browser interactivity.
- Route backend access through one typed API client.
- Model loading, error, empty, and reduced-motion states explicitly.
- Keep Java business rules on the backend.
- Maintain keyboard access, visible focus, semantic HTML, and responsive layouts without horizontal overflow.
- Dynamically load GSAP and Three.js only where needed.

## Security requirements

- Never commit `.env` files, credentials, tokens, keys, production data, database dumps, or private media.
- Validate all untrusted data on the server and encode output for its context.
- Enforce authorization on every protected backend operation; a hidden URL is not a security control.
- Keep cookie authentication compatible with CSRF protection and `HttpOnly`, `Secure`, and `SameSite` attributes.
- Use a strict CORS allowlist, rate limits, request-size limits, security headers, safe file handling, and audit events without sensitive values.
- Never create offensive scanners, injection tools, DDoS tooling, or protection-bypass features.
- Do not claim absolute protection or present demo data as real outcomes.

## Git workflow

- Use `main` only for the approved baseline and reviewed integration.
- Implement subsequent stages on `codex/initial-development` or a specifically approved branch.
- Keep commits stage-focused and use clear Conventional Commit messages.
- Inspect `git diff` and `git status` before staging.
- Stage only files related to the current stage.
- Never rewrite published history or use `git push --force`.
- Do not bypass failing checks.

## Definition of done before push

- The relevant backend and frontend checks pass.
- Docker Compose configuration validates when Compose files are in scope.
- New migrations apply from an empty database when persistence changes.
- Security-sensitive behavior has focused tests.
- No secrets, generated artifacts, or unrelated user changes are staged.
- Documentation matches the implemented behavior and known limitations.
- The exact diff and test results have been reviewed.
