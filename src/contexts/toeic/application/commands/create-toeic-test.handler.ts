import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ToeicTestEntity } from '../../infrastructure/entities/toeic-test.entity';

export class CreateToeicTestCommand {
  constructor(
    public readonly title: string,
    public readonly description?: string,
    public readonly isPublished?: boolean,
  ) {}
}

@CommandHandler(CreateToeicTestCommand)
export class CreateToeicTestHandler implements ICommandHandler<
  CreateToeicTestCommand,
  string
> {
  constructor(
    @InjectRepository(ToeicTestEntity)
    private readonly testRepo: Repository<ToeicTestEntity>,
  ) {}

  async execute(command: CreateToeicTestCommand): Promise<string> {
    const test = this.testRepo.create({
      id: randomUUID(),
      title: command.title,
      description: command.description,
      isPublished: command.isPublished ?? false,
    });

    const saved = await this.testRepo.save(test);
    return saved.id;
  }
}
