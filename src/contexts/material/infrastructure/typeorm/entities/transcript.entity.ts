import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MaterialEntity } from './material.entity';

@Entity('transcripts')
export class TranscriptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  materialId: string;

  @ManyToOne(() => MaterialEntity, (material) => material.transcripts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'materialId' })
  material: MaterialEntity;

  @Column({ type: 'int' })
  sequenceNumber: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text', nullable: true })
  translation?: string;

  @Column({ type: 'float', nullable: true })
  startTime?: number;

  @Column({ type: 'float', nullable: true })
  endTime?: number;
}
