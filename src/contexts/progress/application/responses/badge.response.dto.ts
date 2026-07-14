import { Expose } from 'class-transformer';

export class BadgeResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  icon: string;

  constructor(code: string, name: string, description: string, icon: string) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.icon = icon;
  }
}
