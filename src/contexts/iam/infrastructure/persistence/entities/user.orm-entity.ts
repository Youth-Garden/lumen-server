import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('iam_users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

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
