# Lumen Server

Lumen's backend is a Modular Monolith built with NestJS 11 and TypeORM, following Domain-Driven Design (DDD) principles. It exposes a REST API consumed by the web and admin frontends.

## Authentication (Passwordless)

The server has no password login. Two methods are supported:

- Google OAuth2: client sends a Google ID token; the server verifies it via `google-auth-library` and logs the user in, creating the account on first use.
- Email OTP: client requests a 6-digit code, the server stores a bcrypt-hashed copy in Redis (`otp:{email}`, 5-minute TTL) and emails it; the client verifies the code to log in. The user is auto-created on first successful verification.

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

Access + refresh tokens are set as HTTP-only cookies. `AuthProvider` is `GOOGLE` | `EMAIL`. The `password` column was removed from `iam_users` (migration `migrations/0001_drop_iam_users_password.sql`).

## Architecture Principles

- Modular Monolith: separated by domain boundaries (contexts) but deployed as one service for transactional integrity and simple debugging.
- CQRS: commands and queries are separated using `@nestjs/cqrs`.
- Bounded contexts:
  - `IAM` - Identity & Access Management (users, roles, authentication, sessions).
  - `Vocabulary` - Flashcards, decks, spaced repetition.
  - `Grammar` - Lessons, exercises, topics.
  - `Progress` - Tracking, gamification, leaderboards, badges, heatmaps.
  - `Listening-Speaking` - Speaking tasks and AI assessments.
  - `Reading` - Articles and comprehension, translation.
  - `TOEIC` - Mock tests, questions, explanations.
  - `Material` - Dictation media and transcripts.
  - `Quiz` - Adaptive quizzes.
  - `Notification` - In-app notifications.

## Project Structure

```
src/
  app.module.ts
  seed.ts                      # database seeding script
  shared/                      # cross-cutting: config, exceptions, mail, redis, strategies
    application/services/      # HashingService, TokenService, GoogleAuthService, HttpClientService
    infrastructure/redis/      # RedisService (ioredis client)
    infrastructure/queue/      # BullMQ queue module + mail processor
    presentation/              # guards, decorators (Public, CurrentUser, RefreshToken), interceptors
  contexts/
    iam/
      domain/                  # entities, enums, repositories (interfaces), exceptions
      application/             # commands, queries, handlers, dtos, services
      infrastructure/          # TypeORM entities, repository implementation
      presentation/http/       # IamController
      iam.module.ts
    ... (other contexts follow the same layering)
```

## Key Technologies
- NestJS 11 (Fastify platform)
- PostgreSQL + TypeORM (`synchronize: true` in dev)
- BullMQ + Upstash Redis (ioredis)
- JWT (`@nestjs/jwt`) with HTTP-only cookie sessions
- class-validator / class-transformer for DTO validation
- Resend + Handlebars for email
- Swagger / OpenAPI
- Throttler for rate limiting
- ts-fsrs for spaced repetition scheduling

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm run db:up      # local Postgres/Redis via Docker (if applicable)
pnpm run seed       # seed vocabulary, articles, TOEIC tests, users
pnpm run start:dev  # watch mode, http://localhost:3000
```

## Scripts
- `pnpm run build` - compile with `nest build`.
- `pnpm run start:dev` - development server with watch.
- `pnpm run start:prod` - run the compiled `dist/main`.
- `pnpm run seed` - populate the database with mock data (`src/seed.ts`).
- `pnpm run lint` - ESLint with `--fix`.
- `pnpm run format` - Prettier write.
- `pnpm run test` - Jest unit tests.
- `pnpm run test:e2e` - end-to-end tests.

## Configuration
All configuration is validated by `shared/infrastructure/config/validation.schema.ts` (Joi). Required variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID`, `UPSTASH_REDIS_URL`, `RESEND_API_KEY`, `R2_*`, `FRONTEND_URL`. See `.env.example`.

## Notes
- `synchronize: true` is enabled, so entity changes (including the removed `password` column) are applied to the database automatically on boot in non-production environments. For production where sync is disabled, run `migrations/0001_drop_iam_users_password.sql`.
- `KeepAliveService` pings the API on an interval to keep free-tier database/compute from sleeping.
