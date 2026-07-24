# Authentication and protected administration

## Implemented boundary

Stage 12 adds administrator authentication and a protected, read-only administration foundation.
The backend remains the authority for every permission decision. Hiding a link or redirecting in
Next.js is only a user-experience aid and is never treated as authorization.

## Authentication

- Passwords are encoded with BCrypt cost 12 and are never returned by an API.
- Login accepts a normalized email and password, but every credential failure returns the same
  generic `401` response.
- Successful login stores the Spring Security context in an HTTP session and changes an existing
  session identifier.
- The session cookie is `HttpOnly`, has environment-controlled `Secure` and `SameSite` attributes,
  and expires after 30 minutes by default.
- Login and logout require a valid CSRF token. The Next.js same-origin BFF performs the CSRF
  handshake and forwards only the allowlisted session and CSRF cookies.
- Logout invalidates the server session and clears the CSRF cookie.

`mfaRequired` and `mfaReady` are present in the session contract so an MFA challenge can be added
without changing the role model. MFA is not active yet and must not be represented as active.

## Roles

| Role | Access |
| --- | --- |
| `EDITOR` | Overview and content resources: projects, categories, media, services, leads, diagnostic results, and SEO |
| `ADMIN` | All editor resources plus users, audit log, and settings |

Spring Security route matchers and method-level `@PreAuthorize` checks enforce both layers. Admin
queries use fixed, enumerated SQL statements and bounded pagination; a request value is never
concatenated into SQL.

## One-time local administrator

No credential or user is included in Flyway seed data. To create the first local administrator,
set these values in the ignored root `.env` file:

```properties
BOOTSTRAP_ADMIN_ENABLED=true
BOOTSTRAP_ADMIN_EMAIL=your-local-admin@example.test
BOOTSTRAP_ADMIN_PASSWORD=use-at-least-16-characters
BOOTSTRAP_ADMIN_DISPLAY_NAME=Local administrator
```

Start the backend once. After the log reports that the administrator was created, set
`BOOTSTRAP_ADMIN_ENABLED=false` and remove `BOOTSTRAP_ADMIN_PASSWORD` from `.env`. A later startup
never replaces the password of an existing account.

Deployed environments must inject the initial secret through their secret manager and remove it
after provisioning. Never put a real password in source control, Compose definitions, command
history, logs, screenshots, or browser-visible variables.

## Current limitations

The administration UI intentionally exposes verified list and overview operations only. Security
event/audit signals and login rate limiting are implemented, but CRUD mutations, MFA challenge
delivery, account recovery, and operator-facing session administration are not. `mfaReady` is a
contract placeholder and must not be presented as active MFA.
