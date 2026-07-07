import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { CreateFlashcardCommand } from './create-flashcard.command';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { DECK_REPOSITORY } from '../../domain/repositories/deck.repository.interface';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import { Flashcard } from '../../domain/aggregates/flashcard.aggregate';
import { randomUUID } from 'crypto';

@CommandHandler(CreateFlashcardCommand)
export class CreateFlashcardHandler implements ICommandHandler<
  CreateFlashcardCommand,
  string
> {
  constructor(
    @Inject(FLASHCARD_REPOSITORY)
    private readonly flashcardRepo: IFlashcardRepository,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepo: IDeckRepository,
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly wordRepo: IVocabularyWordRepository,
  ) {}

  async execute(command: CreateFlashcardCommand): Promise<string> {
    const { deckId, wordId } = command.dto;

    const deck = await this.deckRepo.findById(deckId);
    if (!deck) throw new BadRequestException('Deck not found');

    const word = await this.wordRepo.findById(wordId);
    if (!word) throw new BadRequestException('Word not found');

    const existing = await this.flashcardRepo.findByDeckAndWord(deckId, wordId);
    if (existing)
      throw new BadRequestException('Flashcard already exists in this deck');

    const flashcardId = randomUUID();
    const flashcard = Flashcard.create(flashcardId, deckId, wordId);

    await this.flashcardRepo.save(flashcard);
    return flashcardId;
  }
}
