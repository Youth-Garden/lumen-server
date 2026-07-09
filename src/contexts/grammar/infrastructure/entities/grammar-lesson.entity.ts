import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GrammarTopicEntity } from './grammar-topic.entity';

@Entity('grammar_lessons')
export class GrammarLessonEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  topicId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @ManyToOne(() => GrammarTopicEntity, (topic) => topic.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topicId' })
  topic: GrammarTopicEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
