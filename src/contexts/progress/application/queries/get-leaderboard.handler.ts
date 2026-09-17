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
  userRank: number | string;
}

@Injectable()
@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler<
  GetLeaderboardQuery,
  LeaderboardResponseDto
> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(query: GetLeaderboardQuery): Promise<LeaderboardResponseDto> {
    const limit = query.limit;

    const rawResults: RawLeaderboardRow[] = await this.dataSource.query(
      `
      WITH ranked_users AS (
        SELECT 
          lp."userId" AS "userId",
          lp."totalPoints" AS "totalPoints",
          lp."streak" AS "streak",
          lp."unlockedBadges" AS "unlockedBadges",
          u."fullName" AS "fullName",
          u."avatarUrl" AS "avatarUrl",
          RANK() OVER (ORDER BY lp."totalPoints" DESC, lp.streak DESC) AS "userRank"
        FROM learning_profiles lp
        JOIN iam_users u ON lp."userId" = u.id
      )
      SELECT * FROM ranked_users
      ORDER BY "userRank" ASC
      LIMIT $1
    `,
      [limit],
    );

    let currentUserRank: number | null = null;

    if (query.userId) {
      const foundInTop = rawResults.find((row) => row.userId === query.userId);
      if (foundInTop) {
        currentUserRank = Number(foundInTop.userRank);
      } else {
        const userProfile: { totalPoints: number; streak: number }[] =
          await this.dataSource.query(
            `SELECT "totalPoints", "streak" FROM learning_profiles WHERE "userId" = $1`,
            [query.userId],
          );

        if (userProfile.length > 0) {
          const { totalPoints, streak } = userProfile[0];
          const rankResult: { userRank: number | string }[] =
            await this.dataSource.query(
              `
              SELECT (COUNT(*)::int + 1) AS "userRank"
              FROM learning_profiles
              WHERE "totalPoints" > $1 OR ("totalPoints" = $1 AND "streak" > $2)
            `,
              [totalPoints, streak],
            );
          if (rankResult.length > 0) {
            currentUserRank = Number(rankResult[0].userRank);
          }
        }
      }
    }

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

    return new LeaderboardResponseDto(topUsers, currentUserRank);
  }
}
