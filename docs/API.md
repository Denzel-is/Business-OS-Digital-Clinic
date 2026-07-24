# API

The backend exposes JSON APIs under `/api/v1`. Public responses use explicit DTOs, validation failures use RFC 9457-style Problem Details, and endpoints that return user-specific calculations use `Cache-Control: no-store`.

## Public endpoints

### `GET /api/v1/system/status`

Returns the public service availability contract.

```json
{
  "service": "business-os-backend",
  "status": "available"
}
```

### `GET /api/v1/security/csrf`

Initializes and returns a CSRF token for future cookie-authenticated state-changing requests. The token value must not be logged.

### `POST /api/v1/diagnostics/evaluate`

Calculates a stateless preliminary Business Health assessment. Authentication and CSRF are not required because the endpoint creates no session and changes no server state. Rate limiting is added in the security-hardening stage.

The request contains exactly these 11 answer fields:

```json
{
  "businessType": "SERVICES",
  "teamSize": "ELEVEN_TO_FIFTY",
  "primaryProblem": "LOST_LEADS",
  "manualOperations": "REGULAR",
  "existingSystems": "FRAGMENTED",
  "digitalProduct": "OUTDATED",
  "leadHandling": "MANUAL",
  "analytics": "MANUAL",
  "aiUsage": "EXPERIMENTING",
  "personalData": "REGULAR",
  "expectedResult": "GROW_REVENUE"
}
```

The response contains:

- a deterministic score from 20 to 100 and a status label;
- findings with `HIGH`, `MEDIUM`, or `LOW` preliminary priority;
- the first priorities and recommendations;
- relevant service and demo-case titles;
- an implementation sequence;
- a disclaimer that the result does not replace a complete audit.

Contact name, email, consent, raw personal data, free text, and client identifiers are not accepted by this endpoint. The current frontend keeps optional contact fields only in browser memory and excludes them from the request through an explicit allowlist.

### `POST /api/v1/security/input-validation-demo`

Runs a stateless educational field-validation simulation. The request contains only a context (`DISPLAY_NAME`, `SEARCH_QUERY`, or `SUPPORT_MESSAGE`) and a non-blank value of at most 240 characters. The service returns `ACCEPTED`, `REVIEW_REQUIRED`, or `REJECTED`, an escaped-display preview, and individual rule results.

The endpoint rejects unknown JSON fields. It never executes the value, builds a database query, scans a URL, tests an external target, or persists the request. Its result demonstrates selected input rules and does not prove that an application is secure.

### `POST /api/v1/contact-requests`

Accepts a bounded name, email, message, explicit consent flag, empty honeypot field, and optional
Turnstile token. When Turnstile is enabled, server-side Siteverify approval is mandatory. A
populated honeypot returns the same accepted shape without saving personal fields. A valid request
creates one contact request and a lead with a fixed non-personal summary.

## Authentication endpoints

### `POST /api/v1/auth/login`

Requires a CSRF token and accepts only `email` and `password`. A successful response returns the
display name, roles, and MFA-readiness flags and creates an `HttpOnly` session cookie. Unknown
accounts, disabled accounts, and incorrect passwords all return the same generic `401` response.

### `GET /api/v1/auth/session`

Returns either an anonymous session contract or the current authenticated administrator contract.
The response is always `no-store`.

### `POST /api/v1/auth/logout`

Requires authentication and CSRF, invalidates the server session, and clears the CSRF token.

## Protected administration endpoints

- `GET /api/v1/admin/overview` — `ADMIN` or `EDITOR`;
- `GET /api/v1/admin/content/{resource}` — `ADMIN` or `EDITOR`, where resource is `projects`,
  `categories`, `media`, `services`, `leads`, `diagnostics`, or `seo`;
- `GET /api/v1/admin/system/{resource}` — `ADMIN` only, where resource is `users`, `audit-logs`,
  or `settings`.
- `POST /api/v1/admin/content/media` — `ADMIN` or `EDITOR`, CSRF-protected multipart upload with
  signature allowlisting and draft-only storage.

List endpoints accept zero-based `page` and a `size` from 1 to 50. Responses expose minimal summary
DTOs and do not expose password hashes, setting values, audit details, or JPA entities.

## Frontend proxy

The browser posts evaluation answers to the same-origin Next.js route `POST /api/diagnostic/evaluate`. The route:

1. rejects declared bodies above 16 KiB;
2. parses strict Zod contracts;
3. forwards only validated evaluation fields to the backend;
4. validates the backend response;
5. returns a generic `502` Problem Details response without internal errors when the backend is unavailable.

The browser uses `POST /api/security/input-validation` for the Security Center lab. That proxy limits the actual UTF-8 body to 4 KiB, rejects unknown fields through a strict Zod allowlist, validates the backend response, disables caching, and returns generic errors.

Authentication uses the same-origin routes `/api/auth/login`, `/api/auth/session`, and
`/api/auth/logout`. They forward only `BUSINESS_OS_SESSION` and `XSRF-TOKEN`, keep backend
coordinates server-only, and never expose the session cookie to client JavaScript.

The browser submits contact data through `POST /api/contact`. The BFF applies a strict Zod contract,
enforces a 12 KiB body limit, forwards only allowlisted fields, and maps backend failures to generic
user-facing responses.

## Rate-limit responses

Sensitive public POST routes use Redis-backed fixed-window counters. A denied request returns
`429`, `application/problem+json`, `Cache-Control: no-store`, and `Retry-After`. When Redis cannot
make an atomic decision, the protected operation fails closed with a generic `503`.

## Error format

Validation errors use `application/problem+json`:

```json
{
  "type": "urn:business-os:problem:validation-error",
  "title": "Validation failed",
  "status": 400,
  "detail": "One or more request fields are invalid.",
  "errors": [
    {
      "field": "expectedResult",
      "message": "must not be null"
    }
  ]
}
```

Malformed enum values return a generic malformed-input problem and never expose a stack trace or deserialization internals.
