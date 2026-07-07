import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DefinitionEntity } from './definition.entity';

@Entity('vocab_examples')
export class ExampleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  definitionId: string;

  @Column()
  sentenceEn: string;

  @Column()
  translationVi: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => DefinitionEntity, (definition) => definition.examples, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'definitionId' })
  definition: DefinitionEntity;
}
