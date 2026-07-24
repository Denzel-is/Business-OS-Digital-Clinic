# Flyway migrations

Flyway owns the PostgreSQL schema. Hibernate runs with `ddl-auto=validate` and must never create or
silently update production tables.

Current migrations:

- `V1__create_core_schema.sql` creates the 14 domain tables, relation tables, foreign keys, unique
  constraints, checks, and query indexes.
- `V2__seed_demo_catalog.sql` inserts only public demo catalog data: roles, categories,
  technologies, services, six honestly labeled projects, relation rows, and public site settings.

The seed intentionally creates no users, credentials, contact requests, leads, diagnostic sessions,
audit records, security events, or other personal data.

Applied migrations are immutable. Add a new forward-only migration for every schema change; do not
edit a migration that has already reached a shared environment.
