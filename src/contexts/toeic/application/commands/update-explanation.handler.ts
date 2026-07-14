import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToeicQuestionEntity } from '../../infrastructure/entities/toeic-question.entity';
import { NotFoundException } from '@nestjs/common';

export class UpdateExplanationCommand {
  constructor(
    public readonly questionId: string,
    public readonly explanation: string,
    public readonly mediaUrls?: string[],
  ) {}
}

@CommandHandler(UpdateExplanationCommand)
export class UpdateExplanationHandler implements ICommandHandler<
  UpdateExplanationCommand,
  void
> {
  constructor(
    @InjectRepository(ToeicQuestionEntity)
    private readonly questionRepo: Repository<ToeicQuestionEntity>,
  ) {}

  async execute(command: UpdateExplanationCommand): Promise<void> {
    const question = await this.questionRepo.findOne({
      where: { id: command.questionId },
    });

    if (!question) {
      throw new NotFoundException(
        `Question with ID ${command.questionId} not found`,
      );
    }

    question.explanation = command.explanation;
    if (command.mediaUrls !== undefined) {
      question.mediaUrls = command.mediaUrls;
    }

    await this.questionRepo.save(question);
  }
}
