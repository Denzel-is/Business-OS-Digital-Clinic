# Backend module

The backend foundation is a Java 21 and Spring Boot 4.1 API with a Maven Wrapper, PostgreSQL, Redis, Flyway, Actuator, validation, and a deny-by-default Spring Security baseline.

Stage 8 adds the stateless `diagnostic` feature. Its public evaluation endpoint validates enumerated answers, runs deterministic application-layer scoring, and returns a preliminary assessment without accepting or persisting contacts. Stage 10 adds a bounded, stateless `security` input-validation demonstration that applies field rules without executing or persisting submitted text.

## Responsibilities

- Business rules and server-side validation.
- Authentication, authorization, secure session handling, and audit events.
- PostgreSQL persistence through JPA and versioned Flyway migrations.
- Redis-backed rate limiting and bounded caching.
- Public and administrative APIs expressed through DTOs and Problem Details.
- Health, readiness, metrics, and operational diagnostics with protected access.

## Package contract

The root package will be `com.denzelis.businessos`. Code will be organized by feature, with only the layers that each feature needs:

```text
com.denzelis.businessos
├── auth/
├── project/
├── diagnostic/
├── lead/
├── contact/
├── security/
├── audit/
├── user/
├── media/
├── settings/
├── shared/
└── configuration/
```

Within a feature, dependencies flow from `api` to `application` and `domain`; infrastructure implements ports owned by the feature. JPA entities never become public API contracts.

## Local configuration

Copy the root `.env.example` to `.env` before starting the backend. Spring imports that file when
the application is started from this directory and intentionally refuses to start without
`DATABASE_PASSWORD`. The documented PostgreSQL container uses the public local-only value from the
example; every shared or deployed environment must supply a different secret. PostgreSQL and Redis
must be available before starting the application; Compose services are added in a later
infrastructure stage.

## Commands

```powershell
.\mvnw.cmd spring-boot:run
.\mvnw.cmd clean verify
.\mvnw.cmd spotless:check
```

The test profile uses an in-memory database only for context and HTTP security tests. PostgreSQL Testcontainers remain the required path for persistence integration tests once domain migrations exist.
