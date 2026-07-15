import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import type { TranslationRecord } from '../../../../shared/domain/types/translation.type';
import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { DefinitionEntity } from './definition.entity';

@Entity('vocab_examples')
export class ExampleEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  definitionId: string;

  @Column({ type: 'jsonb' })
  @Index('idx_example_sentence_jsonb')
  sentence: TranslationRecord;

  @ManyToOne(() => DefinitionEntity, (definition) => definition.examples, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'definitionId' })
  definition: DefinitionEntity;
}
