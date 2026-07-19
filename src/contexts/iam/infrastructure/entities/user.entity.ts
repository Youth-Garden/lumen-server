import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column } from 'typeorm';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';

@Entity('iam_users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  authProvider: AuthProvider;

  @Column({ type: 'varchar', nullable: true })
  providerId: string | null;

  @Column({ type: 'varchar', nullable: true })
  fullName: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'uuid', nullable: true })
  planId: string | null;
}
