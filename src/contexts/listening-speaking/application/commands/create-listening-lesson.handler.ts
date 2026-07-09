import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateListeningLessonCommand } from './create-listening-lesson.command';
import { LISTENING_LESSON_REPOSITORY } from '../../domain/repositories/listening-lesson.repository.interface';
import type { IListeningLessonRepository } from '../../domain/repositories/listening-lesson.repository.interface';
import { ListeningLesson } from '../../domain/aggregates/listening-lesson.aggregate';

@CommandHandler(CreateListeningLessonCommand)
export class CreateListeningLessonHandler implements ICommandHandler<
  CreateListeningLessonCommand,
  string
> {
  constructor(
    @Inject(LISTENING_LESSON_REPOSITORY)
    private readonly repo: IListeningLessonRepository,
  ) {}

  async execute(command: CreateListeningLessonCommand): Promise<string> {
    const lesson = ListeningLesson.create(
      uuidv4(),
      command.title,
      command.audioUrl,
      command.cefrLevel,
      command.transcript,
    );

    await this.repo.save(lesson);
    return lesson.id;
  }
}
