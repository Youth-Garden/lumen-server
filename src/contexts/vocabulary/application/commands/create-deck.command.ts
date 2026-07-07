import { CreateDeckDto } from '../dtos/deck-flashcard.dto';

export class CreateDeckCommand {
  constructor(
    public readonly dto: CreateDeckDto,
    public readonly authorId: string,
  ) {}
}
