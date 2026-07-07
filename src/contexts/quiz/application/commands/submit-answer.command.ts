import { SubmitAnswerDto } from '../dtos/quiz.dto';

export class SubmitAnswerCommand {
  constructor(
    public readonly quizId: string,
    public readonly questionId: string,
    public readonly dto: SubmitAnswerDto,
    public readonly userId: string,
  ) {}
}
