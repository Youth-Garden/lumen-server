import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteFlashcardCommand } from './delete-flashcard.command';
import type { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FLASHCARD_REPOSITORY } from '../../domain/repositories/flashcard.repository.interface';
import type { IFolderRepository } from '../../domain/repositories/folder.repository.interface';
import { FOLDER_REPOSITORY } from '../../domain/repositories/folder.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions';
import { VocabEx } from '../../domain/exceptions/vocabulary.exception';

@CommandHandler(DeleteFlashcardCommand)
export class DeleteFlashcardHandler implements ICommandHandler<
  DeleteFlashcardCommand,
  void
> {
  constructor(
    @Inject(FLASHCARD_REPOSITORY)
    private readonly repo: IFlashcardRepository,
    @Inject(FOLDER_REPOSITORY)
    private readonly folderRepo: IFolderRepository,
  ) {}

  async execute(command: DeleteFlashcardCommand): Promise<void> {
    const flashcard = await this.repo.findById(command.flashcardId);
    if (!flashcard) {
      throw new AppException(VocabEx.FlashcardNotFound);
    }

    // Verify ownership via Folder
    const folder = await this.folderRepo.findById(flashcard.folderId);
    if (!folder || folder.authorId !== command.userId) {
      throw new AppException(VocabEx.NotFolderOwner);
    }

    await this.repo.delete(flashcard.id);
  }
}
