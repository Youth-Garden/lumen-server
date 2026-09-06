import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteFolderCommand } from './delete-folder.command';
import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import { FOLDER_REPOSITORY } from '../../domain/repositories/folder.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderHandler implements ICommandHandler<
  DeleteFolderCommand,
  void
> {
  constructor(
    @Inject(FOLDER_REPOSITORY)
    private readonly repo: IFolderRepository,
  ) {}

  async execute(command: DeleteFolderCommand): Promise<void> {
    const folder = await this.repo.findById(command.folderId);
    if (!folder) {
      throw new AppException(VocabEx.FolderNotFound);
    }
    if (folder.authorId !== command.userId) {
      throw new AppException(VocabEx.NotFolderOwner);
    }
    await this.repo.delete(folder.id);
  }
}
