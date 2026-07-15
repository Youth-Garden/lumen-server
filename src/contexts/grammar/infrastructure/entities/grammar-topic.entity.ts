import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { GrammarLessonEntity } from './grammar-lesson.entity';

@Entity('grammar_topics')
export class GrammarTopicEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 10 })
  cefrLevel: string;

  @OneToMany(() => GrammarLessonEntity, (lesson) => lesson.topic, {
    cascade: true,
  })
  lessons: GrammarLessonEntity[];
}
