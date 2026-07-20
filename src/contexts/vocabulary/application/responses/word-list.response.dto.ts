import { VocabularyWordResponseDto } from './vocabulary-word.response.dto';
import { PaginatedResponseDto } from '../../../../shared/presentation/dtos/paginated-response.dto';

export class WordListResponseDto extends PaginatedResponseDto<VocabularyWordResponseDto> {}
