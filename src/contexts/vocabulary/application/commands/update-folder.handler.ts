import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';
import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import { FOLDER_REPOSITORY } from '../../domain/repositories/folder.repository.interface';
import { UpdateFolderCommand } from './update-folder.command';

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderHandler implements ICommandHandler<
  UpdateFolderCommand,
  void
> {
  constructor(
    @Inject(FOLDER_REPOSITORY)
    private readonly repo: IFolderRepository,
  ) {}

  async execute(command: UpdateFolderCommand): Promise<void> {
    const folder = await this.repo.findById(command.folderId);
    if (!folder) {
      throw new AppException(VocabEx.FolderNotFound);
    }
    if (folder.authorId !== command.userId) {
      throw new AppException(VocabEx.NotFolderOwner);
    }

    folder.update(command.name, command.description);
    await this.repo.save(folder);
  }
}
