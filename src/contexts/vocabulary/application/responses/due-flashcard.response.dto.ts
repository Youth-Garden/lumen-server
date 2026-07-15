export class DueFlashcardResponseDto {
  flashcardId: string;
  wordId: string;
  term: string;
  deckId: string;
  deckName: string;
  due: Date;
  state: number;
  reps: number;
}
