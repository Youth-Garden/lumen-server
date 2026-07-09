/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TypeOrmPresetQuiz } from './preset-quiz.orm-entity';
import { QuestionType } from '../../domain/enums/quiz.enum';

@Entity('preset_questions')
export class TypeOrmPresetQuestion {
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
    () => TypeOrmPresetQuiz,

    (quiz: TypeOrmPresetQuiz) => quiz.questions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'quizId' })
  quiz: TypeOrmPresetQuiz;
}
