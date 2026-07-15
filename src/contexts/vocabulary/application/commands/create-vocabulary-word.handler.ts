import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateVocabularyWordCommand } from './create-vocabulary-word.command';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VocabularyWord } from '../../domain/aggregates/vocabulary-word.aggregate';
import { VocabularyDefinition } from '../../domain/entities/vocabulary-definition.entity';
import { VocabularyExample } from '../../domain/entities/vocabulary-example.entity';
import { randomUUID } from 'crypto';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(CreateVocabularyWordCommand)
export class CreateVocabularyWordHandler implements ICommandHandler<
  CreateVocabularyWordCommand,
  string
> {
  constructor(
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly repository: IVocabularyWordRepository,
  ) {}

  async execute(command: CreateVocabularyWordCommand): Promise<string> {
    const existingWord = await this.repository.findByTerm(command.term);
    if (existingWord) {
      throw new AppException(VocabEx.WordAlreadyExists);
    }

    const definitions = command.definitions.map((defDto) => {
      const def = new VocabularyDefinition(randomUUID(), defDto.partOfSpeech, {
        en: defDto.definitionEn,
        vi: defDto.translationVi,
      });
      defDto.examples.forEach((exDto) => {
        def.addExample(
          new VocabularyExample(randomUUID(), {
            en: exDto.sentenceEn,
            vi: exDto.translationVi,
          }),
        );
      });
      return def;
    });

    const word = VocabularyWord.create(
      command.term,
      command.phonetic,
      command.audioUrl,
      command.cefrLevel,
      definitions,
    );

    await this.repository.save(word);

    return word.id;
  }
}
