# Lumen Server

Lumen's server is a Modular Monolith built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/), following Domain-Driven Design (DDD) principles.

## Architecture Principles

- **Modular Monolith**: Separated by domain boundaries (contexts) but deployed as a single service for simplified debugging, faster development, and transactional integrity.
- **Bounded Contexts**: 
  - `IAM`: Identity & Access Management (Users, Roles, Authentication).
  - `Vocabulary`: Flashcards, spaced repetition.
  - `Grammar`: Lessons, Exercises, Topics.
  - `Progress`: Tracking and Gamification.
  - `Listening-Speaking`: Speaking tasks and AI assessments.
  - `Reading`: Articles and comprehension.
- **AI Worker Isolation**: Heavy compute tasks like speech-to-text or writing grading are processed asynchronously via BullMQ (Redis) using isolated AI worker processes.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm run start:dev
   ```

3. Seed the database with mock data:
   ```bash
   pnpm run seed
   ```

## Key Technologies
- **NestJS** - Core framework
- **PostgreSQL** - Primary database
- **TypeORM** - ORM
- **BullMQ / Redis** - Job queues and background processing
- **Passport / JWT** - Authentication
