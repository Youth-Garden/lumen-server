import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import type { TranslationRecord } from '../../../../shared/domain/types/translation.type';
import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { ExampleEntity } from './example.entity';
import { WordEntity } from './word.entity';

@Entity('vocab_definitions')
export class DefinitionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  wordId: string;

  @Column()
  partOfSpeech: string;

  @Column({ type: 'jsonb' })
  @Index('idx_definition_jsonb')
  definition: TranslationRecord;

  @ManyToOne(() => WordEntity, (word) => word.definitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wordId' })
  word: WordEntity;

  @OneToMany(() => ExampleEntity, (example) => example.definition)
  examples: ExampleEntity[];
}
