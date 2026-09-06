import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateFolderCommand } from './create-folder.command';
import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import { FOLDER_REPOSITORY } from '../../domain/repositories/folder.repository.interface';
import { Folder } from '../../domain/aggregates/folder.aggregate';

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler implements ICommandHandler<
  CreateFolderCommand,
  string
> {
  constructor(
    @Inject(FOLDER_REPOSITORY)
    private readonly repository: IFolderRepository,
  ) {}

  async execute(command: CreateFolderCommand): Promise<string> {
    const folder = Folder.create(
      command.name,
      command.description,
      command.authorId,
    );

    await this.repository.save(folder);
    return folder.id;
  }
}
