import { GenerateQuizDto } from '../dtos/quiz.dto';

export class GenerateQuizCommand {
  constructor(
    public readonly dto: GenerateQuizDto,
    public readonly userId: string,
  ) {}
}
