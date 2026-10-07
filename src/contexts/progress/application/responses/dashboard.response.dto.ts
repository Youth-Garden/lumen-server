import { ApiProperty } from '@nestjs/swagger';

export class DailyGoalHistoryItemDto {
  @ApiProperty()
  targetMinutes: number;

  @ApiProperty()
  effectiveFrom: string;

  @ApiProperty({ nullable: true })
  effectiveTo: string | null;
}

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

  @ApiProperty({ type: [String] })
  frozenDates: string[];

  @ApiProperty({ type: [DailyGoalHistoryItemDto] })
  goalHistories: DailyGoalHistoryItemDto[];

  constructor(
    streak: number,
    lastActivityDate: Date | null,
    totalPoints: number,
    dailyGoalMinutes: number,
    todayStudyMinutes: number,
    unlockedBadges: string[],
    streakFreezes: number = 0,
    goalHistories: DailyGoalHistoryItemDto[] = [],
    frozenDates: string[] = [],
  ) {
    this.streak = streak;
    this.lastActivityDate = lastActivityDate;
    this.totalPoints = totalPoints;
    this.dailyGoalMinutes = dailyGoalMinutes;
    this.todayStudyMinutes = todayStudyMinutes;
    this.unlockedBadges = unlockedBadges;
    this.streakFreezes = streakFreezes;
    this.goalHistories = goalHistories;
    this.frozenDates = frozenDates;
  }
}
