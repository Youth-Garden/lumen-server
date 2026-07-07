import { ReviewFlashcardDto } from '../dtos/review-flashcard.dto';

export class ReviewFlashcardCommand {
  constructor(
    public readonly dto: ReviewFlashcardDto,
    public readonly userId: string,
  ) {}
}
