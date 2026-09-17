import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreatedEntityResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the newly created entity',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @Expose()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
