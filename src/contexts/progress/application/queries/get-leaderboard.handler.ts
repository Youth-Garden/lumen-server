import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import {
  LeaderboardResponseDto,
  LeaderboardUserDto,
} from '../responses/leaderboard.response.dto';
import { GetLeaderboardQuery } from './get-leaderboard.query';

interface RawLeaderboardRow {
  userId: string;
  totalPoints: number | string;
  streak: number | string;
  unlockedBadges: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

@Injectable()
@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler<
  GetLeaderboardQuery,
  LeaderboardResponseDto
> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(query: GetLeaderboardQuery): Promise<LeaderboardResponseDto> {
    const limit = query.limit || 50;

    // Use QueryBuilder to join learning_profiles and iam_users
    // We sort by totalPoints DESC
    const rawResults: RawLeaderboardRow[] = await this.dataSource.query(
      `
      SELECT 
        lp."userId" AS "userId",
        lp."totalPoints" AS "totalPoints",
        lp."streak" AS "streak",
        lp."unlockedBadges" AS "unlockedBadges",
        u."fullName" AS "fullName",
        u."avatarUrl" AS "avatarUrl"
      FROM learning_profiles lp
      JOIN iam_users u ON lp."userId" = u.id
      ORDER BY lp."totalPoints" DESC, lp.streak DESC
      LIMIT $1
    `,
      [limit],
    );

    const topUsers: LeaderboardUserDto[] = rawResults.map((row) => {
      let badges: string[] = [];
      if (row.unlockedBadges) {
        badges = String(row.unlockedBadges).split(',');
      }

      return new LeaderboardUserDto(
        row.userId,
        row.fullName,
        row.avatarUrl,
        Number(row.totalPoints) || 0,
        Number(row.streak) || 0,
        badges,
      );
    });

    // For now, currentUserRank is not calculated to save DB performance,
    // it can be calculated on the client side if the user is in the top 50
    return new LeaderboardResponseDto(topUsers, null);
  }
}
