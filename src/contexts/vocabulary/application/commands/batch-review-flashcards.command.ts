import { ReviewFlashcardItemDto } from '../dtos/batch-review-flashcards.dto';

export class BatchReviewFlashcardsCommand {
  constructor(
    public readonly reviews: ReviewFlashcardItemDto[],
    public readonly userId: string,
  ) {}
}
