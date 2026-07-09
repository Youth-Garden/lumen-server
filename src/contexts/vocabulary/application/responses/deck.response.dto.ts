export class DeckResponseDto {
  id: string;
  name: string;
  description: string | null;
  flashcardCount: number;
}

export class FlashcardSummaryDto {
  id: string;
  wordId: string;
  term: string;
  cefrLevel: string | null;
}

export class DeckDetailResponseDto {
  id: string;
  name: string;
  description: string | null;
  flashcards: FlashcardSummaryDto[];
}
