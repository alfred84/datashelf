# DataShelf

DataShelf is a web platform where users can upload CSV files and receive automatically generated data profile reports. Built with Angular + NestJS + PostgreSQL using Nx monorepo and Clean Architecture principles.

## Tech Stack

- **Frontend**: Angular 21, TailwindCSS 4.2
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL 16
- **Queue**: BullMQ + Redis
- **Monorepo**: Nx
- **Testing**: Jest, Playwright

## Prerequisites

- Node.js 24+
- Docker & Docker Compose
- npm 11+

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-user/datashelf.git
cd datashelf

# Install dependencies
npm install

# Start infrastructure (PostgreSQL + Redis)
docker compose up postgres redis -d

# Copy environment file
cp .env.example .env

# Run database migrations
npx prisma migrate deploy --config=libs/infrastructure/prisma/prisma.config.ts

# Generate Prisma client
npx prisma generate --config=libs/infrastructure/prisma/prisma.config.ts

# Start the API
npx nx serve api

# Start the worker (in another terminal)
npx nx serve worker

# Start the frontend (in another terminal)
npx nx serve frontend
```

## Docker (Full Stack)

```bash
docker compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000

## Project Structure

```
apps/
  api/          # NestJS REST API
  worker/       # BullMQ job processor
  frontend/     # Angular SPA

libs/
  domain/         # Entities, interfaces, value objects
  application/    # Use cases
  infrastructure/ # Prisma, storage, queue adapters
  shared/         # DTOs, types, validation
```

## Available Commands

```bash
# Lint all projects
npx nx run-many -t lint

# Run all tests
npx nx run-many -t test

# Build all projects
npx nx run-many -t build

# Run a specific project
npx nx serve api
npx nx serve frontend
npx nx serve worker

# Run tests for a specific project
npx nx test domain
npx nx test application
```

## Environment Variables

See [.env.example](.env.example) for all required environment variables.

## Documentation

- [DECISIONS.md](DECISIONS.md) - Architecture choices and trade-offs
- [AI_USAGE.md](AI_USAGE.md) - AI tools usage disclosure
