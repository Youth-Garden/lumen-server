export class DueWordDefinitionDto {
  id: string;
  partOfSpeech: string;
  definition: Record<string, string>;
  examples?: Array<{
    id: string;
    sentence: Record<string, string>;
  }>;
}

export class DueWordResponseDto {
  flashcardId: string;
  wordId: string;
  term: string;
  folderId: string;
  folderName: Record<string, string> | string;

  masteryScore: number;
  level: number;
  isWilted: boolean;
  learningStep: number;
  reviewCountAtCurrentLevel: number;
  intervalDays: number;
  nextReviewAt: Date | null;

  phonetic?: string | null;
  phoneticUs?: string | null;
  phoneticUk?: string | null;
  audioUrl?: string | null;
  audioUsUrl?: string | null;
  audioUkUrl?: string | null;
  imageUrl?: string | null;
  definitions?: DueWordDefinitionDto[];
}
