# Incident response

## Purpose

Use this playbook for suspected compromise, data exposure, credential leakage, malicious uploads,
availability incidents, or a vulnerable production dependency. Preserve evidence and minimize
harm; do not improvise destructive actions on the affected host.

## Severity

| Severity | Example | Initial response target |
| --- | --- | --- |
| SEV-1 | active compromise, confirmed sensitive-data disclosure, complete production outage | immediately |
| SEV-2 | exploitable protected-route flaw, partial outage, credible secret exposure | within one hour |
| SEV-3 | contained abuse, degraded non-critical function, vulnerable dependency without known exploitation | same business day |
| SEV-4 | low-impact defect or hardening observation | normal backlog |

Targets are operational goals, not contractual service-level guarantees.

## Roles

- Incident lead: owns severity, decisions, timeline, and handoffs.
- Technical lead: investigates, contains, repairs, and validates recovery.
- Communications/privacy lead: coordinates affected parties, hosting providers, legal advice, and
  any notification duties.
- Scribe: records UTC timestamps, evidence locations, decisions, and deployed artifact digests.

One person may hold several roles in a small team, but the decision log must remain explicit.

## Response sequence

1. **Receive and verify.** Record the reporter, time, affected environment, symptoms, current image
   digests, and a safe reproduction. Move sensitive discussion to a private channel.
2. **Triage.** Assign severity, identify exposed assets and users, determine whether exploitation is
   ongoing, and declare the incident lead.
3. **Preserve evidence.** Export relevant platform, edge, authentication, audit, container, and
   database logs to access-controlled storage. Record hashes and UTC times. Do not place secrets,
   raw passwords, session tokens, or unnecessary personal data in tickets.
4. **Contain.** Prefer reversible controls: disable the affected route or account, revoke sessions,
   narrow edge access, block confirmed indicators, quarantine uploads, or roll back to a known
   image. Do not erase containers, logs, or database state before evidence is preserved.
5. **Eradicate.** Patch the root cause, rotate exposed credentials, rebuild images from a trusted
   commit, review persistence mechanisms and role changes, and scan the exact replacement artifact.
6. **Recover.** Restore clean data if needed, apply migrations, start internal services first,
   verify health and authorization, then restore public traffic gradually while monitoring.
7. **Communicate.** Give factual updates with known impact, uncertainty, mitigations, and next
   update time. Coordinate legal and privacy notification requirements for the affected
   jurisdictions; this document is not legal advice.
8. **Learn.** Within five business days, write a blameless post-incident review with timeline, root
   cause, control gaps, recovery evidence, assigned actions, owners, and due dates.

## Credential and session response

- Database or Redis secret: restrict origin access, rotate the value, update the protected secret
  file, restart dependent services, and review data access during the exposure window.
- Administrator password: disable the account, invalidate all relevant sessions, rotate the
  password through an approved mechanism, and review role/audit changes.
- Turnstile secret: rotate it in Cloudflare and the deployment secret, then validate contact flow.
- CI or registry token: revoke first, inspect workflow and package activity, replace with a
  least-privilege credential, and rebuild from a trusted commit.
- Rate-limit salt: rotate only with awareness that existing fingerprint counters become obsolete.

Never paste replacement values into Git, an issue, chat, screenshots, command-line arguments, or
the incident report.

## Recovery checks

- deployed image digests match the approved release;
- all Compose services are healthy and only the frontend is published;
- public pages and `/actuator/health` pass from the intended monitoring path;
- anonymous, `EDITOR`, and `ADMIN` authorization checks behave correctly;
- login, CSRF, contact, Turnstile, rate limiting, and upload rejection are verified;
- database row counts and migration history are consistent;
- monitoring shows no recurrence before the incident is closed.

## Evidence and retention

Store evidence encrypted with access logging and an incident-specific retention decision. Collect
only what is necessary. If law enforcement, insurance, contractual, or regulatory duties may
apply, obtain qualified advice before altering evidence or contacting affected people.
