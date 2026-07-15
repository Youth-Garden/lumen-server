import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteVocabularyWordCommand } from './delete-vocabulary-word.command';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(DeleteVocabularyWordCommand)
export class DeleteVocabularyWordHandler implements ICommandHandler<
  DeleteVocabularyWordCommand,
  void
> {
  constructor(
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly repo: IVocabularyWordRepository,
  ) {}

  async execute(command: DeleteVocabularyWordCommand): Promise<void> {
    const word = await this.repo.findById(command.wordId);
    if (!word) {
      throw new AppException(VocabEx.WordNotFound);
    }
    await this.repo.delete(word.id);
  }
}
