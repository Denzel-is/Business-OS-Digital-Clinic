# Infrastructure module

This module owns deployment and platform configuration. It currently records boundaries only; runnable Compose and production container definitions are scheduled for the infrastructure stage after both applications exist.

## Planned scope

- Local PostgreSQL and Redis dependencies with health checks.
- Separate production images for backend and frontend.
- Non-secret environment contracts and runtime configuration.
- Cloudflare-ready DNS, CDN, WAF, bot protection, caching, and origin protection guidance.
- Health checks, backup and restore procedures, observability, rollback, and incident operations.

## Security boundary

- No production secret belongs in this directory or in an image layer.
- Edge controls complement application controls; they do not replace authorization or validation.
- DDoS resilience requires provider-level mitigation and protected origins, not Java code alone.
- Production configuration will use immutable images and least-privilege runtime identities.
