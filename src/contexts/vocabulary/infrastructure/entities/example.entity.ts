import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefinitionEntity } from './definition.entity';

@Entity('vocab_examples')
export class ExampleEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  definitionId: string;

  @Column()
  sentenceEn: string;

  @Column()
  translationVi: string;

  @ManyToOne(() => DefinitionEntity, (definition) => definition.examples, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'definitionId' })
  definition: DefinitionEntity;
}
