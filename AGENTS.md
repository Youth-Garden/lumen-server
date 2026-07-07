# AGENTS.md — NestJS DDD/CQRS Architecture Rules

This file defines mandatory rules and architectural patterns for any AI agent or developer contributing code to this repository. Read this file in full before writing or modifying any code.

---

## 1. Tech Stack (Mandatory)

| Layer          | Technology                                 | Notes                                                                                                                                       |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | **NestJS**                                 | Use `@nestjs/platform-fastify`, **NOT** `@nestjs/platform-express`                                                                          |
| HTTP Adapter   | **Fastify**                                | Always bootstrap with `FastifyAdapter`. Do not introduce Express-specific middleware or types (`express.Request`, `express.Response`, etc.) |
| ORM            | **TypeORM**                                | Use Repository pattern via TypeORM `Repository<Entity>` / `DataSource`, wrapped behind domain repository interfaces (see Section 4)         |
| Database       | PostgreSQL                                 |                                                                                                                                             |
| Message Broker | Kafka                                      | For cross-module domain event communication                                                                                                 |
| Job Queue      | BullMQ                                     | For async tasks (emails, notifications, etc.)                                                                                               |
| Validation     | `class-validator` + `class-transformer`    | All incoming/outgoing data must be validated via classes, never raw interfaces                                                              |
| Architecture   | DDD + CQRS + Event-Driven + Outbox Pattern |                                                                                                                                             |

### Fastify Bootstrap Reference

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

---

## 2. Type Safety Rules (STRICT — NO EXCEPTIONS)

### 2.1 `any` is FORBIDDEN

- **Never** use `any` as a type, return type, parameter type, or generic argument.
- **Never** use implicit `any` (make sure `noImplicitAny: true` is set in `tsconfig.json` and never suppress it).
- **Never** use `as any` to bypass a type error. If a cast is truly necessary, cast to the narrowest correct type, or fix the underlying type mismatch instead.
- If a type is genuinely unknown at compile time (e.g. parsing external JSON), use `unknown` and narrow it with type guards — never `any`.

```typescript
// ❌ FORBIDDEN
function parsePayload(raw: any): any {
  return JSON.parse(raw);
}

// ✅ CORRECT
function parsePayload(raw: string): unknown {
  return JSON.parse(raw);
}

function isUserPayload(value: unknown): value is UserPayloadDto {
  return typeof value === 'object' && value !== null && 'email' in value;
}
```

### 2.2 Every Request and Response MUST be a Class, Never a Bare Interface or Inline Type

This applies to **every layer that crosses a boundary**: HTTP controllers, Kafka consumers, BullMQ job payloads, and command/query objects.

- **Request DTOs**: Always a class decorated with `class-validator` decorators.
- **Response DTOs**: Always a class (not an interface, not `Record<string, unknown>`, not an inline object type). Response classes should use `class-transformer`'s `@Expose()` / `@Exclude()` to control serialized shape, especially to avoid leaking internal fields (e.g. password hashes).

```typescript
// ❌ FORBIDDEN — interface, no validation, no serialization control
export interface ChangeUserStatusRequest {
  userId: string;
  status: string;
  reason: string;
}

// ✅ CORRECT — class with validation
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { UserStatus } from '@/generated/typeorm/enums';

export class ChangeUserStatusDto {
  @IsUUID()
  userId: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  reason: string;
}

// ✅ CORRECT — response class with explicit serialization control
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
```

- Controllers must declare an explicit return type using the response class — never leave the return type inferred as `any` or `Promise<any>`.

```typescript
// ❌ FORBIDDEN
@Get(':id')
async getUser(@Param('id') id: string) {
  return this.queryBus.execute(new GetUserQuery(id));
}

// ✅ CORRECT
@Get(':id')
async getUser(@Param('id') id: string): Promise<UserResponseDto> {
  const user = await this.queryBus.execute<GetUserQuery, UserResponseDto>(
    new GetUserQuery(id),
  );
  return new UserResponseDto(user);
}
```

### 2.3 Generics Over `any` in Reusable Utilities

If writing a generic repository, mapper, or handler base class, use proper generic type parameters instead of `any`.

```typescript
// ❌ FORBIDDEN
abstract class BaseRepository {
  abstract save(entity: any): Promise<void>;
}

// ✅ CORRECT
abstract class BaseRepository<TEntity, TAggregate> {
  abstract save(aggregate: TAggregate): Promise<void>;
  abstract toDomain(entity: TEntity): TAggregate;
  abstract toPersistence(aggregate: TAggregate): TEntity;
}
```

### 2.4 Lint Enforcement

The following ESLint rule must be enabled and treated as an error, not a warning:

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

Any pull request that introduces a new `any` usage or disables one of these rules with an inline comment (`// eslint-disable-next-line @typescript-eslint/no-explicit-any`) must justify it explicitly in the PR description. Unjustified suppressions should be treated as a rule violation, not a valid workaround.

---

## 3. Module Structure (Clean Architecture / DDD Layering)

```
src/modules/{module-name}/
├── domain/                    # Business logic layer
│   ├── aggregates/            # Aggregate roots (business entities)
│   ├── value-objects/         # Immutable value objects
│   ├── events/                # Domain events
│   ├── repositories/          # Repository interfaces (ports)
│   ├── exceptions/            # Domain-specific exceptions
│   └── enums/                 # Domain constants
├── application/                # Use cases layer
│   ├── commands/               # CQRS commands
│   ├── queries/                # CQRS queries
│   ├── handlers/               # Command/Query/Event handlers
│   ├── dtos/                   # Request DTOs (class-validator)
│   └── responses/               # Response DTOs (class-transformer)
├── infrastructure/              # Technical implementations
│   ├── typeorm/                 # TypeORM entities + repository implementations
│   ├── adapters/                 # External service adapters
│   ├── jobs/                      # Outbox workers, cron jobs
│   └── kafka/                      # Kafka producers/consumers
├── presentation/                  # Interface layer
│   ├── http/                       # REST controllers (Fastify)
│   └── event-consumers/             # Kafka event consumers
└── {module}.module.ts                # Module configuration
```

**Dependency rule:** dependencies point inward only. `presentation` → `application` → `domain`. `infrastructure` implements interfaces defined in `domain`, never the other way around. `domain` must never import from `infrastructure` or `presentation`.

---

## 4. Key Patterns

### 4.1 Aggregate Root

Aggregates encapsulate business logic, maintain invariants, and emit domain events. They must never contain `any` typed properties or methods.

```typescript
export class AuthUser extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _email: Email,
    private _status: UserStatus,
  ) {
    super();
  }

  static register(email: Email, password: HashedPassword): AuthUser {
    const user = new AuthUser(crypto.randomUUID(), email, UserStatus.PENDING);
    user.apply(new UserRegisteredEvent(user._id, email.value));
    return user;
  }

  static restore(id: string, email: Email, status: UserStatus): AuthUser {
    return new AuthUser(id, email, status);
  }

  changeStatus(newStatus: UserStatus, reason: string): void {
    if (this._status === newStatus) {
      throw new InvalidStatusTransitionException(newStatus);
    }
    this._status = newStatus;
    this.apply(new UserStatusChangedEvent(this._id, newStatus, reason));
  }

  get id(): string {
    return this._id;
  }
}
```

### 4.2 Value Objects

Immutable, self-validating. Constructor throws on invalid input — never return `any` or unchecked primitives.

```typescript
export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new InvalidEmailException(value);
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
```

### 4.3 CQRS

**Commands (write):**

```typescript
export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<
  RegisterUserCommand,
  void
> {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const email = new Email(command.email);
    const hashedPassword = await HashedPassword.fromPlainText(command.password);
    const user = AuthUser.register(email, hashedPassword);
    await this.authUserRepository.save(user);
  }
}
```

Always declare the second generic argument of `ICommandHandler<TCommand, TResult>` explicitly — do not let it default to `any`.

**Queries (read):** kept separate from commands, may bypass the aggregate and read directly from a read-optimized TypeORM query when justified by performance, but the return type must still be an explicit response class.

### 4.4 Domain Events & Event-Driven Architecture

```typescript
export class UserStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly newStatus: UserStatus,
    public readonly reason: string,
  ) {
    super({ aggregateId });
  }
}
```

Flow: `Aggregate → Domain Event → Outbox → Kafka → Event Consumer → Event Handler`.

### 4.5 Outbox Pattern (Reliable Event Publishing)

Persist aggregate state and domain events atomically in the same TypeORM transaction; a background worker publishes pending outbox rows to Kafka.

```typescript
async save(aggregate: AuthUser): Promise<void> {
  const domainEvents = aggregate.getUncommittedEvents();

  await this.dataSource.transaction(async (manager) => {
    const entity = this.toPersistence(aggregate);
    await manager.getRepository(UserEntity).save(entity);

    for (const event of domainEvents) {
      const outboxEntity = manager.getRepository(IntegrationEventOutboxEntity).create({
        type: event.constructor.name,
        payload: JSON.stringify(event),
        status: OutboxStatus.PENDING,
      });
      await manager.save(outboxEntity);
    }
  });

  aggregate.commit();
}
```

Never type the `payload` field or the outbox row as `any`. Define an explicit `IntegrationEventPayload` class/interface per event type, or at minimum use `Record<string, unknown>` with a validated deserializer on the consumer side.

### 4.6 Cross-Module Communication

Producer module emits a domain event → Outbox worker publishes to Kafka → Consumer module's `@EventPattern()` handler receives it → Consumer module maps the raw Kafka payload into its own typed DTO class (never trust the raw payload as `any`) → BullMQ job queued if further async work (e.g. sending email) is required.

---

## 5. Repository Pattern with TypeORM

- Domain layer defines a repository **interface** (port), e.g. `AuthUserRepository`, with methods returning domain aggregates — never TypeORM entities directly.
- Infrastructure layer implements this interface using TypeORM's `Repository<Entity>` or `DataSource`, and is responsible for mapping between the TypeORM entity and the domain aggregate (`toDomain` / `toPersistence`).
- Controllers, handlers, and domain code must never import a TypeORM entity class directly — only the domain aggregate and repository interface.

```typescript
// domain/repositories/auth-user.repository.ts
export const AUTH_USER_REPOSITORY = Symbol('AUTH_USER_REPOSITORY');

export interface AuthUserRepository {
  save(user: AuthUser): Promise<void>;
  findById(id: string): Promise<AuthUser | null>;
  findByEmail(email: string): Promise<AuthUser | null>;
}

// infrastructure/typeorm/auth-user.repository.ts
@Injectable()
export class AuthUserRepositoryImpl implements AuthUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<AuthUser | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return AuthUser.restore(entity.id, new Email(entity.email), entity.status);
  }

  async save(user: AuthUser): Promise<void> {
    const entity = this.toPersistence(user);
    await this.repository.save(entity);
  }

  private toPersistence(user: AuthUser): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    return entity;
  }
}
```

---

## 6. Naming Conventions

| Concept        | Convention                           | Example                   |
| -------------- | ------------------------------------ | ------------------------- |
| Command        | `{Action}{Entity}Command`            | `RegisterUserCommand`     |
| Query          | `{Action}{Entity}Query`              | `GetUserByIdQuery`        |
| Event          | `{Entity}{Action}Event` (past tense) | `UserRegisteredEvent`     |
| Handler        | `{CommandOrEventName}Handler`        | `RegisterUserHandler`     |
| Request DTO    | `{Action}{Entity}Dto`                | `ChangeUserStatusDto`     |
| Response DTO   | `{Entity}ResponseDto`                | `UserResponseDto`         |
| Aggregate      | `{EntityName}`                       | `AuthUser`                |
| Value Object   | `{Concept}`                          | `Email`, `HपुरमPassword` |
| TypeORM Entity | `{EntityName}Entity`                 | `UserEntity`              |
| Repo Interface | `I{EntityName}Repository`            | `IUserRepository`         |
| Repo Impl      | `{EntityName}Repository`             | `UserRepository`          |

**Naming Rules for Infrastructure Files & Classes:**
Do not use technology-specific prefixes like `typeorm-` or `TypeOrm` for repository implementations. Since the file is already located inside the `infrastructure/typeorm/` directory, its context is clear. Use generic names to keep the code clean.
- ❌ **Forbidden**: `typeorm-user.repository.ts`, `class TypeOrmUserRepository`
- ✅ **Correct**: `user.repository.ts`, `class UserRepository implements IUserRepository`

---

## 7. Implementation Checklist for New Features

**Step 1 — Domain Layer**

- [ ] Create domain event class in `domain/events/`
- [ ] Add business method to aggregate in `domain/aggregates/` (no `any`, all params/returns typed)
- [ ] Add value objects if needed in `domain/value-objects/`
- [ ] Add domain exceptions in `domain/exceptions/`

**Step 2 — Application Layer**

- [ ] Create command/query class in `application/commands/` or `application/queries/`
- [ ] Create request DTO class with `class-validator` decorators in `application/dtos/`
- [ ] Create response DTO class with `class-transformer` decorators in `application/responses/`
- [ ] Create handler implementing `ICommandHandler<TCommand, TResult>` or `IQueryHandler<TQuery, TResult>` with explicit generics
- [ ] Inject required repository interfaces (never concrete TypeORM repositories)

**Step 3 — Presentation Layer**

- [ ] Add Fastify-compatible controller endpoint with explicit return type (response DTO class)
- [ ] Apply `@ResponseMessage()` decorator if used in this project's convention
- [ ] Execute command/query via `CommandBus` / `QueryBus`

**Step 4 — Registration**

- [ ] Register handler in `{module}.module.ts` providers

**Step 5 — Cross-Module Events (if applicable)**

- [ ] Create event DTO class in consumer module
- [ ] Create event handler in consumer module
- [ ] Add `@EventPattern()` in consumer's `event-consumers/`
- [ ] Register handler in consumer module

**Step 6 — Type Safety Gate (mandatory before marking task done)**

- [ ] Run `tsc --noEmit` — zero errors
- [ ] Run `eslint . --max-warnings 0` — zero `no-explicit-any` violations
- [ ] Confirm every request/response crossing a controller, Kafka consumer, or BullMQ job boundary is a class, not an interface or inline type

---

## 8. Best Practices Summary

1. **Business logic lives in aggregates**, never in handlers or controllers.
   ```typescript
   // ✅ user.changeStatus(newStatus, reason);
   // ❌ if (user.status === 'ACTIVE') { throw new Error('...'); }
   ```
2. **Transactions**: one TypeORM transaction per command execution; aggregate state and outbox events saved together.
3. **Validation layering**: value objects validate in constructor; DTOs validate via `class-validator`; aggregates validate business invariants in methods.
4. **Error handling**: domain exceptions extend a common `DomainException` base class; let NestJS exception filters translate them to HTTP responses — do not catch-and-rethrow as generic `Error`.
5. **No `any`, ever** — see Section 2. This is the single most enforced rule in this codebase; treat any PR introducing `any` as incomplete work, not a valid shortcut.
6. **No bare interfaces for I/O boundaries** — always classes, always validated, always explicit response shape.
7. **Fastify only** — do not add Express-specific packages or types to `package.json`.
8. **TypeORM entities are infrastructure details** — they must never leak into `domain/` or `presentation/` layers.

---

## 9. Testing Strategy

- **Unit tests**: test aggregates in isolation, mock repository interfaces, assert emitted domain events.
- **Integration tests**: test handlers against a real database (e.g. via testcontainers with TypeORM), verify outbox rows are created.
- **E2E tests**: exercise the Fastify HTTP endpoints directly, verify downstream effects (e.g. BullMQ jobs queued, Kafka messages produced).

---

## 10. Troubleshooting

**Events not published:**

- Confirm the outbox worker cron job is running.
- Verify Kafka connectivity.
- Inspect the outbox table for rows stuck in `PENDING`.

**Handler not triggered:**

- Confirm the handler is registered in the module's `providers` array.
- Confirm `@CommandHandler()` / `@EventsHandler()` decorator is present.
- Confirm `CqrsModule` is imported in the module.

**`any` type sneaking into a PR:**

- Check for implicit `any` from an untyped third-party library — add a local `.d.ts` declaration instead of casting to `any`.
- Check for `JSON.parse()` results used without narrowing — wrap in a type guard or a `class-transformer` `plainToInstance()` call against a DTO class.
  
## 11. Custom System Rules & Patterns

### 11.1 API Response & Error Handling Standards
See details at https://github.com/Youth-Garden/lumen-server/wiki

- **Exceptions**: The current architecture uses `AppException` combined with an `ErrorDefinition` Object (instead of multiple scattered Exception classes) following DDD patterns.
- **Controller Returns**: Do not return inline promise types (e.g., `Promise<{ id: string }>`) from Controllers manually wrapped in explicit classes. Instead, **return the direct payload** (e.g., `{ id }` or `void`). The global `ResponseWrapperInterceptor` will automatically map and wrap the data into the `data` field of a `BaseResponse`, correctly handling both standard data and `PagedData`. Do NOT use redundant DTOs like `SuccessResponseDto` or `IdResponseDto`.

### 11.2 Environment Variables
- **Rule of Three**: Whenever a new environment variable is added, you MUST update it in three places:
  1. `validation.schema.ts` (Joi validation)
  2. The corresponding `*.config.ts` file (Typed ConfigService setup)
  3. `.env.example`
