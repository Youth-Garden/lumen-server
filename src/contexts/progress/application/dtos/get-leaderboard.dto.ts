import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../shared/presentation/dtos/pagination.dto';
import { LeaderboardPeriodEnum } from '../../domain/enums/progress.enum';

export class GetLeaderboardDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: LeaderboardPeriodEnum,
    description: 'Leaderboard timeframe period',
    default: LeaderboardPeriodEnum.ALL_TIME,
  })
  @IsOptional()
  @IsEnum(LeaderboardPeriodEnum)
  period: LeaderboardPeriodEnum = LeaderboardPeriodEnum.ALL_TIME;
}
