# Documentation map

Documentation is versioned with the behavior and operational contract it describes.

## System and application

- [Architecture](ARCHITECTURE.md) — modules, dependency direction, trust and runtime topology.
- [API](API.md) — public/authenticated endpoints, validation, proxy boundary, and errors.
- [Database](DATABASE.md) — entities, constraints, migrations, demo seed, and verification.
- [Authentication](AUTHENTICATION.md) — login, CSRF/session policy, RBAC, and bootstrap boundary.
- [Design system](DESIGN_SYSTEM.md) — tokens, typography, components, states, and accessibility.
- [Motion guide](MOTION_GUIDE.md) — animation ownership, reduced motion, and performance.

## Content and media

- [Content guide](CONTENT_GUIDE.md) — editorial voice, evidence, demo labels, and Russian copy.
- [Media guide](MEDIA_GUIDE.md) — licensing, real-video requirements, optimization, and fallbacks.

## Security and operations

- [Security hardening](SECURITY_HARDENING.md) — Redis limits, login defense, contact, and uploads.
- [Threat model](THREAT_MODEL.md) — assets, boundaries, threats, controls, and residual risk.
- [Deployment security](DEPLOYMENT_SECURITY.md) — edge, origin, caching, secret, and route policy.
- [Deployment and recovery](DEPLOYMENT.md) — images, rollout, backups, restore, and rollback.
- [Incident response](INCIDENT_RESPONSE.md) — severity, containment, recovery, and learning.
- [Testing](TESTING.md) — test layers, commands, fixtures, CI evidence, and release gate.
- [Security policy](../SECURITY.md) — responsible vulnerability reporting and research boundaries.

## Repository guidance

- [Root README](../README.md) — Windows install, local/Docker startup, testing, and production entry.
- [AGENTS.md](../AGENTS.md) — implementation, security, Git, and definition-of-done rules.
- [Infrastructure README](../infrastructure/README.md) — local and production Compose boundaries.
- [Workflow README](../.github/workflows/README.md) — GitHub Actions ownership and permissions.
