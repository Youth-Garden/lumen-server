import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ToeicQuestionEntity } from './toeic-question.entity';

@Entity('toeic_tests')
export class ToeicTestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ToeicQuestionEntity, (q) => q.test)
  questions: ToeicQuestionEntity[];
}
