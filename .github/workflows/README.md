# GitHub Actions

The stage 15 workflows are intentionally separated by concern:

- `backend-ci.yml` verifies Java 21, tests, migrations, formatting, and the executable jar.
- `frontend-ci.yml` verifies formatting, lint, strict types, unit tests, the production build, and
  Playwright.
- `security.yml` scans committed history for secrets, backend/frontend dependencies for
  high/critical findings, and OS packages in both locally built images.
- `docker-build.yml` proves that the backend and frontend Dockerfiles build with BuildKit.

Every workflow uses read-only repository permissions, bounded timeouts, concurrency cancellation,
and pinned action SHAs. Scanner container images are pinned by digest and redact detected secret
values. CI builds images but does not publish or deploy them; a deployment environment and explicit
release approval must be added before registry credentials are introduced.
