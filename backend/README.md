# Backend module

The backend module will contain the Java 21 and Spring Boot API. Application code is intentionally deferred to stage 3; this file defines the boundary before implementation begins.

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

## Planned commands

These commands become available when the Maven Wrapper and Spring Boot foundation are added in stage 3:

```powershell
.\mvnw.cmd spring-boot:run
.\mvnw.cmd clean verify
.\mvnw.cmd spotless:check
```
