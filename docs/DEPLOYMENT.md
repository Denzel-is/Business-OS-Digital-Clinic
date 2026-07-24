# Deployment and recovery

## Production readiness boundary

The repository provides production container definitions, but it does not provision a host,
registry, domain, Cloudflare account, monitoring service, or backup target. Complete those
environment-specific controls and run a restore exercise before claiming production readiness.

## Prerequisites

- a supported Linux Docker host with Compose v2 and restricted administrative access;
- private registry images built from a reviewed commit and referenced by immutable digest;
- TLS termination through a protected reverse proxy or Cloudflare Tunnel;
- external encrypted backup storage with retention and access logging;
- four long random secret files outside the repository;
- a production environment file outside Git with non-secret settings and secret-file paths.

The host must expose only the reverse proxy. PostgreSQL, Redis, the backend, Actuator, and Docker
must not be reachable from the public Internet.

## Build and publish artifacts

From a reviewed commit:

```powershell
docker build --pull -t registry.example/business-os-backend:VERSION .\backend
docker build --pull `
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=PUBLIC_SITE_KEY `
  -t registry.example/business-os-frontend:VERSION .\frontend
```

Scan and push through the approved registry workflow, then record the resulting
`image@sha256:...` references. The Turnstile site key is public and is embedded at frontend build
time; the Turnstile secret is never a build argument or image layer.

## Prepare configuration

Create, outside the checkout:

- `database_password`;
- `redis_password`;
- `rate_limit_key_salt`;
- `turnstile_secret`.

Each file contains only its value and must be readable only by the deployment account. Create a
production environment file such as:

```properties
BACKEND_IMAGE=registry.example/business-os-backend@sha256:REPLACE
FRONTEND_IMAGE=registry.example/business-os-frontend@sha256:REPLACE
FRONTEND_PUBLIC_URL=https://clinic.example
FRONTEND_BIND_ADDRESS=127.0.0.1
FRONTEND_PORT=3000
DATABASE_NAME=business_os
DATABASE_USER=business_os_app
DATABASE_PASSWORD_FILE=/srv/business-os/secrets/database_password
REDIS_PASSWORD_FILE=/srv/business-os/secrets/redis_password
RATE_LIMIT_KEY_SALT_FILE=/srv/business-os/secrets/rate_limit_key_salt
TURNSTILE_SECRET_KEY_FILE=/srv/business-os/secrets/turnstile_secret
TURNSTILE_ENABLED=true
TURNSTILE_EXPECTED_HOSTNAME=clinic.example
COOKIE_SAME_SITE=Lax
LOG_LEVEL=INFO
```

Do not commit this file even if it currently contains only paths. Validate that no value contains a
line break and that the environment file and secret directory are excluded from backups that are
not encrypted.

## Deploy

Run from the checked-out repository directory:

```powershell
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env config
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env pull
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env up -d
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env ps
```

On Linux, replace the example environment path with its protected absolute path. `config` must
complete before any rollout. Flyway migrations run during backend startup; always back up first
and review whether a migration is backward compatible.

Verify:

```powershell
curl.exe --fail http://127.0.0.1:3000/
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env ps
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env logs --since 10m backend frontend
```

Logs must be reviewed for errors, not copied wholesale into public tickets. Test the public TLS
origin, authorization boundaries, CSRF, login, contact/Turnstile flow, rate limits, and the absence
of direct backend/data-service exposure.

## First administrator

The production Compose file intentionally does not accept a plaintext bootstrap password. Provision
the initial administrator using a temporary, access-controlled Compose override that mounts a
one-time password file and a reviewed entrypoint or secret-manager integration. Remove the
override and secret immediately after one successful creation, restart the backend, and verify
that bootstrap is disabled. Never place the password in the environment file or command history.

Until that operator-specific mechanism is implemented and reviewed, use the application as a
public/read-only deployment and do not enable production administration.

## Backup

Back up PostgreSQL and `backend_uploads`; Redis contains rebuildable counters and is not the system
of record.

Example logical database backup (write the binary archive inside the container so Windows
PowerShell does not re-encode it):

```powershell
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env `
  exec -T postgres pg_dump -U business_os_app -d business_os -Fc -f /tmp/business_os.dump
$postgresContainer = docker compose -f docker-compose.prod.yml `
  --env-file C:\secure\business-os.production.env ps -q postgres
docker cp "${postgresContainer}:/tmp/business_os.dump" .\business_os.dump
docker compose -f docker-compose.prod.yml --env-file C:\secure\business-os.production.env `
  exec -T postgres rm -f /tmp/business_os.dump
```

The output may contain personal data. Encrypt it immediately, move it off-host, restrict access,
record its checksum, and apply the approved retention schedule. Back up draft uploads using a
volume-aware host tool while writes are paused or through a storage snapshot with documented
consistency guarantees.

## Restore exercise

Restore into an isolated environment, never over the only production copy:

1. create an empty PostgreSQL instance at the compatible major version;
2. restore with `pg_restore --clean --if-exists --no-owner`;
3. restore the uploads snapshot to a non-public volume;
4. start the approved application images and allow Flyway to validate/apply newer migrations;
5. verify counts, constraints, authentication, authorization, representative records, and files;
6. record duration, checksum, data-loss window, and any manual repair.

Run this exercise on a schedule. An unread or untested backup is not a recovery control.

## Rollback

For an application-only failure, set `BACKEND_IMAGE` and `FRONTEND_IMAGE` to the previous approved
digests and run `up -d` again. Do not roll back database files or edit Flyway history manually.

If the new migration is not backward compatible, stop the rollout and follow its reviewed forward
repair or restore plan. Restoring a database is a data-loss decision: preserve evidence, identify
the recovery point, obtain the incident lead's approval, and communicate the expected loss window.

## Monitoring and maintenance

Alert on container health, public availability, latency, 5xx/429 rates, login failures, Turnstile
failures, disk/volume capacity, backup age, certificate expiry, and unexpected restarts. Apply
dependency/base-image updates through the same CI, scan, review, digest, rollout, and rollback
process. See [Deployment security](DEPLOYMENT_SECURITY.md), [Threat model](THREAT_MODEL.md), and
[Incident response](INCIDENT_RESPONSE.md).
