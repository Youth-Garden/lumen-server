import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MaterialEntity,
  MaterialType,
} from '../../infrastructure/typeorm/entities/material.entity';
import { MaterialDto, MaterialListDto } from '../dtos/material.response.dto';
import { NotFoundException } from '@nestjs/common';

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
    @InjectRepository(MaterialEntity)
    private readonly repo: Repository<MaterialEntity>,
  ) {}

  async execute(query: ListMaterialsQuery): Promise<MaterialListDto> {
    const { type, page, limit } = query;
    const qb = this.repo.createQueryBuilder('m');

    if (type) {
      qb.andWhere('m.type = :type', { type });
    }

    qb.skip((page - 1) * limit);
    qb.take(limit);
    qb.orderBy('m.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
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
    @InjectRepository(MaterialEntity)
    private readonly repo: Repository<MaterialEntity>,
  ) {}

  async execute(query: GetMaterialByIdQuery): Promise<MaterialDto> {
    const material = await this.repo.findOne({
      where: { id: query.id },
      relations: { transcripts: true },
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    // Sort transcripts by sequenceNumber
    material.transcripts.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    return material;
  }
}
