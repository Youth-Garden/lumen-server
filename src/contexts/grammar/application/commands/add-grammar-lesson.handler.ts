import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AddGrammarLessonCommand } from './add-grammar-lesson.command';
import { GRAMMAR_TOPIC_REPOSITORY } from '../../domain/repositories/grammar-topic.repository.interface';
import type { IGrammarTopicRepository } from '../../domain/repositories/grammar-topic.repository.interface';
import { GrammarLesson } from '../../domain/entities/grammar-lesson.entity';
import { AppException } from '../../../../common/exceptions/app.exception';
import { GrammarEx } from '../../domain/exceptions/grammar.exception';

@CommandHandler(AddGrammarLessonCommand)
export class AddGrammarLessonHandler implements ICommandHandler<
  AddGrammarLessonCommand,
  string
> {
  constructor(
    @Inject(GRAMMAR_TOPIC_REPOSITORY)
    private readonly repo: IGrammarTopicRepository,
  ) {}

  async execute(command: AddGrammarLessonCommand): Promise<string> {
    const topic = await this.repo.findById(command.topicId);
    if (!topic) {
      throw new AppException(GrammarEx.TopicNotFound);
    }

    const lesson = new GrammarLesson(
      uuidv4(),
      topic.id,
      command.title,
      command.content,
      command.orderIndex,
    );

    topic.addLesson(lesson);
    await this.repo.save(topic);
    return lesson.id;
  }
}
