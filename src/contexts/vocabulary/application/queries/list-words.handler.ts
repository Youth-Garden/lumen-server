import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListWordsQuery } from './list-words.query';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VocabularyWordResponseDto } from '../responses/vocabulary-word.response.dto';
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
      items: items.map((word) => new VocabularyWordResponseDto(word)),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
