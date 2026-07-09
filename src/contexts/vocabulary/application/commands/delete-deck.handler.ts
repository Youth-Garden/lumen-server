import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteDeckCommand } from './delete-deck.command';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { DECK_REPOSITORY } from '../../domain/repositories/deck.repository.interface';
import { AppException } from '../../../../common/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(DeleteDeckCommand)
export class DeleteDeckHandler implements ICommandHandler<
  DeleteDeckCommand,
  void
> {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly repo: IDeckRepository,
  ) {}

  async execute(command: DeleteDeckCommand): Promise<void> {
    const deck = await this.repo.findById(command.deckId);
    if (!deck) {
      throw new AppException(VocabEx.DeckNotFound);
    }
    if (deck.authorId !== command.userId) {
      throw new AppException(VocabEx.NotDeckOwner);
    }
    await this.repo.delete(deck.id);
  }
}
