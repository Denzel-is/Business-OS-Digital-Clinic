# Architecture

## Status

This document records the monorepo contract plus the backend, frontend, design-system, homepage,
motion, Business Diagnostic, static project-case, Security Center, and PostgreSQL persistence
foundation completed through stage 13. Runtime details are promoted from planned to implemented
only after their stage passes verification.

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

The homepage is composed from server-rendered sections in `frontend/src/components/home` and immutable editorial data in `frontend/src/content/home.ts`. It does not fetch domain data; client motion progressively enhances the same static content. Demonstration states and project teasers are visibly labeled, while interactive scoring and production hero video remain separate feature concerns.

Motion is isolated in client boundaries under `frontend/src/components/motion`. Framer Motion handles lightweight editorial movement. GSAP and ScrollTrigger are imported only inside Business Vitals after reduced-motion checks. React Three Fiber and Three.js are imported only for the Security Pulse defense-layer model and are skipped for reduced motion, narrow viewports, or unavailable WebGL. Static server-rendered content remains the source of meaning in every mode.

Business Diagnostic is a vertical stateless slice. The React Hook Form wizard owns step navigation and ephemeral contact inputs. A strict frontend allowlist sends only 11 process answers through a same-origin Next.js route. The route validates with Zod and calls the Java API. `diagnostic.application` owns scoring and recommendation rules; `diagnostic.domain` owns answer and assessment models; `diagnostic.api` owns validated DTO mapping. No answer or contact persistence exists before the database and explicit-consent stages.

Project cases are immutable editorial records in `frontend/src/content/projects.ts` until persistence is introduced. `/projects` applies client-side category filtering to the complete static set, while `/projects/[slug]` uses `generateStaticParams` for six detail pages. Project labels, constraints, and verification signals remain part of each record so list and detail views cannot silently drop the honesty boundary.

Security Center is an evidence map rather than a protection claim. Immutable content lists all 16 required controls as implemented, foundational, or planned. Its client lab sends only a context enum and a text value through a strict, size-bounded same-origin route. The Java `security.application` service normalizes and evaluates the value without executing it, scanning another system, or persisting it; React renders the preview as escaped text. Authentication, server-side RBAC, CSRF-protected sessions, and the database foundation now point to verified evidence; rate limiting, WAF, backups, and incident response remain planned.

The persistence foundation contains 14 internal JPA entities organized by feature. A shared mapped
superclass owns UUID identifiers, audit timestamps, and optimistic-lock versions. Flyway V1 owns
tables, relation tables, checks, indexes, unique constraints, and foreign keys; Hibernate only
validates this schema. Flyway V2 seeds the public demo catalog without users or personal records.
Testcontainers proves the complete migration path from a new PostgreSQL 17 database. Public project
pages and Business Diagnostic remain stateless until repositories and consent-aware application
use cases are introduced; the presence of a table does not authorize collection.

Authentication is a vertical session-backed slice. Spring Security authenticates normalized
accounts through a repository-backed `UserDetailsService`, BCrypt cost 12, and an explicitly saved
HTTP-session security context. CSRF protects login, logout, and future state changes. Next.js acts
as a same-origin BFF and forwards only allowlisted backend cookies. `ADMIN` and `EDITOR` permissions
are enforced by both URL rules and method checks. The protected admin routes render database-backed
overview and list DTOs; frontend redirects and hidden navigation are convenience only.

Security hardening adds an inner abuse-control boundary backed by atomic Redis counters. A filter
limits expensive public POST routes by a salted client fingerprint; authentication also tracks a
salted normalized-account fingerprint. Audit and security records deliberately contain event
metadata rather than credentials, tokens, form bodies, session ids, or raw IP addresses.

The contact slice is consent-aware and transactional: a valid request creates a contact and a
minimal lead, while the honeypot path stores no submitted personal fields. Turnstile verification
is a replaceable server-side port and fails closed when enabled. Admin media upload detects file
signatures, generates storage keys, writes outside public static roots, and registers rollback
cleanup. Publication and media delivery remain separate workflows.

## Data and security principles

- Validate untrusted data at the API boundary and enforce authorization for every protected operation.
- Use DTOs instead of exposing persistence entities.
- Store relational business data in PostgreSQL and keep Redis disposable.
- Apply schema changes through forward-only Flyway migrations.
- Do not log credentials, session identifiers, personal form contents, or raw security payloads.
- Treat rate limiting, WAF, monitoring, backups, and incident response as complementary controls.

## Evolution rule

Every implementation stage updates this document when it changes a boundary or introduces a runtime dependency. Architecture claims must remain traceable to code, configuration, tests, or an explicitly marked plan.
