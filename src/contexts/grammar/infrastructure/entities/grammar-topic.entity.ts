import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GrammarLessonEntity } from './grammar-lesson.entity';

@Entity('grammar_topics')
export class GrammarTopicEntity {
  @PrimaryColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
