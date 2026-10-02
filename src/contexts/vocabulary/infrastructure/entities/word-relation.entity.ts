import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { DefinitionEntity } from './definition.entity';
import { WordEntity } from './word.entity';

export enum WordRelationType {
  SYNONYM = 'SYNONYM',
  ANTONYM = 'ANTONYM',
  RELATED = 'RELATED',
}

@Entity('vocab_word_relations')
@Index('idx_word_relation_source', ['sourceWordId'])
@Index('idx_word_relation_definition', ['definitionId'])
@Index('idx_word_relation_target_word', ['targetWordId'])
@Index('idx_word_relation_target_term', ['targetTerm'])
@Index(
  'uq_word_relation_sense',
  ['sourceWordId', 'definitionId', 'targetTerm', 'relationType'],
  {
    unique: true,
    where: '"definitionId" IS NOT NULL',
  },
)
@Index(
  'uq_word_relation_word',
  ['sourceWordId', 'targetTerm', 'relationType'],
  {
    unique: true,
    where: '"definitionId" IS NULL',
  },
)
export class WordRelationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  sourceWordId: string;

  @Column({ type: 'uuid', nullable: true })
  definitionId: string | null;

  @Column({ type: 'uuid', nullable: true })
  targetWordId: string | null;

  @Column({ type: 'varchar', length: 255 })
  targetTerm: string;

  @Column({
    type: 'enum',
    enum: WordRelationType,
    enumName: 'word_relation_type_enum',
  })
  relationType: WordRelationType;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @ManyToOne(() => WordEntity, (word) => word.relations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sourceWordId' })
  sourceWord: WordEntity;

  @ManyToOne(() => DefinitionEntity, (def) => def.relations, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'definitionId' })
  definition: DefinitionEntity | null;

  @ManyToOne(() => WordEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'targetWordId' })
  targetWord: WordEntity | null;
}
