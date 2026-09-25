import { I18nString } from '../../../../shared/domain/types/translation.type';

export class UpdateFolderCommand {
  constructor(
    public readonly folderId: string,
    public readonly userId: string,
    public readonly name?: I18nString,
    public readonly description?: I18nString | null,
  ) {}
}
