import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateGrammarTopicCommand } from './create-grammar-topic.command';
import { GRAMMAR_TOPIC_REPOSITORY } from '../../domain/repositories/grammar-topic.repository.interface';
import type { IGrammarTopicRepository } from '../../domain/repositories/grammar-topic.repository.interface';
import { GrammarTopic } from '../../domain/aggregates/grammar-topic.aggregate';

@CommandHandler(CreateGrammarTopicCommand)
export class CreateGrammarTopicHandler implements ICommandHandler<
  CreateGrammarTopicCommand,
  string
> {
  constructor(
    @Inject(GRAMMAR_TOPIC_REPOSITORY)
    private readonly repo: IGrammarTopicRepository,
  ) {}

  async execute(command: CreateGrammarTopicCommand): Promise<string> {
    const topic = GrammarTopic.create(
      uuidv4(),
      command.title,
      command.description,
      command.cefrLevel,
    );
    await this.repo.save(topic);
    return topic.id;
  }
}
