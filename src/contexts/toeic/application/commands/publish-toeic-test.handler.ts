import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToeicTestEntity } from '../../infrastructure/entities/toeic-test.entity';

export class PublishToeicTestCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(PublishToeicTestCommand)
export class PublishToeicTestHandler implements ICommandHandler<
  PublishToeicTestCommand,
  void
> {
  constructor(
    @InjectRepository(ToeicTestEntity)
    private readonly testRepo: Repository<ToeicTestEntity>,
  ) {}

  async execute(command: PublishToeicTestCommand): Promise<void> {
    await this.testRepo.update({ id: command.id }, { isPublished: true });
  }
}
