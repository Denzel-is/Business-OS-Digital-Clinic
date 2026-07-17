# GitHub Actions

Workflow definitions are intentionally deferred until their build targets exist. The CI/CD stage will add:

- `backend-ci.yml` — Temurin Java 21, Maven cache, `clean verify`, and test reports.
- `frontend-ci.yml` — Node LTS, `npm ci`, lint, typecheck, tests, and production build.
- `security.yml` — dependency, secret, and container scanning without exposing sensitive output.
- `docker-build.yml` — reproducible backend and frontend image builds.

Workflows must use least-privilege `permissions`, pin third-party actions to reviewed versions, avoid untrusted code with privileged secrets, and fail visibly when a required check fails.
