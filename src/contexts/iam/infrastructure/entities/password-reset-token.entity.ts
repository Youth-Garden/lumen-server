import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('iam_password_reset_tokens')
export class PasswordResetTokenEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  tokenHash: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
