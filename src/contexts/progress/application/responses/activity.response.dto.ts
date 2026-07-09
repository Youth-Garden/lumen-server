import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty()
  timestamp: Date;
}
