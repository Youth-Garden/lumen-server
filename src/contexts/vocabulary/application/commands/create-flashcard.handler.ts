import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateFlashcardCommand } from './create-flashcard.command';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import type { IDeckRepository } from '../../domain/repositories/deck.repository.interface';
import { DECK_REPOSITORY } from '../../domain/repositories/deck.repository.interface';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import { Flashcard } from '../../domain/aggregates/flashcard.aggregate';
import { AppException } from '../../../../common/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

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
    const { deckId, wordId } = command;

    const deck = await this.deckRepo.findById(deckId);
    if (!deck) {
      throw new AppException(VocabEx.FlashcardNotFound);
    }

    const word = await this.wordRepo.findById(wordId);
    if (!word) {
      throw new AppException(VocabEx.WordNotFound);
    }

    const existing = await this.flashcardRepo.findByDeckAndWord(deckId, wordId);
    if (existing) {
      throw new AppException(VocabEx.FlashcardAlreadyExists);
    }

    const flashcard = Flashcard.create(deckId, wordId);

    await this.flashcardRepo.save(flashcard);
    return flashcard.id;
  }
}
