# Database

## Current boundary

Stage 11 establishes the PostgreSQL schema and JPA mappings. It does not yet expose persistence
endpoints or save Business Diagnostic contacts. Authentication, repositories, transactional use
cases, admin CRUD, audit writes, backup automation, and least-privilege deployment roles remain
separate stages.

Hibernate validates the schema with `ddl-auto=validate`; Flyway is the only schema owner.

## Domain tables

| Required entity | PostgreSQL table | Important boundaries |
| --- | --- | --- |
| User | `app_user` | Normalized unique email, password hash only, enabled and MFA-ready flags |
| Role | `app_role` | Unique role code; demo seed contains `ADMIN` and `EDITOR`, but no users |
| Project | `project` | Unique slug, publication state, publication time, deterministic order |
| ProjectCategory | `project_category` | Unique slug and name |
| ProjectMedia | `project_media` | Project FK, unique position, bounded media type, traversal check |
| Technology | `technology` | Unique slug and name |
| Service | `service` | Unique slug and name |
| DiagnosticSession | `diagnostic_session` | Opaque public id, bounded score, explicit contact-consent flag |
| DiagnosticAnswer | `diagnostic_answer` | Session FK and one answer per question |
| Lead | `lead` | Optional contact request FK and explicit lifecycle state |
| ContactRequest | `contact_request` | Consent timestamp is mandatory before personal fields can exist |
| AuditLog | `audit_log` | Optional actor FK and indexed resource/action context |
| SecurityEvent | `security_event` | Severity, optional actor, hashed source signal, no raw IP requirement |
| SiteSettings | `site_settings` | Unique setting key and explicit public/private marker |

Relation tables connect users to roles and projects to categories, technologies, and services.

Every domain table uses a UUID primary key, `created_at`, `updated_at`, and an optimistic-lock
`version`. Foreign-key deletion behavior is explicit: owned rows cascade, catalog references
restrict deletion, and historical actor/contact references become `NULL`.

## Publication states

Publishable catalog entities use:

- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

A published project must have `published_at`. Draft and archived records are retained for future
admin workflows instead of being inferred from URL visibility.

## Demo seed

`V2__seed_demo_catalog.sql` contains:

- eight required project categories;
- six demo projects matching the static frontend cases;
- six services and six technologies;
- two role definitions;
- two public site settings.

It contains no user, credential, email, contact, lead, diagnostic, audit, security-event, or client
record. Demo projects remain concepts, educational projects, personal projects, or demo cases; the
database seed does not turn them into client work.

## Verification

Docker Desktop must be running. From `backend/`:

```powershell
.\mvnw.cmd clean verify
```

`DatabaseMigrationIntegrationTests` starts a new PostgreSQL 17 Testcontainer, applies every Flyway
migration from an empty database, starts the Spring context with Hibernate schema validation, checks
the seed boundary, and proves representative unique and foreign-key constraints.

For the documented local container, inspect applied versions without exposing credentials:

```powershell
docker exec business-os-postgres `
  psql -U business_os_app -d business_os `
  -c "select version, description, success from flyway_schema_history order by installed_rank;"
```
