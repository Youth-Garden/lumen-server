import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteFlashcardCommand } from './delete-flashcard.command';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { DECK_REPOSITORY } from '../../domain/repositories/deck.repository.interface';
import { AppException } from '../../../../common/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(DeleteFlashcardCommand)
export class DeleteFlashcardHandler implements ICommandHandler<
  DeleteFlashcardCommand,
  void
> {
  constructor(
    @Inject(FLASHCARD_REPOSITORY)
    private readonly repo: IFlashcardRepository,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepo: IDeckRepository,
  ) {}

  async execute(command: DeleteFlashcardCommand): Promise<void> {
    const flashcard = await this.repo.findById(command.flashcardId);
    if (!flashcard) {
      throw new AppException(VocabEx.FlashcardNotFound);
    }

    // Verify ownership via Deck
    const deck = await this.deckRepo.findById(flashcard.deckId);
    if (!deck || deck.authorId !== command.userId) {
      throw new AppException(VocabEx.NotDeckOwner);
    }

    await this.repo.delete(flashcard.id);
  }
}
