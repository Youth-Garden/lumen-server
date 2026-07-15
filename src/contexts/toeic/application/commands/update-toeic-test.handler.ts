import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ToeicEx } from '../../domain/exceptions/toeic.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ToeicQuestionEntity } from '../../infrastructure/entities/toeic-question.entity';
import { ToeicTestEntity } from '../../infrastructure/entities/toeic-test.entity';
import { UpdateToeicQuestionDto } from '../../presentation/http/dto/update-toeic-test.dto';

export class UpdateToeicTestCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly isPublished?: boolean,
    public readonly questions?: UpdateToeicQuestionDto[],
  ) {}
}

@CommandHandler(UpdateToeicTestCommand)
export class UpdateToeicTestHandler implements ICommandHandler<
  UpdateToeicTestCommand,
  void
> {
  constructor(
    @InjectRepository(ToeicTestEntity)
    private readonly testRepo: Repository<ToeicTestEntity>,
    @InjectRepository(ToeicQuestionEntity)
    private readonly questionRepo: Repository<ToeicQuestionEntity>,
  ) {}

  async execute(command: UpdateToeicTestCommand): Promise<void> {
    const test = await this.testRepo.findOne({
      where: { id: command.id },
      relations: { questions: true },
    });

    if (!test) {
      throw new AppException(ToeicEx.TestNotFound);
    }

    if (command.title !== undefined) test.title = command.title;
    if (command.description !== undefined)
      test.description = command.description;
    if (command.isPublished !== undefined)
      test.isPublished = command.isPublished;

    await this.testRepo.save(test);

    if (command.questions) {
      // Process question upserts and deletions
      const existingIds = test.questions.map((q) => q.id);
      const incomingIds = command.questions.map((q) => q.id).filter(Boolean);

      const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
      if (toDelete.length > 0) {
        await this.questionRepo.delete(toDelete);
      }

      const toSave = command.questions.map((q) => {
        return this.questionRepo.create({
          id: q.id || randomUUID(),
          testId: test.id,
          part: q.part,
          questionNumber: q.questionNumber,
          audioUrl: q.audioUrl,
          imageUrl: q.imageUrl,
          transcript: q.transcript,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation:
            q.explanation || q.translation
              ? { en: q.explanation, vi: q.translation }
              : undefined,
          topic: q.topic,
        });
      });

      if (toSave.length > 0) {
        await this.questionRepo.save(toSave);
      }
    }
  }
}
