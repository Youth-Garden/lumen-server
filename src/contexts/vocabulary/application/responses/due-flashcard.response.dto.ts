export class DueFlashcardResponseDto {
  flashcardId: string;
  wordId: string;
  term: string;
  folderId: string;
  folderName: string;
  due: Date;
  state: number;
  reps: number;
}
