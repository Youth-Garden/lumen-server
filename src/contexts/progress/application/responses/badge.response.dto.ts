import { Expose } from 'class-transformer';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class BadgeResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: I18nString;

  @Expose()
  description: I18nString;

  @Expose()
  icon: string;

  constructor(
    code: string,
    name: I18nString,
    description: I18nString,
    icon: string,
  ) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.icon = icon;
  }
}
