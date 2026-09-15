import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadgeEntity } from '../../infrastructure/entities/badge.entity';
import { BadgeResponseDto } from '../responses/badge.response.dto';
import { GetAllBadgesQuery } from './get-all-badges.query';

@Injectable()
@QueryHandler(GetAllBadgesQuery)
export class GetAllBadgesHandler implements IQueryHandler<
  GetAllBadgesQuery,
  BadgeResponseDto[]
> {
  constructor(
    @InjectRepository(BadgeEntity)
    private readonly badgeRepo: Repository<BadgeEntity>,
  ) {}

  async execute(): Promise<BadgeResponseDto[]> {
    const badges = await this.badgeRepo.find();
    return badges.map(
      (badge) =>
        new BadgeResponseDto(
          badge.code,
          badge.name,
          badge.description,
          badge.icon,
        ),
    );
  }
}
