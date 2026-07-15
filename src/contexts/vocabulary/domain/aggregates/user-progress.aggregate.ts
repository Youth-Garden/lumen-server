import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { VocabEx } from '../exceptions/vocabulary.exception';
import { Card, Rating, createEmptyCard, fsrs } from 'ts-fsrs';

export class UserProgress extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _flashcardId: string,
    private _card: Card,
  ) {
    super();
  }

  static create(userId: string, flashcardId: string): UserProgress {
    return new UserProgress(
      randomUUID(),
      userId,
      flashcardId,
      createEmptyCard(),
    );
  }

  static restore(
    id: string,
    userId: string,
    flashcardId: string,
    card: Card,
  ): UserProgress {
    return new UserProgress(id, userId, flashcardId, card);
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
  get card(): Card {
    return this._card;
  }
  /**
   * Reviews the flashcard using ts-fsrs.
   * @param quality 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
   */
  review(quality: number): void {
    if (quality < 1 || quality > 4) {
      throw new AppException(VocabEx.InvalidReviewQuality);
    }

    const f = fsrs();
    const schedulingCards = f.repeat(this._card, new Date());

    let rating: Rating;
    switch (quality) {
      case 1:
        rating = Rating.Again;
        break;
      case 2:
        rating = Rating.Hard;
        break;
      case 3:
        rating = Rating.Good;
        break;
      case 4:
        rating = Rating.Easy;
        break;
      default:
        rating = Rating.Good;
    }

    const record = schedulingCards[rating];
    this._card = record.card;
  }
}
