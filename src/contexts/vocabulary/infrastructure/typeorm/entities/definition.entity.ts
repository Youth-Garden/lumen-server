import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { WordEntity } from './word.entity';
import { ExampleEntity } from './example.entity';

@Entity('vocab_definitions')
export class DefinitionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  wordId: string;

  @Column()
  partOfSpeech: string;

  @Column()
  definitionEn: string;

  @Column()
  translationVi: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => WordEntity, (word) => word.definitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wordId' })
  word: WordEntity;

  @OneToMany(() => ExampleEntity, (example) => example.definition)
  examples: ExampleEntity[];
}
