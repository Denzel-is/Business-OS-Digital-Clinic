# Threat model

## Scope and assumptions

This model covers the public Next.js application, the Spring Boot API, administrator sessions,
PostgreSQL, Redis, draft media storage, the container boundary, and the intended reverse-proxy or
Cloudflare edge. It describes risk reduction for the current codebase; it is not a claim of
absolute security or a substitute for a deployment-specific review.

The production operator is assumed to protect the host, registry, DNS, CI settings, secret files,
backups, and Cloudflare account. Direct access to the origin and data services must be closed.

## Assets

- administrator credentials, sessions, CSRF tokens, and role assignments;
- contact requests and other personal data;
- project, service, diagnostic, lead, audit, and security-event records;
- database, Redis, Turnstile, and rate-limit secrets;
- draft uploads and future published media;
- application integrity, availability, logs, images, backups, and deployment configuration.

## Trust boundaries

1. An untrusted browser crosses the edge into the Next.js public service.
2. Next.js forwards only explicit application requests and allowlisted cookies to Spring Boot.
3. Spring Boot is the authorization and validation authority before PostgreSQL, Redis, or uploads.
4. PostgreSQL and Redis are reachable only on the internal data network.
5. CI reads untrusted pull-request content but has read-only repository permissions and no
   deployment credentials.
6. Operators cross a privileged boundary when handling secrets, backups, images, or the host.

## Threats and controls

| Threat | Relevant controls | Residual risk and required operations |
| --- | --- | --- |
| Credential stuffing and account discovery | Generic login failures, BCrypt cost 12, Redis-backed client/account limits, secure session rotation | Distributed attacks still require edge limits, monitoring, MFA, and incident response |
| Session theft or CSRF | `HttpOnly`/`Secure`/`SameSite` cookies, CSRF tokens, no-store responses, strict CORS allowlist | A compromised browser or administrator device remains dangerous |
| Broken access control | Backend route and method authorization, fixed roles, protected admin API | Every future mutation needs a focused authorization test |
| Injection and unsafe rendering | Bean Validation, strict DTOs, parameterized persistence, unknown-field rejection, React text rendering | New interpreters, templates, queries, and file processors require review |
| Personal-data leakage | Minimal contact contract, explicit consent, no sensitive audit payloads, protected admin reads | Operators must set retention, access, export, and deletion procedures |
| Malicious upload | Size/signature allowlists, generated storage keys, normalized path, draft-only private storage | Malware scanning, object quarantine, and a separate delivery origin are still required |
| Automated form abuse | Honeypot, Turnstile server verification, Redis and edge rate limits | Turnstile raises cost but does not prove benign intent |
| Cache or proxy disclosure | No-store for user-specific data, route-specific cache policy, protected origin | Reverse-proxy rules must be tested after every routing change |
| Secret exposure | Ignored local files, production file secrets, Git-history scanning, redacted logs | Host access, screenshots, shell history, and misconfigured CI can still leak values |
| Dependency or image compromise | Lockfiles, Maven wrapper, pinned actions/scanner images, Dependabot, dependency and image scans | Pin production images by digest and review updates; scanners cannot prove absence of compromise |
| Database or media loss | Named volumes and documented backups/restore drills | Backups must be encrypted, off-host, monitored, and actually restored in exercises |
| Service exhaustion or DDoS | Request/body limits, Redis counters, edge/WAF contract, health checks | Volumetric attacks must be handled upstream; Java cannot protect a saturated network |
| Forged client address | Application does not trust arbitrary forwarding headers | Only enable forwarded-header trust after origin closure and proxy-range validation |
| Compromised CI pull request | Read-only token permissions, no publish/deploy step, secret-free PR jobs | Future release jobs need protected environments, approvals, and isolated credentials |

## Abuse cases to test

- anonymous and `EDITOR` requests cannot reach `ADMIN` resources;
- unknown and known accounts produce indistinguishable credential failures;
- state-changing requests without a valid CSRF token fail;
- rate-limit storage failure denies protected operations without exposing internals;
- contact honeypot data is not persisted;
- oversized, mismatched, executable, SVG, archive, and traversal-style uploads fail;
- forwarded headers cannot select another rate-limit identity by default;
- authentication, contact, CSRF, and admin responses are never cached publicly.

Tests must use owned, isolated systems and synthetic data. This model does not authorize scanning,
load testing, denial-of-service, or testing third-party infrastructure.

## Review triggers

Review this model before enabling production, adding an admin mutation, MFA, account recovery,
public media delivery, a new external integration, new personal-data fields, trusted proxy
headers, registry publishing, automated deployment, or a new data store. Review it after every
security incident and at least annually for a supported release.
