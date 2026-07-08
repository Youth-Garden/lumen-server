import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TranscriptEntity } from './transcript.entity';

export enum MaterialType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
}

export enum MaterialLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

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
