import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { VocabEx } from '../exceptions/vocabulary.exception';

export class UserProgress extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _flashcardId: string,
    private _easeFactor: number,
    private _interval: number,
    private _repetitions: number,
    private _nextReviewDate: Date,
  ) {
    super();
  }

  static create(userId: string, flashcardId: string): UserProgress {
    return new UserProgress(
      randomUUID(),
      userId,
      flashcardId,
      2.5, // Default Ease Factor
      0, // Initial Interval
      0, // Initial Repetitions
      new Date(), // Next Review is Now
    );
  }

  static restore(
    id: string,
    userId: string,
    flashcardId: string,
    easeFactor: number,
    interval: number,
    repetitions: number,
    nextReviewDate: Date,
  ): UserProgress {
    return new UserProgress(
      id,
      userId,
      flashcardId,
      easeFactor,
      interval,
      repetitions,
      nextReviewDate,
    );
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get flashcardId(): string {
    return this._flashcardId;
  }
  get easeFactor(): number {
    return this._easeFactor;
  }
  get interval(): number {
    return this._interval;
  }
  get repetitions(): number {
    return this._repetitions;
  }
  get nextReviewDate(): Date {
    return this._nextReviewDate;
  }

  review(grade: number): void {
    if (grade < 0 || grade > 5) {
      throw new AppException(VocabEx.InvalidGrade);
    }

    if (grade >= 3) {
      this._repetitions += 1;

      if (this._repetitions === 1) {
        this._interval = 1;
      } else if (this._repetitions === 2) {
        this._interval = 6;
      } else {
        this._interval = Math.round(this._interval * this._easeFactor);
      }

      this._easeFactor =
        this._easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    } else {
      this._repetitions = 0;
      this._interval = 1;
    }

    if (this._easeFactor < 1.3) {
      this._easeFactor = 1.3;
    }

    const now = new Date();
    this._nextReviewDate = new Date(
      now.getTime() + this._interval * 24 * 60 * 60 * 1000,
    );
  }
}
