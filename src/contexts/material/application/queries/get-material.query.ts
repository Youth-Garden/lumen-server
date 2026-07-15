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

export class ListMaterialsQuery {
  constructor(
    public readonly type?: MaterialType,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
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
