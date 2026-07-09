export class DueFlashcardResponseDto {
  flashcardId: string;
  wordId: string;
  term: string;
  deckId: string;
  deckName: string;
  nextReviewDate: Date;
  easeFactor: number;
  repetitions: number;
}
