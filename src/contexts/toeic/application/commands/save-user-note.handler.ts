import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNoteEntity } from '../../infrastructure/entities/user-note.entity';
import { UserNoteCategory } from '../../domain/entities/user-note';

export class SaveUserNoteCommand {
  constructor(
    public readonly userId: string,
    public readonly questionId: string,
    public readonly testId: string,
    public readonly content: string,
    public readonly category: UserNoteCategory,
    public readonly tags: string[],
    public readonly quote?: string,
  ) {}
}

@CommandHandler(SaveUserNoteCommand)
export class SaveUserNoteHandler implements ICommandHandler<
  SaveUserNoteCommand,
  void
> {
  constructor(
    @InjectRepository(UserNoteEntity)
    private readonly noteRepo: Repository<UserNoteEntity>,
  ) {}

  async execute(command: SaveUserNoteCommand): Promise<void> {
    let note = await this.noteRepo.findOne({
      where: {
        userId: command.userId,
        questionId: command.questionId,
      },
    });

    if (note) {
      note.content = command.content;
      note.category = command.category;
      note.tags = command.tags;
      note.testId = command.testId;
      if (command.quote !== undefined) {
        note.quote = command.quote;
      }
    } else {
      note = this.noteRepo.create({
        userId: command.userId,
        questionId: command.questionId,
        testId: command.testId,
        content: command.content,
        category: command.category,
        tags: command.tags,
        quote: command.quote,
      });
    }

    await this.noteRepo.save(note);
  }
}
