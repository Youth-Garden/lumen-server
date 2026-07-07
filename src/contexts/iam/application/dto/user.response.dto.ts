import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/enums/role.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: string;

  constructor(id: string, email: string, role: string) {
    this.id = id;
    this.email = email;
    this.role = role;
  }
}
