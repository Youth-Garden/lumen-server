import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import {
  LEVEL_PROMOTION_RULES,
  SRS_CONFIG,
} from '../constants/user-progress.constants';

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
      SRS_CONFIG.MIN_MASTERY_SCORE,
      0,
      false,
      0,
      0,
      0,
      null,
      null,
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

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get flashcardId(): string {
    return this._flashcardId;
  }
  get masteryScore(): number {
    return this._masteryScore;
  }
  get level(): number {
    return this._level;
  }
  get isWilted(): boolean {
    return this._isWilted;
  }
  get learningStep(): number {
    return this._learningStep;
  }
  get reviewCountAtCurrentLevel(): number {
    return this._reviewCountAtCurrentLevel;
  }
  get intervalDays(): number {
    return this._intervalDays;
  }
  get lastReviewedAt(): Date | null {
    return this._lastReviewedAt;
  }
  get nextReviewAt(): Date | null {
    return this._nextReviewAt;
  }

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
      this.applyFastTrack(SRS_CONFIG.FAST_TRACK.KNOWN);
      return;
    }

    if (isFastTrackTempMemory) {
      this.applyFastTrack(SRS_CONFIG.FAST_TRACK.TEMP_MEMORY);
      return;
    }

    switch (this._level) {
      case 0:
        this.progressLearningStep();
        break;
      case 1:
      case 2:
      case 3:
      case 4:
        this.progressGraduation(this._level);
        break;
      case 5:
        this.progressMasteredReview();
        break;
      default:
        break;
    }
  }

  reviewWrong(): void {
    this._lastReviewedAt = new Date();

    this._masteryScore = Math.max(
      SRS_CONFIG.MIN_MASTERY_SCORE,
      this._masteryScore - SRS_CONFIG.WRONG_ANSWER_SCORE_PENALTY,
    );
    this._level = Math.floor(this._masteryScore / SRS_CONFIG.SCORE_PER_LEVEL);

    this._intervalDays = SRS_CONFIG.DEFAULT_HOURLY_INTERVAL_DAYS;
    this._reviewCountAtCurrentLevel = 0;
    this._nextReviewAt = this.addHours(
      this._lastReviewedAt,
      SRS_CONFIG.DEFAULT_REVIEW_INTERVAL_HOURS,
    );
  }

  private applyFastTrack(target: {
    readonly level: number;
    readonly masteryScore: number;
    readonly intervalDays: number;
  }): void {
    this._level = target.level;
    this._masteryScore = target.masteryScore;
    this._intervalDays = target.intervalDays;
    this._nextReviewAt = this.addDays(
      this._lastReviewedAt!,
      target.intervalDays,
    );
  }

  private progressLearningStep(): void {
    this._learningStep += 1;
    const scorePerStep =
      SRS_CONFIG.LEVEL_0_MAX_MASTERY_SCORE /
      SRS_CONFIG.LEARNING_STEPS_TO_GRADUATE;
    this._masteryScore = Math.min(
      SRS_CONFIG.LEVEL_0_MAX_MASTERY_SCORE,
      this._learningStep * scorePerStep,
    );

    if (this._learningStep >= SRS_CONFIG.LEARNING_STEPS_TO_GRADUATE) {
      this._level = 1;
      this._masteryScore = SRS_CONFIG.LEVEL_0_MAX_MASTERY_SCORE;
      this._intervalDays = SRS_CONFIG.DEFAULT_HOURLY_INTERVAL_DAYS;
      this._reviewCountAtCurrentLevel = 0;
      this._nextReviewAt = this.addHours(
        this._lastReviewedAt!,
        SRS_CONFIG.DEFAULT_REVIEW_INTERVAL_HOURS,
      );
    }
  }

  private progressGraduation(currentLevel: number): void {
    this._reviewCountAtCurrentLevel += 1;
    const rule = LEVEL_PROMOTION_RULES[currentLevel];

    if (rule && this._reviewCountAtCurrentLevel >= rule.requiredReviews) {
      this._level = rule.nextLevel;
      this._masteryScore = rule.nextMasteryScore;
      this._intervalDays = rule.nextIntervalDays;
      this._reviewCountAtCurrentLevel = 0;
      this._nextReviewAt = this.addDays(
        this._lastReviewedAt!,
        rule.nextIntervalDays,
      );
    }
  }

  private progressMasteredReview(): void {
    this._intervalDays = Math.min(
      SRS_CONFIG.MAX_INTERVAL_DAYS,
      this._intervalDays * SRS_CONFIG.LEVEL_5_INTERVAL_MULTIPLIER,
    );
    this._nextReviewAt = this.addDays(
      this._lastReviewedAt!,
      this._intervalDays,
    );
  }
}
