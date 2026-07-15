import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateDeckCommand } from './update-deck.command';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { DECK_REPOSITORY } from '../../domain/repositories/deck.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(UpdateDeckCommand)
export class UpdateDeckHandler implements ICommandHandler<
  UpdateDeckCommand,
  void
> {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly repo: IDeckRepository,
  ) {}

  async execute(command: UpdateDeckCommand): Promise<void> {
    const deck = await this.repo.findById(command.deckId);
    if (!deck) {
      throw new AppException(VocabEx.DeckNotFound);
    }
    if (deck.authorId !== command.userId) {
      throw new AppException(VocabEx.NotDeckOwner);
    }

    deck.update(command.name, command.description);
    await this.repo.save(deck);
  }
}
