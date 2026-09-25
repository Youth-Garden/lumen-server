import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MaterialEntity } from './material.entity';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('transcripts')
export class TranscriptEntity extends BaseEntity {
  @Column()
  materialId: string;

  @ManyToOne(() => MaterialEntity, (material) => material.transcripts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'materialId' })
  material: MaterialEntity;

  @Column({ type: 'int' })
  sequenceNumber: number;

  @Column({ type: 'jsonb', default: {} })
  text: I18nString;

  @Column({ type: 'float', nullable: true })
  startTime?: number;

  @Column({ type: 'float', nullable: true })
  endTime?: number;
}
