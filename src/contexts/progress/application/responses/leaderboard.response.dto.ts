import { Expose } from 'class-transformer';

export class LeaderboardUserDto {
  @Expose()
  userId: string;

  @Expose()
  fullName: string | null;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  totalPoints: number;

  @Expose()
  streak: number;

  @Expose()
  unlockedBadges: string[];

  constructor(
    userId: string,
    fullName: string | null,
    avatarUrl: string | null,
    totalPoints: number,
    streak: number,
    unlockedBadges: string[],
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
    this.totalPoints = totalPoints;
    this.streak = streak;
    this.unlockedBadges = unlockedBadges;
  }
}

export class LeaderboardResponseDto {
  @Expose()
  topUsers: LeaderboardUserDto[];

  @Expose()
  currentUserRank: number | null;

  constructor(topUsers: LeaderboardUserDto[], currentUserRank: number | null) {
    this.topUsers = topUsers;
    this.currentUserRank = currentUserRank;
  }
}
