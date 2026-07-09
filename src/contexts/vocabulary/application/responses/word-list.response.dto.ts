import { VocabularyWordResponseDto } from './vocabulary-word.response.dto';

export class WordListResponseDto {
  items: VocabularyWordResponseDto[];
  total: number;
  page: number;
  limit: number;
}
