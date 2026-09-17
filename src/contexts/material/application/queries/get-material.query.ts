import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MaterialType } from '../../domain/enums/material.enum';
import {
  MaterialDto,
  MaterialListDto,
} from '../responses/material.response.dto';
import { AppException } from '../../../../shared/domain/exceptions';
import { MaterialEx } from '../../domain/exceptions/material.exception';
import { MATERIAL_QUERY_REPOSITORY } from '../ports/material-query.repository';
import type { IMaterialQueryRepository } from '../ports/material-query.repository';

import { PaginatedQuery } from '../../../../shared/application/cqrs/paginated.query';

export class ListMaterialsQuery extends PaginatedQuery {
  constructor(
    public readonly type?: MaterialType,
    page?: number,
    limit?: number,
  ) {
    super(page, limit);
  }
}

@QueryHandler(ListMaterialsQuery)
export class ListMaterialsHandler implements IQueryHandler<
  ListMaterialsQuery,
  MaterialListDto
> {
  constructor(
    @Inject(MATERIAL_QUERY_REPOSITORY)
    private readonly materialQueryRepository: IMaterialQueryRepository,
  ) {}

  async execute(query: ListMaterialsQuery): Promise<MaterialListDto> {
    return this.materialQueryRepository.findAll(
      query.type,
      query.page,
      query.limit,
    );
  }
}

export class GetMaterialByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetMaterialByIdQuery)
export class GetMaterialByIdHandler implements IQueryHandler<
  GetMaterialByIdQuery,
  MaterialDto
> {
  constructor(
    @Inject(MATERIAL_QUERY_REPOSITORY)
    private readonly materialQueryRepository: IMaterialQueryRepository,
  ) {}

  async execute(query: GetMaterialByIdQuery): Promise<MaterialDto> {
    const material = await this.materialQueryRepository.findById(query.id);

    if (!material) {
      throw new AppException(MaterialEx.MaterialNotFound);
    }

    return material;
  }
}
