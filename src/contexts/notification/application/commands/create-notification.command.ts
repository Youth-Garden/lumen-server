import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class CreateNotificationCommand {
  constructor(
    public readonly userId: string,
    public readonly title: I18nString,
    public readonly description: I18nString,
  ) {}
}
