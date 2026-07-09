import { CreatePresetQuizDto } from '../dtos/preset-quiz.dto';

export class CreatePresetQuizCommand {
  constructor(public readonly dto: CreatePresetQuizDto) {}
}
