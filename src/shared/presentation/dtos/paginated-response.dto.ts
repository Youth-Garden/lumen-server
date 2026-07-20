import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty({ description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ description: 'Items per page' })
  perPage: number;

  @ApiProperty({ description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'List of items in the current page',
    isArray: true,
  })
  items: T[];

  @ApiProperty({ description: 'Pagination metadata', type: PageMetaDto })
  meta: PageMetaDto;

  constructor(
    items: T[],
    totalItems: number,
    currentPage: number = 1,
    perPage: number = 20,
  ) {
    this.items = items;
    const limit = perPage > 0 ? perPage : 20;
    const page = currentPage > 0 ? currentPage : 1;
    this.meta = {
      currentPage: page,
      perPage: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 0,
    };
  }
}
