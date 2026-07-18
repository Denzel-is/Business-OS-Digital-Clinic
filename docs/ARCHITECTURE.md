# Architecture

## Status

This document records the monorepo contract plus the backend, frontend, design-system, and accessible homepage foundations completed through stage 6. Runtime details are promoted from planned to implemented only after their stage passes verification.

## System context

Business OS: Digital Clinic now contains a Next.js web application foundation and a Spring Boot API foundation. The API owns business rules and persistence. PostgreSQL is the system of record; Redis is limited to ephemeral concerns such as rate-limit counters and bounded caches. Cloudflare is an optional edge layer for CDN, WAF, bot controls, and origin protection.

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

The frontend currently targets Node.js 24 LTS, Next.js App Router, and React 19. Its server-only API boundary validates backend payloads with Zod. GSAP, Framer Motion, and React Three Fiber are available but must stay outside initial bundles until a feature explicitly and dynamically loads them.

Semantic visual tokens live in the global Tailwind theme and reusable accessible primitives live in `frontend/src/components/ui`. Routes and features compose these primitives; they must not fork colors, focus behavior, or form-state semantics without updating the documented design-system contract. Manrope and IBM Plex Mono are packaged locally so rendering does not depend on a runtime font CDN.

The homepage is composed from server-rendered sections in `frontend/src/components/home` and immutable editorial data in `frontend/src/content/home.ts`. It does not fetch domain data or run client-side motion. Demonstration states and project teasers are visibly labeled; interactive scoring, scroll-driven transitions, and production hero video remain separate feature concerns.

## Data and security principles

- Validate untrusted data at the API boundary and enforce authorization for every protected operation.
- Use DTOs instead of exposing persistence entities.
- Store relational business data in PostgreSQL and keep Redis disposable.
- Apply schema changes through forward-only Flyway migrations.
- Do not log credentials, session identifiers, personal form contents, or raw security payloads.
- Treat rate limiting, WAF, monitoring, backups, and incident response as complementary controls.

## Evolution rule

Every implementation stage updates this document when it changes a boundary or introduces a runtime dependency. Architecture claims must remain traceable to code, configuration, tests, or an explicitly marked plan.
