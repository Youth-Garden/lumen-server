import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('iam_sessions')
@Index('idx_sessions_refresh_token', ['refreshToken'])
@Index('idx_sessions_user_id', ['userId'])
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
