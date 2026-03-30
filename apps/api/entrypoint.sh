#!/bin/sh
set -e

required_vars="DATABASE_URL REDIS_HOST REDIS_PORT JWT_SECRET API_PORT UPLOAD_DIR"
for var in $required_vars; do
  eval "value=\${$var}"
  if [ -z "$value" ]; then
    echo "Missing required environment variable: $var" >&2
    exit 1
  fi
done

mkdir -p "$UPLOAD_DIR"

echo "Applying Prisma migrations..."
attempt=1
max_attempts=10
until npx prisma migrate deploy --config=libs/infrastructure/prisma/prisma.config.ts; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Prisma migrations failed after $max_attempts attempts" >&2
    exit 1
  fi

  echo "Migration attempt $attempt failed, retrying in 3s..."
  attempt=$((attempt + 1))
  sleep 3
done

echo "Starting API server..."
exec node main.js
