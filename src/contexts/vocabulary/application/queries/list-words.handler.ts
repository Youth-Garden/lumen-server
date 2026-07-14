import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListWordsQuery } from './list-words.query';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import {
  VocabularyWordResponseDto,
  VocabularyDefinitionResponseDto,
  VocabularyExampleResponseDto,
} from '../responses/vocabulary-word.response.dto';
import { WordListResponseDto } from '../responses/word-list.response.dto';

@QueryHandler(ListWordsQuery)
export class ListWordsHandler implements IQueryHandler<
  ListWordsQuery,
  WordListResponseDto
> {
  constructor(
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly repository: IVocabularyWordRepository,
  ) {}

  async execute(query: ListWordsQuery): Promise<WordListResponseDto> {
    const { items, total } = await this.repository.findAll({
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      cefrLevel: query.cefrLevel,
      partOfSpeech: query.partOfSpeech,
      page: query.page,
      limit: query.limit,
    });

    return {
      items: items.map(
        (word) =>
          new VocabularyWordResponseDto({
            id: word.id,
            term: word.term,
            phonetic: word.phonetic,
            audioUrl: word.audioUrl,
            cefrLevel: word.cefrLevel,
            definitions: word.definitions.map(
              (def) =>
                new VocabularyDefinitionResponseDto({
                  id: def.id,
                  partOfSpeech: def.partOfSpeech,
                  definitionEn: def.definitionEn,
                  translationVi: def.translationVi,
                  examples: def.examples.map(
                    (ex) =>
                      new VocabularyExampleResponseDto({
                        id: ex.id,
                        sentenceEn: ex.sentenceEn,
                        translationVi: ex.translationVi,
                      }),
                  ),
                }),
            ),
          }),
      ),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
