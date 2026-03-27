#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy --config=libs/infrastructure/prisma/prisma.config.ts

echo "Starting API server..."
exec node main.js
