# Security hardening

## Implemented in stage 13

- Atomic fixed-window Redis counters for login, diagnostic, validation-lab, and contact routes.
- Per-account failed-login throttling with the same behavior for known and unknown email values.
- Generic `429` and `503` Problem Details responses with no internal Redis details.
- Minimal audit records for successful login/logout and security events for failed login,
  honeypot activation, and the first rate-limit denial in a window.
- Micrometer counters and administrator-protected Actuator metrics.
- Consent-required contact persistence, a non-disclosing honeypot, and optional mandatory
  server-side Cloudflare Turnstile validation.
- Signature-based admin media upload into a non-public UUID-keyed storage root.
- Bounded JSON, multipart, header, pagination, and public-computation requests.
- `robots.txt` exclusions for admin and API routes.
- CSP, HSTS in production, COOP, CORP, frame denial, MIME sniffing protection, referrer policy,
  permissions policy, and DNS-prefetch disabling.

## Fail behavior

When hardening is enabled and Redis cannot make an atomic decision, protected rate-limited
operations fail closed with `503`. Public read-only pages remain available because they do not use
the mutation filter.

Turnstile fails closed when enabled: an absent, expired, duplicate, invalid, or unverifiable token
does not persist a contact. Local development keeps Turnstile explicitly disabled until test or
production keys are configured.

## Data minimization

Redis keys contain a salted SHA-256 fingerprint, not a raw IP or email. Security events do not
store passwords, submitted form text, tokens, session identifiers, or raw network addresses.
Leads derived from contact requests use a fixed summary rather than copying the personal message.

## Not implemented yet

MFA challenge delivery, recovery, administrative session revocation, external SIEM/alerting,
malware scanning, encrypted backups, WAF deployment, and origin firewalling remain separate
operational work. No control is described as absolute protection.
