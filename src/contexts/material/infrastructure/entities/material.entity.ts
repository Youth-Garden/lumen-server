import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { TranscriptEntity } from './transcript.entity';
import { MaterialLevel, MaterialType } from '../../domain/enums/material.enum';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('materials')
export class MaterialEntity extends BaseEntity {
  @Column({ type: 'jsonb', default: {} })
  title: I18nString;

  @Column({ type: 'jsonb', nullable: true })
  description?: I18nString | null;

  @Column({ type: 'enum', enum: MaterialType })
  type: MaterialType;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  mediaUrl?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'enum', enum: MaterialLevel, nullable: true })
  level?: MaterialLevel;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ type: 'int', nullable: true, comment: 'Duration in seconds' })
  duration?: number;

  @OneToMany(() => TranscriptEntity, (transcript) => transcript.material)
  transcripts: TranscriptEntity[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;
}
