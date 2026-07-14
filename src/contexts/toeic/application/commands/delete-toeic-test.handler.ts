import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToeicTestEntity } from '../../infrastructure/entities/toeic-test.entity';

export class DeleteToeicTestCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteToeicTestCommand)
export class DeleteToeicTestHandler implements ICommandHandler<
  DeleteToeicTestCommand,
  void
> {
  constructor(
    @InjectRepository(ToeicTestEntity)
    private readonly testRepo: Repository<ToeicTestEntity>,
  ) {}

  async execute(command: DeleteToeicTestCommand): Promise<void> {
    await this.testRepo.delete({ id: command.id });
  }
}
