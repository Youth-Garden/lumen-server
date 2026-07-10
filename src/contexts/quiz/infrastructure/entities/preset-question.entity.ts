import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PresetQuizEntity } from './preset-quiz.entity';
import { QuestionType } from '../../domain/enums/quiz.enum';

@Entity('preset_questions')
export class PresetQuestionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  quizId: string;

  @Column({ type: 'varchar', length: 50 })
  type: QuestionType;

  @Column('text')
  questionText: string;

  @Column('jsonb')
  options: string[];

  @Column('text')
  correctAnswer: string;

  @ManyToOne(
    () => PresetQuizEntity,

    (quiz: PresetQuizEntity) => quiz.questions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'quizId' })
  quiz: PresetQuizEntity;
}
