import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateFlashcardCommand } from './create-flashcard.command';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import { FOLDER_REPOSITORY } from '../../domain/repositories/folder.repository.interface';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import { Flashcard } from '../../domain/aggregates/flashcard.aggregate';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(CreateFlashcardCommand)
export class CreateFlashcardHandler implements ICommandHandler<
  CreateFlashcardCommand,
  string
> {
  constructor(
    @Inject(FLASHCARD_REPOSITORY)
    private readonly flashcardRepo: IFlashcardRepository,
    @Inject(FOLDER_REPOSITORY)
    private readonly folderRepo: IFolderRepository,
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly wordRepo: IVocabularyWordRepository,
  ) {}

  async execute(command: CreateFlashcardCommand): Promise<string> {
    const { folderId, wordId } = command;

    const folder = await this.folderRepo.findById(folderId);
    if (!folder) {
      throw new AppException(VocabEx.FolderNotFound);
    }

    const word = await this.wordRepo.findById(wordId);
    if (!word) {
      throw new AppException(VocabEx.WordNotFound);
    }

    const existing = await this.flashcardRepo.findByFolderAndWord(
      folderId,
      wordId,
    );
    if (existing) {
      throw new AppException(VocabEx.FlashcardAlreadyExists);
    }

    const flashcard = Flashcard.create(folderId, wordId);

    await this.flashcardRepo.save(flashcard);
    return flashcard.id;
  }
}
