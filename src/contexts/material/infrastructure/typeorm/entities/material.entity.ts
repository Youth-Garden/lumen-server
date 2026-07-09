import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TranscriptEntity } from './transcript.entity';
import {
  MaterialLevel,
  MaterialType,
} from '../../../domain/enums/material.enum';

@Entity('materials')
export class MaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
