import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty()
  streak: number;

  @ApiProperty({ nullable: true })
  lastActivityDate: Date | null;

  @ApiProperty()
  totalPoints: number;

  constructor(
    streak: number,
    lastActivityDate: Date | null,
    totalPoints: number,
  ) {
    this.streak = streak;
    this.lastActivityDate = lastActivityDate;
    this.totalPoints = totalPoints;
  }
}
