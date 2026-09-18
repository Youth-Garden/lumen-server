import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty()
  streak: number;

  @ApiProperty({ nullable: true })
  lastActivityDate: Date | null;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  dailyGoalMinutes: number;

  @ApiProperty()
  todayStudyMinutes: number;

  @ApiProperty()
  unlockedBadges: string[];

  @ApiProperty()
  streakFreezes: number;

  constructor(
    streak: number,
    lastActivityDate: Date | null,
    totalPoints: number,
    dailyGoalMinutes: number,
    todayStudyMinutes: number,
    unlockedBadges: string[],
    streakFreezes: number = 0,
  ) {
    this.streak = streak;
    this.lastActivityDate = lastActivityDate;
    this.totalPoints = totalPoints;
    this.dailyGoalMinutes = dailyGoalMinutes;
    this.todayStudyMinutes = todayStudyMinutes;
    this.unlockedBadges = unlockedBadges;
    this.streakFreezes = streakFreezes;
  }
}
