import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/enums/role.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;
}
