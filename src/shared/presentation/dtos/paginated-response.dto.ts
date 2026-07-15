import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'List of items in the current page',
    isArray: true,
  })
  items: T[];

  @ApiProperty({ description: 'Total number of items across all pages' })
  total: number;

  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }
}
