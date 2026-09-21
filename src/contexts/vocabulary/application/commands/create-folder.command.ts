import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class CreateFolderCommand {
  constructor(
    public readonly name: I18nString,
    public readonly description: I18nString | null,
    public readonly authorId: string,
  ) {}
}
