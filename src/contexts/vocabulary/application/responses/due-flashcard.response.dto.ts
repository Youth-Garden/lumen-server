export class DueFlashcardResponseDto {
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
}
