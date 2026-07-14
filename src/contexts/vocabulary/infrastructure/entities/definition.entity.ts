import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { WordEntity } from './word.entity';
import { ExampleEntity } from './example.entity';

@Entity('vocab_definitions')
export class DefinitionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  wordId: string;

  @Column()
  partOfSpeech: string;

  @Column()
  definitionEn: string;

  @Column()
  translationVi: string;

  @ManyToOne(() => WordEntity, (word) => word.definitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wordId' })
  word: WordEntity;

  @OneToMany(() => ExampleEntity, (example) => example.definition)
  examples: ExampleEntity[];
}
