# Lumen Server

Lumen's backend is a Modular Monolith built with NestJS 11 and TypeORM, following Domain-Driven Design (DDD) and CQRS principles. It exposes a fast, secure REST API powering the Lumen vocabulary learning platform.

## Authentication (Passwordless)

The server enforces a passwordless authentication model:

- **Google OAuth2**: Client sends a Google ID token; server verifies it via `google-auth-library` and logs the user in (auto-registering on first use).
- **Email OTP**: Client requests a 6-digit code, the server stores a bcrypt-hashed copy in Redis (`otp:{email}`, 5-minute TTL) and emails it via Resend; the client verifies the code to log in.

Endpoints under `/api/iam`:

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | `/email-otp/send` | Generate + email a 6-digit OTP |
| POST | `/login` | Verify OTP, auto-register, return tokens |
| POST | `/google-login` | Verify Google ID token, return tokens |
| POST | `/refresh` | Rotate access + refresh tokens |
| POST | `/logout` | Revoke the current refresh token |
| GET  | `/me` | Current user profile |
| GET  | `/sessions` | Active sessions |
| PUT  | `/profile` | Update profile (fullName, avatarUrl, phone) |

Access + refresh tokens are set as HTTP-only cookies. `AuthProvider` is `GOOGLE` | `EMAIL`.

## Architecture Principles

- **Modular Monolith**: Organized by bounded contexts deployed as a single unified service for transactional integrity and simplified operations.
- **CQRS & Domain Events**: Commands and Queries are decoupled using `@nestjs/cqrs` and in-process EventBus.
- **Bounded Contexts**:
  - `IAM` - Identity & Access Management (users, authentication, sessions).
  - `Vocabulary` - Words, folders, flashcards, and spaced repetition scheduling.
  - `Progress` - Habit tracking, gamification, streaks, streak freezes, XP, and activity heatmaps.
  - `Material` - Dictation exercises, audio media, and transcripts.
  - `Notification` - In-app notification management.
  - `Billing` - Subscription and transaction records.

## Project Structure

```
src/
  app.module.ts
  seed.ts                      # database seeding script
  shared/                      # cross-cutting: config, exceptions, mail, redis, strategies
    application/services/      # HashingService, TokenService, GoogleAuthService, HttpClientService
    infrastructure/redis/      # RedisService (ioredis client, caching, OTP)
    infrastructure/mail/       # ResendService (email processor with Handlebars)
    infrastructure/storage/    # Cloudflare R2 / S3 storage service
    infrastructure/keep-alive/ # KeepAliveService
    presentation/              # guards, decorators (Public, CurrentUser, RefreshToken), interceptors
  contexts/
    iam/
      domain/                  # entities, enums, repositories (interfaces), exceptions
      application/             # commands, queries, handlers, dtos, services
      infrastructure/          # TypeORM entities, repository implementation
      presentation/http/       # IamController
      iam.module.ts
    vocabulary/
    progress/
    material/
    notification/
    billing/
```

## Key Technologies
- NestJS 11 (Fastify platform adapter)
- PostgreSQL + TypeORM
- Upstash Redis (`ioredis` + `cache-manager-redis-yet`) for OTP verification, rate limiting, and caching
- CQRS & In-Process Event Bus (`@nestjs/cqrs`)
- JWT (`@nestjs/jwt`) with HTTP-only cookie sessions
- `class-validator` / `class-transformer` for DTO validation
- Resend + Handlebars for transactional emails
- Cloudflare R2 / S3 storage
- Swagger / OpenAPI
- Throttler for rate limiting
- `ts-fsrs` for spaced repetition algorithm

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm run db:up      # local Postgres/Redis via Docker (if applicable)
pnpm run seed       # seed vocabulary words, folders, and demo users
pnpm run start:dev  # watch mode, http://localhost:3000
```

## Scripts
- `pnpm run build` - compile with `nest build`.
- `pnpm run start:dev` - development server with watch mode.
- `pnpm run start:prod` - run the compiled `dist/main`.
- `pnpm run seed` - populate the database with mock vocabulary data (`src/seed.ts`).
- `pnpm run lint` - ESLint with `--fix`.
- `pnpm run format` - Prettier formatting.
- `pnpm run test` - Jest unit tests across CQRS commands, event listeners, domain aggregates, and DTOs (located in `__tests__/` subfolders).
- `pnpm run test:e2e` - end-to-end tests.

## Configuration
All configuration is validated by `shared/infrastructure/config/validation.schema.ts` (Joi). Required variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID`, `UPSTASH_REDIS_URL`, `RESEND_API_KEY`, `R2_*`, `FRONTEND_URL`. See `.env.example`.
