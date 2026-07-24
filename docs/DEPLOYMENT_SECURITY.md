# Deployment security and Cloudflare boundary

## Status

The application, production Compose, and CI controls described here are implemented through stage
16. This remains a Cloudflare-ready operational contract: it does not claim that Cloudflare, a
WAF, backups, monitoring, or production infrastructure are already deployed.

## Required production edge

1. Proxy public DNS records through Cloudflare and use `Full (strict)` TLS to the origin.
2. Use an origin certificate and close direct public access with a firewall allowlist, Cloudflare
   Tunnel, or an equivalently authenticated private path.
3. Enable managed WAF rules and tune them against observed false positives.
4. Apply edge rate limits to login, contact, diagnostic, and expensive API routes. Keep the
   application Redis limits as an independent inner layer.
5. Enable bot controls and configure a production Turnstile widget for `/contact`.
6. Cache immutable assets and public HTML deliberately. Never cache authentication, admin,
   contact, CSRF, or user-specific responses.
7. Monitor edge denials, origin 429/5xx responses, authentication failures, and latency together.

Turnstile is complete only when the backend validates every token through Cloudflare Siteverify.
Tokens are short-lived and single-use; the secret stays server-side. See the official
[Cloudflare server-side validation guide](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## Origin and client address

The application hashes `request.getRemoteAddr()` with a deployment-specific salt and never stores
the raw address in its security-event table. It intentionally does not trust arbitrary
`X-Forwarded-For` or `CF-Connecting-IP` headers.

Behind Cloudflare, configure trusted forwarded-header processing only after direct origin access is
closed and only for the current Cloudflare proxy ranges. Otherwise an attacker can forge the
client address. Edge rate limiting remains the first layer; Redis counters are the origin layer.

## Secrets

Production must supply unique values through the platform secret manager:

- database and Redis credentials;
- `RATE_LIMIT_KEY_SALT`;
- `TURNSTILE_SECRET_KEY`;
- initial administrator bootstrap secret, removed after provisioning.

The public Turnstile site key may be exposed to the browser. The secret key may not.

## Route policy

| Route group | Edge policy | Cache |
| --- | --- | --- |
| Static assets | CDN, integrity and content-type checks | Long immutable cache |
| Public pages and project cases | Bot monitoring and bounded request rate | Short or revalidated |
| Diagnostic and validation lab | Per-client rate limit, body-size limit | Never |
| Contact | Strict rate limit, Turnstile, honeypot | Never |
| Login and admin | Strict rate limit, access monitoring, optional Zero Trust | Never |
| Actuator | Not public; origin or administrative access only | Never |

## File storage

Uploaded admin media is written outside the frontend and Java static-resource trees. The server:

- ignores the original filename;
- detects an allowlisted signature for JPEG, PNG, WebP, MP4, or PDF;
- creates a UUID storage key under a normalized storage root;
- rejects SVG, HTML, scripts, archives, and unknown signatures;
- stores new media as `DRAFT`;
- does not expose an execution or public-serving route.

Production should add malware scanning, object-storage quarantine, retention rules, and a separate
media delivery domain before uploads are published.

## Residual limits

Rate limiting reduces abuse; it does not stop a volumetric DDoS that saturates the network before
the request reaches Java. Turnstile increases automation cost; it does not prove a visitor is
benign. Public content can still be copied. WAF, bot controls, monitoring, capacity planning, and
origin protection are independent required layers.
