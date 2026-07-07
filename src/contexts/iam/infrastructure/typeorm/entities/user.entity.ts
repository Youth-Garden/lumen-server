import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('iam_users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string | null;

  @Column({ default: 'LOCAL' })
  authProvider: string;

  @Column({ nullable: true })
  providerId: string | null;

  @Column({ nullable: true })
  fullName: string | null;

  @Column({ nullable: true })
  avatarUrl: string | null;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ default: 'USER' })
  role: string;

  @Column({ type: 'uuid', nullable: true })
  planId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
