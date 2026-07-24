#!/bin/sh
set -eu

read_secret() {
  secret_file="$1"
  secret_name="$2"

  if [ ! -r "$secret_file" ]; then
    echo "Required secret file for $secret_name is not readable." >&2
    exit 1
  fi

  secret_value="$(cat "$secret_file")"
  if [ -z "$secret_value" ]; then
    echo "Required secret file for $secret_name is empty." >&2
    exit 1
  fi

  printf '%s' "$secret_value"
}

if [ -n "${DATABASE_PASSWORD_FILE:-}" ]; then
  DATABASE_PASSWORD="$(read_secret "$DATABASE_PASSWORD_FILE" DATABASE_PASSWORD)"
  export DATABASE_PASSWORD
fi

if [ -n "${REDIS_PASSWORD_FILE:-}" ]; then
  REDIS_PASSWORD="$(read_secret "$REDIS_PASSWORD_FILE" REDIS_PASSWORD)"
  export REDIS_PASSWORD
fi

if [ -n "${RATE_LIMIT_KEY_SALT_FILE:-}" ]; then
  RATE_LIMIT_KEY_SALT="$(read_secret "$RATE_LIMIT_KEY_SALT_FILE" RATE_LIMIT_KEY_SALT)"
  export RATE_LIMIT_KEY_SALT
fi

if [ -n "${TURNSTILE_SECRET_KEY_FILE:-}" ]; then
  TURNSTILE_SECRET_KEY="$(read_secret "$TURNSTILE_SECRET_KEY_FILE" TURNSTILE_SECRET_KEY)"
  export TURNSTILE_SECRET_KEY
fi

if [ -n "${BOOTSTRAP_ADMIN_PASSWORD_FILE:-}" ]; then
  BOOTSTRAP_ADMIN_PASSWORD="$(read_secret "$BOOTSTRAP_ADMIN_PASSWORD_FILE" BOOTSTRAP_ADMIN_PASSWORD)"
  export BOOTSTRAP_ADMIN_PASSWORD
fi

exec java -jar /app/app.jar
