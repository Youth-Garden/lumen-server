import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateSpeakingTaskCommand } from './create-speaking-task.command';
import { SPEAKING_TASK_REPOSITORY } from '../../domain/repositories/speaking-task.repository.interface';
import type { ISpeakingTaskRepository } from '../../domain/repositories/speaking-task.repository.interface';
import { SpeakingTask } from '../../domain/aggregates/speaking-task.aggregate';

@CommandHandler(CreateSpeakingTaskCommand)
export class CreateSpeakingTaskHandler implements ICommandHandler<
  CreateSpeakingTaskCommand,
  string
> {
  constructor(
    @Inject(SPEAKING_TASK_REPOSITORY)
    private readonly repo: ISpeakingTaskRepository,
  ) {}

  async execute(command: CreateSpeakingTaskCommand): Promise<string> {
    const task = SpeakingTask.create(
      uuidv4(),
      command.title,
      command.prompt,
      command.referenceAudioUrl,
      command.keywords,
    );

    await this.repo.save(task);
    return task.id;
  }
}
