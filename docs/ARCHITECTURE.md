# Architecture

## Status

This document records the monorepo contract established in stage 2. It describes intended boundaries, not completed application functionality. Runtime details will be promoted from planned to implemented only after their stage passes verification.

## System context

Business OS: Digital Clinic will expose a Next.js web application and a Spring Boot API. The API owns business rules and persistence. PostgreSQL is the system of record; Redis is limited to ephemeral concerns such as rate-limit counters and bounded caches. Cloudflare is an optional edge layer for CDN, WAF, bot controls, and origin protection.

```text
Browser
  |
  v
Cloudflare edge (deployment concern)
  |----------------------|
  v                      v
Next.js frontend     Spring Boot API
                           |       |
                           v       v
                      PostgreSQL  Redis
```

## Repository boundaries

| Path | Owns | Must not own |
| --- | --- | --- |
| `frontend/` | Presentation, interaction, typed API calls, client-safe validation | Authoritative business rules, credentials, direct database access |
| `backend/` | Business rules, authorization, persistence, integrations, audit events | Browser-only presentation or public media assets |
| `infrastructure/` | Runtime composition, deployment, edge and operational configuration | Application business logic or committed secrets |
| `docs/` | Versioned architecture, product, security, operations, and testing guidance | Claims that are not supported by implemented behavior |
| `.github/workflows/` | Automated quality, security, and image checks | Deployment secrets or checks that silently ignore failure |

## Backend dependency direction

Features own their API, application, domain, and infrastructure details. Domain code does not depend on web or persistence frameworks. Cross-feature reuse goes through explicit application contracts or narrowly scoped shared primitives; features do not reach into another feature's persistence internals.

## Frontend dependency direction

Routes compose features and reusable UI components. Features use one typed API layer rather than ad hoc network calls. Server Components are the default; Client Components are isolated at interactive boundaries. Browser-visible environment variables contain public configuration only.

## Data and security principles

- Validate untrusted data at the API boundary and enforce authorization for every protected operation.
- Use DTOs instead of exposing persistence entities.
- Store relational business data in PostgreSQL and keep Redis disposable.
- Apply schema changes through forward-only Flyway migrations.
- Do not log credentials, session identifiers, personal form contents, or raw security payloads.
- Treat rate limiting, WAF, monitoring, backups, and incident response as complementary controls.

## Evolution rule

Every implementation stage updates this document when it changes a boundary or introduces a runtime dependency. Architecture claims must remain traceable to code, configuration, tests, or an explicitly marked plan.
