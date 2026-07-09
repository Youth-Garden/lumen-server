import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeechRecordEntity } from '../entities/speech-record.entity';
import { ISpeechRecordRepository } from '../../domain/repositories/speech-record.repository.interface';
import { SpeechRecord } from '../../domain/entities/speech-record.entity';

@Injectable()
export class SpeechRecordRepository implements ISpeechRecordRepository {
  constructor(
    @InjectRepository(SpeechRecordEntity)
    private readonly repository: Repository<SpeechRecordEntity>,
  ) {}

  async findById(id: string): Promise<SpeechRecord | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByUserId(userId: string): Promise<SpeechRecord[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(record: SpeechRecord): Promise<void> {
    const entity = this.toPersistence(record);
    await this.repository.save(entity);
  }

  private toDomain(entity: SpeechRecordEntity): SpeechRecord {
    return new SpeechRecord(
      entity.id,
      entity.userId,
      entity.speakingTaskId,
      entity.audioUrl,
      entity.accuracyScore,
      entity.feedback,
    );
  }

  private toPersistence(domain: SpeechRecord): SpeechRecordEntity {
    const entity = new SpeechRecordEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.speakingTaskId = domain.speakingTaskId;
    entity.audioUrl = domain.audioUrl;
    entity.accuracyScore = domain.accuracyScore;
    entity.feedback = domain.feedback;
    return entity;
  }
}
