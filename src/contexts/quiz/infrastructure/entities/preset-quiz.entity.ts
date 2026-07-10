import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PresetQuestionEntity } from './preset-question.entity';

@Entity('preset_quizzes')
export class PresetQuizEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(
    () => PresetQuestionEntity,

    (question: PresetQuestionEntity) => question.quiz,
    {
      cascade: true,
    },
  )
  questions: PresetQuestionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
