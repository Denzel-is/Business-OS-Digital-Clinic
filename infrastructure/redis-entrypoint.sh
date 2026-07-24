#!/bin/sh
set -eu

secret_file="${REDIS_PASSWORD_FILE:-/run/secrets/redis_password}"

if [ ! -r "$secret_file" ]; then
  echo "Redis password secret is not readable." >&2
  exit 1
fi

redis_password="$(cat "$secret_file")"
if [ -z "$redis_password" ]; then
  echo "Redis password secret is empty." >&2
  exit 1
fi

exec redis-server \
  --appendonly yes \
  --protected-mode yes \
  --requirepass "$redis_password"
