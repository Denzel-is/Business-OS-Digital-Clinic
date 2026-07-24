# Infrastructure module

Stage 15 provides two Compose contracts and separate production images for the Spring Boot API and
Next.js frontend.

## Local stack

From the repository root:

```powershell
Copy-Item .env.example .env
docker compose config
docker compose up -d --build
docker compose ps
```

The default stack exposes the frontend on `3000`, backend on `8080`, PostgreSQL on `5432`, and Redis
on `6379`, all bound to `127.0.0.1`. PostgreSQL and Redis use public development-only credentials
from `.env.example`; do not reuse them outside local development.

Stop the stack without deleting named volumes:

```powershell
docker compose down
```

Deleting volumes is a separate destructive operation and is never part of a normal restart.

## Production boundary

`docker-compose.prod.yml`:

- accepts immutable frontend/backend image references;
- publishes only the frontend, bound to `127.0.0.1` by default;
- keeps backend, PostgreSQL, and Redis on internal networks;
- reads database, Redis, rate-limit, and Turnstile secrets from mounted files;
- runs application containers as non-root with all Linux capabilities dropped;
- makes application root filesystems read-only;
- uses health-gated dependencies and graceful stop periods;
- persists database, Redis, and quarantined draft-upload data in separate volumes.

The host reverse proxy or Cloudflare Tunnel connects to the frontend port. Do not expose the data
network or Actuator directly to the Internet.

Production startup, backup, rollback, and secret-file preparation are documented in
`../docs/DEPLOYMENT.md`. Edge controls are documented in `../docs/DEPLOYMENT_SECURITY.md`.

## CI/CD boundary

GitHub Actions verify both applications, build both images, run browser tests, validate Compose,
scan dependencies, scan Git history for secrets, and scan OS packages in locally built container
images. Workflows do not contain registry or deployment credentials and do not deploy
automatically.

Publishing images or deploying requires a separate protected GitHub Environment, immutable image
digests, explicit approval, and platform-specific credentials.
