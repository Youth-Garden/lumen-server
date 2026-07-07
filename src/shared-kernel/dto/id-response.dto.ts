import { ApiProperty } from '@nestjs/swagger';

export class IdResponseDto {
  @ApiProperty()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
