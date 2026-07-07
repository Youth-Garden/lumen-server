import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateDeckCommand } from './create-deck.command';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { DECK_REPOSITORY } from '../../domain/repositories/deck.repository.interface';
import { Deck } from '../../domain/aggregates/deck.aggregate';
import { randomUUID } from 'crypto';

@CommandHandler(CreateDeckCommand)
export class CreateDeckHandler implements ICommandHandler<
  CreateDeckCommand,
  string
> {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly repository: IDeckRepository,
  ) {}

  async execute(command: CreateDeckCommand): Promise<string> {
    const { dto, authorId } = command;
    const deckId = randomUUID();

    const deck = Deck.create(deckId, dto.name, dto.description, authorId);

    await this.repository.save(deck);
    return deckId;
  }
}
