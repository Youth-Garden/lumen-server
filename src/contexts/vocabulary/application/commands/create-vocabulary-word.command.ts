import { CreateVocabularyWordDto } from '../dtos/create-vocabulary-word.dto';

export class CreateVocabularyWordCommand {
  constructor(public readonly dto: CreateVocabularyWordDto) {}
}
