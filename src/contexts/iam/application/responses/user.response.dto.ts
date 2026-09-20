import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/enums/role.enum';
import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: string;

  @ApiProperty({ required: false, nullable: true })
  fullName: string | null;

  @ApiProperty({ required: false, nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ required: false })
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
    this.fullName = user.fullName;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt;
  }
}
