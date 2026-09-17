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
    currentPage: number,
    perPage: number,
  ) {
    this.items = items;
    this.meta = {
      currentPage,
      perPage,
      totalItems,
      totalPages: perPage > 0 ? Math.ceil(totalItems / perPage) : 0,
    };
  }
}
