# Flyway migrations

Domain schema migrations begin with the database stage. Use immutable versioned files named `V<version>__<description>.sql`; never edit a migration that has been applied outside a disposable local database.

Migrations must use PostgreSQL-compatible DDL, explicit constraints and indexes, and demo seed data without personal information.
