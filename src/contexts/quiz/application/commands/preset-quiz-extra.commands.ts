import { UpdatePresetQuizDto } from '../dtos/preset-quiz.dto';

export class UpdatePresetQuizCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdatePresetQuizDto,
  ) {}
}

export class DeletePresetQuizCommand {
  constructor(public readonly id: string) {}
}
