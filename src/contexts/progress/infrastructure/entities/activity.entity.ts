import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('activities')
export class ActivityEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar')
  type: string;

  @Column('varchar')
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  xpEarned: number;

  @CreateDateColumn()
  timestamp: Date;
}
