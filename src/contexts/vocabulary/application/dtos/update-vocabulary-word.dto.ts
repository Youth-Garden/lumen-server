import { PartialType } from '@nestjs/swagger';
import { CreateVocabularyWordDto } from './create-vocabulary-word.dto';

export class UpdateVocabularyWordDto extends PartialType(
  CreateVocabularyWordDto,
) {}
