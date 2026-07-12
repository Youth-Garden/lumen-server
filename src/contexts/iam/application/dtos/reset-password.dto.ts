import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The reset token sent via email',
    example: 'abc123token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The new password (minimum 8 characters)',
    example: 'NewPassword123!',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;
}
