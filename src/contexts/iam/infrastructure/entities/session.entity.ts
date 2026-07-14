import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('iam_sessions')
export class SessionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'varchar', nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
