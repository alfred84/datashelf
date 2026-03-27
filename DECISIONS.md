# Architecture Decisions

## Overview

DataShelf follows Clean Architecture principles within an Nx monorepo, enforcing strict separation of concerns through four library layers.

## Architecture

### Layer Separation

- **domain**: Pure entities, value objects, repository interfaces. Zero external dependencies.
- **application**: Use cases that orchestrate business logic. Depends only on domain + shared.
- **infrastructure**: Framework-specific implementations (Prisma, BullMQ, file storage). Implements domain interfaces.
- **shared**: DTOs, validation schemas, constants, utility types. Shared across all layers.

### Why NestJS over Node/Express directly

NestJS provides built-in dependency injection that maps naturally to Clean Architecture's inversion of control. Module-based organization aligns with Nx project boundaries.

### Why BullMQ for Async Processing

CSV processing must be async per spec. BullMQ provides reliable job queuing with built-in retry, backoff, and dead-letter support. Redis as transport is lightweight and well-supported.

### Why Prisma

Required by the tech stack. Prisma provides type-safe queries, automatic migrations, and excellent PostgreSQL support. Prisma models are confined to the infrastructure layer and mapped to domain entities at the boundary.

### File Storage Strategy

Files are stored on local disk behind a `FileStorageService` interface. This allows future migration to S3 or similar object storage without modifying business logic.

## Trade-offs

- **Local file storage vs. S3**: Chose local storage for simplicity. S3 would be better for production scale.
- **Polling vs. WebSockets for status updates**: Chose polling for simplicity. WebSockets or SSE would provide real-time updates.
- **JWT in localStorage**: Acceptable for this scope. HttpOnly cookies would be more secure.

## What I Would Improve With More Time

- WebSocket/SSE for real-time file processing status
- S3-compatible object storage
- Rate limiting and request throttling
- Pagination on file list endpoint
- More granular error handling and user feedback
- Performance testing with large CSV files
- Horizontal scaling strategy for workers
