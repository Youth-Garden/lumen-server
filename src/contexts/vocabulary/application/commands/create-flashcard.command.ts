import { CreateFlashcardDto } from '../dtos/deck-flashcard.dto';

export class CreateFlashcardCommand {
  constructor(public readonly dto: CreateFlashcardDto) {}
}
