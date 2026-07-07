import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.response.dto';

export class AuthTokensResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  constructor(
    accessToken: string,
    refreshToken: string,
    id: string,
    email: string,
    role: string,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = new UserResponseDto(id, email, role);
  }
}

export class GoogleLoginResponseDto extends AuthTokensResponseDto {}
