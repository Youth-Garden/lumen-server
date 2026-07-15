import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ToeicQuestionEntity } from './toeic-question.entity';

@Entity('toeic_tests')
export class ToeicTestEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(
    () => ToeicQuestionEntity,
    (question: ToeicQuestionEntity) => question.test,
  )
  questions: ToeicQuestionEntity[];
}
