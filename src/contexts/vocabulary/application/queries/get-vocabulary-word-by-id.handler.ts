import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetVocabularyWordByIdQuery } from './get-vocabulary-word-by-id.query';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';
import { VocabularyWordResponseDto } from '../../application/responses/vocabulary-word.response.dto';

@QueryHandler(GetVocabularyWordByIdQuery)
export class GetVocabularyWordByIdHandler implements IQueryHandler<
  GetVocabularyWordByIdQuery,
  VocabularyWordResponseDto
> {
  constructor(
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly repository: IVocabularyWordRepository,
  ) {}

  async execute(
    query: GetVocabularyWordByIdQuery,
  ): Promise<VocabularyWordResponseDto> {
    const word = await this.repository.findById(query.id);
    if (!word) {
      throw new AppException(VocabEx.WordNotFound);
    }

    return new VocabularyWordResponseDto({
      id: word.id,
      term: word.term,
      phonetic: word.phonetic,
      audioUrl: word.audioUrl,
      cefrLevel: word.cefrLevel,
      definitions: word.definitions.map((def) => ({
        id: def.id,
        partOfSpeech: def.partOfSpeech,
        definition: def.definition,
        examples: def.examples.map((ex) => ({
          id: ex.id,
          sentence: ex.sentence,
        })),
      })),
    });
  }
}
