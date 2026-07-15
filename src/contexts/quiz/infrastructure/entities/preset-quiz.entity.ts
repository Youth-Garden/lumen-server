import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { PresetQuestionEntity } from './preset-question.entity';

@Entity('preset_quizzes')
export class PresetQuizEntity extends BaseEntity {
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
}
