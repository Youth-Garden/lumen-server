/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TypeOrmPresetQuestion } from './preset-question.orm-entity';

@Entity('preset_quizzes')
export class TypeOrmPresetQuiz {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(
    () => TypeOrmPresetQuestion,

    (question: TypeOrmPresetQuestion) => question.quiz,
    {
      cascade: true,
    },
  )
  questions: TypeOrmPresetQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
