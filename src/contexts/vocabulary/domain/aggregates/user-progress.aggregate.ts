import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

export class UserProgress extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _flashcardId: string,
    private _masteryScore: number,
    private _level: number,
    private _isWilted: boolean,
    private _learningStep: number,
    private _reviewCountAtCurrentLevel: number,
    private _intervalDays: number,
    private _lastReviewedAt: Date | null,
    private _nextReviewAt: Date | null,
  ) {
    super();
  }

  static create(userId: string, flashcardId: string): UserProgress {
    return new UserProgress(
      randomUUID(),
      userId,
      flashcardId,
      0, // masteryScore
      0, // level
      false, // isWilted
      0, // learningStep
      0, // reviewCountAtCurrentLevel
      0, // intervalDays
      null, // lastReviewedAt
      null, // nextReviewAt
    );
  }

  static restore(
    id: string,
    userId: string,
    flashcardId: string,
    masteryScore: number,
    level: number,
    isWilted: boolean,
    learningStep: number,
    reviewCountAtCurrentLevel: number,
    intervalDays: number,
    lastReviewedAt: Date | null,
    nextReviewAt: Date | null,
  ): UserProgress {
    return new UserProgress(
      id,
      userId,
      flashcardId,
      masteryScore,
      level,
      isWilted,
      learningStep,
      reviewCountAtCurrentLevel,
      intervalDays,
      lastReviewedAt,
      nextReviewAt,
    );
  }

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get flashcardId(): string { return this._flashcardId; }
  get masteryScore(): number { return this._masteryScore; }
  get level(): number { return this._level; }
  get isWilted(): boolean { return this._isWilted; }
  get learningStep(): number { return this._learningStep; }
  get reviewCountAtCurrentLevel(): number { return this._reviewCountAtCurrentLevel; }
  get intervalDays(): number { return this._intervalDays; }
  get lastReviewedAt(): Date | null { return this._lastReviewedAt; }
  get nextReviewAt(): Date | null { return this._nextReviewAt; }

  private addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }

  private addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  checkAndSetWilted(): void {
    if (this._nextReviewAt && new Date() >= this._nextReviewAt) {
      this._isWilted = true;
    }
  }

  reviewCorrect(isFastTrackKnown = false, isFastTrackTempMemory = false): void {
    this._lastReviewedAt = new Date();
    this._isWilted = false;

    if (isFastTrackKnown) {
      this._level = 5;
      this._masteryScore = 100;
      this._intervalDays = 30;
      this._nextReviewAt = this.addDays(this._lastReviewedAt, 30);
      return;
    }

    if (isFastTrackTempMemory) {
      this._level = 2;
      this._masteryScore = 40;
      this._intervalDays = 1;
      this._nextReviewAt = this.addDays(this._lastReviewedAt, 1);
      return;
    }

    if (this._level === 0) {
      this._learningStep += 1;
      this._masteryScore = Math.min(20, this._learningStep * (20 / 6));
      if (this._learningStep >= 6) {
        this._level = 1;
        this._masteryScore = 20;
        this._intervalDays = 0.16; // 4 hours approximately
        this._reviewCountAtCurrentLevel = 0;
        this._nextReviewAt = this.addHours(this._lastReviewedAt, 4);
      }
      return;
    }

    this._reviewCountAtCurrentLevel += 1;

    if (this._level === 1 && this._reviewCountAtCurrentLevel >= 2) {
      this._level = 2;
      this._masteryScore = 40;
      this._intervalDays = 1;
      this._reviewCountAtCurrentLevel = 0;
      this._nextReviewAt = this.addDays(this._lastReviewedAt, 1);
      return;
    }

    if (this._level === 2 && this._reviewCountAtCurrentLevel >= 2) {
      this._level = 3;
      this._masteryScore = 60;
      this._intervalDays = 3;
      this._reviewCountAtCurrentLevel = 0;
      this._nextReviewAt = this.addDays(this._lastReviewedAt, 3);
      return;
    }

    if (this._level === 3 && this._reviewCountAtCurrentLevel >= 1) {
      this._level = 4;
      this._masteryScore = 80;
      this._intervalDays = 7;
      this._reviewCountAtCurrentLevel = 0;
      this._nextReviewAt = this.addDays(this._lastReviewedAt, 7);
      return;
    }

    if (this._level === 4 && this._reviewCountAtCurrentLevel >= 1) {
      this._level = 5;
      this._masteryScore = 100;
      this._intervalDays = 30;
      this._reviewCountAtCurrentLevel = 0;
      this._nextReviewAt = this.addDays(this._lastReviewedAt, 30);
      return;
    }

    if (this._level === 5) {
      this._intervalDays = Math.min(180, this._intervalDays * 2);
      this._nextReviewAt = this.addDays(this._lastReviewedAt, this._intervalDays);
      return;
    }
  }

  reviewWrong(): void {
    this._lastReviewedAt = new Date();
    
    // Always decrease mastery by 20% but keep at least 0
    this._masteryScore = Math.max(0, this._masteryScore - 20);
    this._level = Math.floor(this._masteryScore / 20);
    
    this._intervalDays = 0.16;
    this._reviewCountAtCurrentLevel = 0;
    this._nextReviewAt = this.addHours(this._lastReviewedAt, 4);
  }
}
