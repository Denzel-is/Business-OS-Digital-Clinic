# Testing

## Test strategy

Stage 14 establishes a layered, repeatable verification contract. A passing unit test does not
replace integration or browser checks; each layer owns a different failure class.

| Layer | Tools | Primary evidence |
| --- | --- | --- |
| Java unit | JUnit 5, AssertJ, Mockito | scoring, validation, fingerprints, filter failure modes, account throttling, Turnstile decisions |
| Java web/security | Spring Boot Test, MockMvc, Spring Security Test | Problem Details, CSRF, CORS, public/protected routes, role boundaries |
| Java integration | Testcontainers PostgreSQL 17 and Redis 7 | Flyway from empty DB, JPA validation, auth/audit, contact/lead transactions, upload policy, atomic counters |
| Frontend unit/component | Vitest, Testing Library, jsdom | contracts, UI states, consent, admin-role helpers, cookie allowlist |
| Browser | Playwright Chromium | responsive rendering, keyboard navigation, reduced motion, diagnostic, filters, security lab, login, contact |
| Build/static | Maven, TypeScript, ESLint, Prettier, Next build | toolchain, formatting, strict types, production rendering boundaries |

## Backend

Run from `backend/` with Java 21:

```powershell
.\mvnw.cmd clean verify
```

The command compiles production and test code, runs every JUnit/Testcontainers test, packages the
executable jar, and enforces Spotless. Docker Desktop is required because integration tests create
isolated PostgreSQL and Redis containers with synthetic data.

Fast test profiles deliberately disable the external Redis hardening bean. Redis behavior is tested
separately against a real Redis container, including atomic capacity denial, blocked-state lookup,
and key clearing.

Security-sensitive assertions cover:

- generic known/unknown credential failures;
- BCrypt cost and absence of plaintext storage;
- ADMIN/EDITOR separation and anonymous rejection;
- CSRF enforcement and strict CORS allowlist;
- per-client and per-account rate-limit behavior;
- fail-closed Redis unavailability without leaking internals;
- audit and security-event persistence without submitted secrets;
- consent and honeypot persistence boundaries;
- file-signature allowlisting and path-independent UUID storage;
- Turnstile hostname/action matching and upstream failure.

Surefire XML and text reports are written under `backend/target/surefire-reports/`.

## Frontend

Install exactly the lockfile and run all non-browser checks:

```powershell
npm.cmd ci
npm.cmd run format:check
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd audit --audit-level=high
```

Vitest checks strict Zod contracts, safe text rendering, reduced client logic, consent state, admin
access helpers, and the backend-cookie allowlist. Tests must not require real credentials, personal
data, Cloudflare keys, or a running backend.

## Browser

Build first, then run:

```powershell
npm.cmd run build
npm.cmd run test:e2e
```

Playwright starts the production Next server on `127.0.0.1:3100`. Backend-dependent browser actions
use explicit route mocks and assert the exact allowlisted payload. Backend authorization itself is
verified with MockMvc and PostgreSQL rather than being simulated as a browser-only guarantee.

The browser suite checks:

- homepage media and headers;
- keyboard and mobile navigation;
- no horizontal overflow;
- reduced-motion fallback and runtime switching;
- diagnostic completion without contact leakage;
- project category filters and honest labels;
- design-system responsiveness;
- dangerous-looking input rendered as text;
- generic administrator login failure;
- consented contact submission with an empty honeypot.

## Test data

- Use reserved `.test` email domains and visibly synthetic names.
- Never copy production records, secrets, access tokens, session ids, or customer files.
- Flyway seed remains public demo content only.
- Generated uploads stay under ignored `backend/target/` during tests.
- Testcontainers are disposable and must not connect to the local development database.

## Safe testing boundary

Do not run load, stress, scraping, DDoS, destructive, or third-party security tests as part of this
suite. Rate limiting is verified with a few deterministic in-process requests and counter calls.
Any future performance test requires a separately authorized isolated environment and explicit
traffic limits.

## Release gate

Before a stage is committed and pushed:

1. inspect `git status`, `git diff`, and `git diff --check`;
2. run the relevant backend and frontend commands above;
3. validate Docker Compose when infrastructure files are in scope;
4. scan for secret patterns and ensure `.env` is untracked;
5. review reports and fix failures rather than bypassing checks;
6. stage only files belonging to the current stage.
