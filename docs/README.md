# Documentation map

Documentation is versioned with the behavior it describes. Files marked as planned are created only when their subject has an implementation or a concrete operational contract to document.

## Available

- [Architecture](ARCHITECTURE.md) — module boundaries, dependency direction, and staged runtime topology.
- [API](API.md) — implemented public endpoints, diagnostic contracts, proxy boundary, and errors.
- [Database](DATABASE.md) — implemented entities, constraints, migrations, demo seed, and verification.
- [Authentication](AUTHENTICATION.md) — BCrypt login, CSRF/session policy, RBAC, bootstrap, and admin boundary.
- [Security hardening](SECURITY_HARDENING.md) — Redis limits, login defense, audit signals, contact and upload boundaries.
- [Deployment security](DEPLOYMENT_SECURITY.md) — Cloudflare, origin, caching, secrets, and residual-risk contract.
- [Testing](TESTING.md) — test layers, commands, fixtures, security coverage, browser checks, and release gate.
- [Content guide](CONTENT_GUIDE.md) — editorial voice, evidence rules, demo labels, and Russian copy guidance.
- [Design system](DESIGN_SYSTEM.md) — implemented tokens, typography, components, states, and accessibility rules.
- [Media guide](MEDIA_GUIDE.md) — licensing, real-video requirements, optimization, fallbacks, and reduced motion.
- [Motion guide](MOTION_GUIDE.md) — animation ownership, dynamic runtimes, reduced motion, and performance rules.
- [Security policy](../SECURITY.md) — responsible vulnerability reporting and the current support status.

## Planned

- `THREAT_MODEL.md` — assets, trust boundaries, threats, mitigations, and residual risk.
- `INCIDENT_RESPONSE.md` — triage, containment, recovery, notification, and learning.
- `DEPLOYMENT.md` — environments, build artifacts, rollout, rollback, and recovery.
