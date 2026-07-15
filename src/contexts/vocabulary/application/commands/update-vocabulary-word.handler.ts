import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabularyDefinition } from '../../domain/entities/vocabulary-definition.entity';
import { VocabularyExample } from '../../domain/entities/vocabulary-example.entity';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import { UpdateVocabularyWordCommand } from './update-vocabulary-word.command';

@CommandHandler(UpdateVocabularyWordCommand)
export class UpdateVocabularyWordHandler implements ICommandHandler<
  UpdateVocabularyWordCommand,
  void
> {
  constructor(
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly repo: IVocabularyWordRepository,
  ) {}

  async execute(command: UpdateVocabularyWordCommand): Promise<void> {
    const word = await this.repo.findById(command.wordId);
    if (!word) {
      throw new AppException(VocabEx.WordNotFound);
    }

    if (command.term && command.term !== word.term) {
      const existing = await this.repo.findByTerm(command.term);
      if (existing) {
        throw new AppException(VocabEx.WordAlreadyExists);
      }
    }

    let definitions: VocabularyDefinition[] | undefined = undefined;
    if (command.definitions) {
      definitions = command.definitions.map((def) => {
        const definition = new VocabularyDefinition(
          randomUUID(),
          def.partOfSpeech,
          { en: def.definitionEn, vi: def.translationVi },
        );
        def.examples.forEach((ex) => {
          definition.addExample(
            new VocabularyExample(randomUUID(), {
              en: ex.sentenceEn,
              vi: ex.translationVi,
            }),
          );
        });
        return definition;
      });
    }

    word.update(
      command.term,
      command.phonetic,
      command.audioUrl,
      command.cefrLevel,
      definitions,
    );

    await this.repo.save(word);
  }
}
