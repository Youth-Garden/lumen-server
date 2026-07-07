# Tài liệu Kiến trúc Triển khai — Lumen
### Modular Monolith theo DDD (NestJS + Next.js)

## 1. Nguyên tắc kiến trúc tổng thể

- **Không dùng microservices ở giai đoạn đầu.** Áp dụng **Modular Monolith**: tách rõ ranh giới domain trong code (theo tinh thần DDD) nhưng deploy như một service duy nhất — dễ debug, dễ transaction, tốc độ phát triển nhanh.
- **Một ngoại lệ tách riêng ngay từ đầu:** module xử lý AI nặng (chấm Speaking/Writing, speech-to-text) chạy dưới dạng **worker riêng** giao tiếp qua queue, vì tác vụ này tốn compute, cần xử lý bất đồng bộ, và có thể cần scale độc lập.
- Khi hệ thống thực sự lớn (nhiều team, traffic cao), ranh giới Bounded Context đã rõ ràng sẵn → có thể tách microservices dễ dàng mà không phải viết lại từ đầu.

```
┌─────────────────────────────────────────────────────────┐
│                      Next.js (FE)                        │
│         App Router · SSR cho SEO · React Query           │
└───────────────────────┬───────────────────────────────────┘
                         │ REST/GraphQL (HTTPS)
┌───────────────────────▼───────────────────────────────────┐
│                  NestJS API Gateway Layer                  │
│         Auth Guard · Rate Limit · Validation Pipe           │
└───────────────────────┬───────────────────────────────────┘
                         │
┌───────────────────────▼───────────────────────────────────┐
│              MODULAR MONOLITH (NestJS)                     │
│  ┌──────────┐ ┌───────────┐ ┌──────────────┐ ┌──────────┐  │
│  │   IAM    │ │Vocabulary │ │ExamPractice  │ │ Progress │  │
│  │ Context  │ │ Context   │ │  Context     │ │ Context  │  │
│  └──────────┘ └───────────┘ └──────────────┘ └──────────┘  │
│  ┌──────────┐ ┌───────────┐ ┌──────────────┐               │
│  │ Grammar  │ │ Listening │ │  Billing     │               │
│  │ Context  │ │/Speaking  │ │  Context     │               │
│  └──────────┘ └───────────┘ └──────────────┘               │
└───────┬─────────────────────────────┬───────────────────────┘
        │ PostgreSQL (1 DB, schema    │ BullMQ (Redis)
        │ theo schema-per-context)    │ Publish job
        │                             ▼
        │                 ┌───────────────────────────┐
        │                 │   AI Worker Service        │
        │                 │  (Speaking/Writing grading)│
        │                 │  Node.js hoặc Python worker│
        │                 └──────────┬────────────────┘
        │                            │ gọi ngoài
        ▼                            ▼
   PostgreSQL                 External AI APIs
   (nguồn dữ liệu chính)      (LLM, Speech-to-Text)
```

## 2. Xác định Bounded Context (theo DDD)

Bounded Context là ranh giới nghiệp vụ — mỗi context có model dữ liệu, ngôn ngữ nghiệp vụ (ubiquitous language) riêng, tránh việc một "Entity" bị dùng chung ý nghĩa cho nhiều mục đích khác nhau.

| Bounded Context | Trách nhiệm | Ubiquitous Language (thuật ngữ chính) |
|---|---|---|
| **IAM** (Identity & Access) | Đăng ký, đăng nhập, phân quyền, subscription tier | User, Role, Session, Plan |
| **Vocabulary** | Từ vựng, flashcard, spaced repetition | Word, WordSet, ReviewSchedule, Deck |
| **Grammar** | Bài học ngữ pháp, bài tập | Lesson, Exercise, Rule |
| **ExamPractice** | Đề thi thử, chấm điểm trắc nghiệm, band score | MockTest, Question, Attempt, Score |
| **ListeningSpeaking** | Bài nghe, luyện nói, chấm phát âm | AudioLesson, SpeakingTask, PronunciationScore |
| **Progress** | Theo dõi tiến độ tổng thể, dashboard, gợi ý lộ trình | LearningPath, Milestone, StreakRecord |
| **Billing** | Thanh toán, gói subscription, hóa đơn | Subscription, Invoice, Payment |

**Nguyên tắc giao tiếp giữa các Context:**
- Trong monolith: giao tiếp qua **Domain Events** nội bộ (VD: `ExamAttemptCompletedEvent` được `ExamPractice` phát ra, `Progress` context lắng nghe để cập nhật dashboard) — tránh gọi trực tiếp service của context khác để giữ tính độc lập (loose coupling).
- Không context nào được truy vấn thẳng vào bảng database của context khác — chỉ giao tiếp qua interface/service công khai của context đó.

## 3. Cấu trúc thư mục dự án NestJS (theo DDD)

Mỗi Bounded Context tổ chức theo 4 lớp kinh điển của DDD: **Domain — Application — Infrastructure — Presentation**.

```
src/
├── contexts/
│   ├── vocabulary/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── word.entity.ts
│   │   │   │   └── word-set.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── cefr-level.vo.ts
│   │   │   │   └── review-interval.vo.ts
│   │   │   ├── repositories/            # interface (port), KHÔNG implement ở đây
│   │   │   │   └── word.repository.interface.ts
│   │   │   ├── services/                # Domain Services (business logic thuần)
│   │   │   │   └── spaced-repetition.domain-service.ts
│   │   │   └── events/
│   │   │       └── word-mastered.event.ts
│   │   │
│   │   ├── application/
│   │   │   ├── commands/                # CQRS - Command side (ghi dữ liệu)
│   │   │   │   ├── add-word-to-deck.command.ts
│   │   │   │   └── add-word-to-deck.handler.ts
│   │   │   ├── queries/                 # CQRS - Query side (đọc dữ liệu)
│   │   │   │   ├── get-due-flashcards.query.ts
│   │   │   │   └── get-due-flashcards.handler.ts
│   │   │   └── dto/
│   │   │       └── word.dto.ts
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── word.orm-entity.ts       # TypeORM/Prisma entity (khác domain entity)
│   │   │   │   └── word.repository.ts       # implement interface ở domain/
│   │   │   ├── external/
│   │   │   │   └── dictionary-api.adapter.ts # gọi Free Dictionary API/WordsAPI
│   │   │   └── event-handlers/
│   │   │       └── word-mastered.listener.ts
│   │   │
│   │   ├── presentation/
│   │   │   ├── vocabulary.controller.ts
│   │   │   └── vocabulary.module.ts
│   │   │
│   │   └── vocabulary.module.ts   # Nest Module gộp tất cả lại
│   │
│   ├── grammar/            # cấu trúc tương tự vocabulary/
│   ├── exam-practice/      # cấu trúc tương tự
│   ├── listening-speaking/ # cấu trúc tương tự, có thêm client gọi AI Worker qua queue
│   ├── progress/           # cấu trúc tương tự
│   ├── billing/            # cấu trúc tương tự
│   └── iam/                # cấu trúc tương tự
│
├── shared-kernel/           # Code dùng chung GIỮA các context (hạn chế tối đa)
│   ├── domain/
│   │   └── base-entity.ts
│   ├── decorators/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── interceptors/
│   └── events/
│       └── domain-event-bus.ts
│
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── env.validation.ts
│
├── app.module.ts
└── main.ts
```

### Giải thích các lớp

- **Domain layer**: chứa logic nghiệp vụ thuần túy, KHÔNG phụ thuộc vào NestJS, database hay framework nào. VD: thuật toán Spaced Repetition tính ngày ôn tập tiếp theo phải là hàm thuần (pure function), test được độc lập không cần mock database.
- **Application layer**: điều phối use case, dùng pattern **CQRS** (Command Query Responsibility Segregation) — tách rõ luồng ghi (Command) và đọc (Query). NestJS hỗ trợ sẵn package `@nestjs/cqrs`.
- **Infrastructure layer**: chi tiết kỹ thuật — ORM, gọi API ngoài, cache. Đây là nơi duy nhất được phép "biết" về TypeORM/Prisma, Redis, HTTP client.
- **Presentation layer**: Controller, DTO validate request/response, Nest Module wiring.

## 4. Domain Model mẫu chi tiết — Context "Vocabulary"

Để minh họa cách áp dụng DDD thực tế, đây là ví dụ đầy đủ cho module Vocabulary:

### Value Object: `CefrLevel`
```typescript
// domain/value-objects/cefr-level.vo.ts
export class CefrLevel {
  private static readonly VALID_LEVELS = ['A1','A2','B1','B2','C1','C2'];

  private constructor(private readonly value: string) {}

  static create(value: string): CefrLevel {
    if (!this.VALID_LEVELS.includes(value)) {
      throw new InvalidCefrLevelError(value);
    }
    return new CefrLevel(value);
  }

  toString(): string { return this.value; }

  isHigherThan(other: CefrLevel): boolean {
    return this.VALID_LEVELS.indexOf(this.value)
         > this.VALID_LEVELS.indexOf(other.value);
  }
}
```

### Entity: `Word` (Aggregate Root)
```typescript
// domain/entities/word.entity.ts
export class Word {
  private constructor(
    private readonly id: WordId,
    private readonly text: string,
    private readonly cefrLevel: CefrLevel,
    private readonly definitions: Definition[],
    private masteryStatus: MasteryStatus,
  ) {}

  static create(props: CreateWordProps): Word { /* ... factory + validate invariants */ }

  markAsReviewed(quality: ReviewQuality): DomainEvent[] {
    // Business logic: cập nhật trạng thái ghi nhớ theo thuật toán SM-2
    this.masteryStatus = this.masteryStatus.advance(quality);
    if (this.masteryStatus.isMastered()) {
      return [new WordMasteredEvent(this.id)];
    }
    return [];
  }
}
```

### Domain Service: thuật toán Spaced Repetition
```typescript
// domain/services/spaced-repetition.domain-service.ts
// Thuần logic nghiệp vụ, KHÔNG import gì từ NestJS/database
export class SpacedRepetitionDomainService {
  calculateNextReviewDate(
    previousInterval: number,
    easeFactor: number,
    quality: ReviewQuality,
  ): ReviewSchedule {
    // Áp dụng thuật toán SM-2 (SuperMemo)
    // ...
  }
}
```

### Application layer — Command Handler (CQRS)
```typescript
// application/commands/review-flashcard.handler.ts
@CommandHandler(ReviewFlashcardCommand)
export class ReviewFlashcardHandler
  implements ICommandHandler<ReviewFlashcardCommand> {

  constructor(
    @Inject('WordRepository') private readonly wordRepo: WordRepositoryInterface,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReviewFlashcardCommand): Promise<void> {
    const word = await this.wordRepo.findById(command.wordId);
    const events = word.markAsReviewed(command.quality);
    await this.wordRepo.save(word);
    events.forEach(e => this.eventBus.publish(e));
  }
}
```

**Điểm mấu chốt:** Controller chỉ gọi `CommandBus.execute()` / `QueryBus.execute()`, không chứa logic nghiệp vụ. Toàn bộ logic nằm ở Domain + Application layer, giúp dễ test và dễ thay đổi framework sau này nếu cần.

## 5. Giao tiếp bất đồng bộ — Domain Events giữa các Context

Ví dụ luồng: Người dùng hoàn thành một bài thi thử (ExamPractice context) → cần cập nhật Progress dashboard.

```
ExamPractice Context                          Progress Context
─────────────────────                          ─────────────────
ExamAttempt.complete()
   └─> phát ExamAttemptCompletedEvent
              │
              ▼
     EventBus (nội bộ, trong process)
              │
              ▼
                                    ProgressUpdateListener lắng nghe event
                                    └─> cập nhật LearningPath, Milestone
```

- Dùng `@nestjs/cqrs` EventBus cho giao tiếp **nội bộ trong process** (đủ dùng ở quy mô monolith).
- Khi cần độ tin cậy cao hơn (không mất event nếu service crash), cân nhắc **Outbox Pattern**: lưu event vào bảng `outbox_events` trong cùng transaction với write chính, sau đó một background job đọc và publish — tránh mất dữ liệu khi có lỗi giữa chừng.

## 6. Xử lý tác vụ AI nặng — Worker riêng qua Queue

```
NestJS Monolith                    Redis (BullMQ)              AI Worker Service
────────────────                   ───────────────              ──────────────────
POST /speaking/submit
   └─> validate, lưu audio (S3)
   └─> push job "grade-speaking"
                  │
                  ▼
           Queue: speaking-grading
                  │
                                                          ┌──────▼──────────────┐
                                                          │ Worker nhận job       │
                                                          │ 1. Speech-to-text     │
                                                          │ 2. Gọi LLM chấm điểm  │
                                                          │ 3. Lưu kết quả vào DB │
                                                          │ 4. Emit event hoàn tất│
                                                          └───────────────────────┘
GET /speaking/result/:id  <── FE polling hoặc WebSocket khi job xong
```

- **Vì sao tách worker riêng:** tác vụ gọi Speech-to-Text + LLM có độ trễ vài giây đến vài chục giây — không thể block HTTP request. Tách worker cho phép scale riêng (thêm worker instance) khi lượng người dùng luyện Speaking tăng, không ảnh hưởng phần API chính.
- **Thông báo kết quả cho FE:** dùng WebSocket (NestJS Gateway) hoặc polling định kỳ vào endpoint kết quả.

## 7. Data Layer — Chiến lược Database

- **1 PostgreSQL instance duy nhất ở giai đoạn đầu**, nhưng tổ chức theo **schema riêng cho mỗi Bounded Context** (VD: `vocabulary.words`, `exam_practice.mock_tests`) — giúp giữ ranh giới rõ ràng, dễ tách database riêng sau này nếu cần scale.
- **Không dùng chung 1 bảng User cho nhiều mục đích khác nhau** — context nào cần thông tin user chỉ lưu `userId` tham chiếu, không JOIN trực tiếp qua schema khác trong code nghiệp vụ (tránh coupling).
- ORM đề xuất: **Prisma** (dễ dùng, type-safe, schema migration tốt) hoặc **TypeORM** (tích hợp native với NestJS, hỗ trợ pattern Repository rõ ràng hơn cho DDD).

## 8. Công nghệ cụ thể — Tổng hợp

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Backend framework | NestJS | Modular Monolith, CQRS module |
| Frontend | Next.js (App Router) | SSR cho trang bài học (SEO), CSR cho phần luyện tập tương tác |
| Database | PostgreSQL | Schema-per-context |
| ORM | Prisma hoặc TypeORM | Tùy đội ngũ quen thuộc hơn |
| Cache/Session | Redis | Session, rate-limit, cache flashcard due list |
| Queue | BullMQ (trên Redis) | Job chấm AI, gửi email, tác vụ nặng |
| AI Worker | Node.js hoặc Python service riêng | Gọi LLM API, Speech-to-Text API |
| Object Storage | S3 hoặc Cloudflare R2 | Lưu file audio ghi âm, ảnh minh họa |
| Auth | Passport.js + JWT (NestJS) | Access token + refresh token |
| API docs | Swagger (`@nestjs/swagger`) | Tự sinh từ decorator |
| Realtime (tùy chọn) | Socket.IO (NestJS Gateway) | Thông báo kết quả chấm AI |

## 9. Chiến lược triển khai (Deployment)

### Giai đoạn MVP
```
┌─────────────────────────────────────────────┐
│              Cloud Provider (VD: AWS/GCP)     │
│                                                │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │  Next.js   │  │  NestJS   │  │AI Worker  │ │
│  │ (Vercel    │  │ Monolith  │  │ (1 instance│ │
│  │  hoặc      │  │ (Docker,  │  │ 1-2       │ │
│  │  container)│  │ instance) │  │ hoặc job  │ │
│  │            │  │           │  │ serverless)│ │
│  └───────────┘  └─────┬─────┘  └─────┬─────┘ │
│                       │              │        │
│              ┌────────▼──────┐ ┌─────▼─────┐  │
│              │  PostgreSQL    │ │   Redis   │  │
│              │  (managed, VD: │ │ (managed) │  │
│              │  RDS/Supabase) │ │           │  │
│              └────────────────┘ └───────────┘  │
└─────────────────────────────────────────────┘
```

- **Frontend**: deploy Next.js lên Vercel (đơn giản, tối ưu SSR/CDN sẵn) hoặc container riêng nếu muốn đồng bộ hạ tầng.
- **Backend**: Docker hóa NestJS, chạy trên 1-2 instance (VD: ECS Fargate, Cloud Run, hoặc Railway/Render cho giai đoạn đầu chi phí thấp).
- **Database**: dùng managed PostgreSQL (RDS, Supabase, Neon) để tránh tự vận hành backup/failover.
- **CI/CD**: GitHub Actions — build, test, deploy tự động khi merge vào `main`.

### Khi scale lên (traffic lớn hơn)
- Tách AI Worker thành service độc lập có thể auto-scale theo độ dài queue.
- Thêm load balancer trước NestJS, scale ngang nhiều instance (vì đã stateless nhờ session lưu ở Redis).
- Cân nhắc tách riêng schema `exam-practice` hoặc `vocabulary` thành database riêng nếu một trong hai trở thành bottleneck rõ rệt — lúc này ranh giới Bounded Context đã sẵn sàng để tách mà ít rủi ro.

## 10. Testing Strategy theo từng layer

| Layer | Loại test | Công cụ |
|---|---|---|
| Domain | Unit test thuần (không mock DB) | Jest |
| Application | Unit test với mock Repository interface | Jest |
| Infrastructure | Integration test với DB thật (test container) | Jest + Testcontainers |
| Presentation | E2E test qua HTTP | Supertest (tích hợp sẵn NestJS) |

Vì Domain layer không phụ thuộc framework, đây là phần dễ đạt coverage cao nhất và ít cần thay đổi khi refactor hạ tầng.

---

*Tài liệu liên quan: xem `01-y-tuong-san-pham.md` để biết bối cảnh sản phẩm và roadmap tổng thể của Lumen.*
