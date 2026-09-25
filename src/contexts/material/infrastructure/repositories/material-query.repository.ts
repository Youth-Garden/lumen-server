import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DictationResultDto,
  SubmitDictationDto,
} from '../../application/dtos/dictation.dto';
import type { IMaterialQueryRepository } from '../../application/ports/material-query.repository';
import {
  MaterialDto,
  MaterialListDto,
} from '../../application/responses/material.response.dto';
import { ActivityType, MaterialType } from '../../domain/enums/material.enum';
import { ActivityLogEntity } from '../entities/activity-log.entity';
import { MaterialEntity } from '../entities/material.entity';
import { TranscriptEntity } from '../entities/transcript.entity';

@Injectable()
export class MaterialQueryRepository
  extends BaseRepository<MaterialEntity>
  implements IMaterialQueryRepository
{
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepo: Repository<MaterialEntity>,
    @InjectRepository(TranscriptEntity)
    private readonly transcriptRepo: Repository<TranscriptEntity>,
    @InjectRepository(ActivityLogEntity)
    private readonly activityRepo: Repository<ActivityLogEntity>,
  ) {
    super(materialRepo);
  }

  async findAll(
    type: MaterialType | undefined,
    page: number,
    limit: number,
  ): Promise<MaterialListDto> {
    const queryBuilder = this.materialRepo.createQueryBuilder('material');

    if (type) {
      queryBuilder.andWhere('material.type = :type', { type });
    }

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);
    queryBuilder.orderBy('material.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total };
  }

  async findById(id: string): Promise<MaterialDto | null> {
    const material = await this.materialRepo.findOne({
      where: { id },
      relations: { transcripts: true },
    });

    if (!material) return null;

    material.transcripts.sort((left, right) => {
      return left.sequenceNumber - right.sequenceNumber;
    });

    return material;
  }

  async submitDictation(
    dto: SubmitDictationDto,
    userId: string,
  ): Promise<DictationResultDto | null> {
    const material = await this.materialRepo.findOne({
      where: { id: dto.materialId },
      relations: { transcripts: true },
    });

    if (!material) return null;

    let totalScore = 0;
    const results = [];

    for (const answer of dto.answers) {
      const transcript = material.transcripts.find(
        (transcriptItem) => transcriptItem.id === answer.transcriptId,
      );
      if (!transcript) continue;

      const originalText = (
        transcript.text?.en ||
        Object.values(transcript.text || {})[0] ||
        ''
      ).trim();
      const userInput = answer.userInput.trim();
      const isCorrect = originalText === userInput;
      const score = isCorrect
        ? 100
        : this.calculateSimilarity(originalText, userInput);

      totalScore += score;

      results.push({
        transcriptId: answer.transcriptId,
        userInput: answer.userInput,
        correctAnswer: originalText,
        isCorrect,
      });
    }

    const averageScore =
      results.length > 0 ? Math.round(totalScore / results.length) : 0;

    const log = this.activityRepo.create({
      userId,
      materialId: dto.materialId,
      activityType: ActivityType.DICTATION,
      score: averageScore,
    });
    await this.activityRepo.save(log);

    return {
      materialId: dto.materialId,
      score: averageScore,
      results,
    };
  }

  private calculateSimilarity(original: string, input: string): number {
    if (original === input) return 100;
    if (!original || !input) return 0;

    const originalWords = original.split(/\s+/);
    const inputWords = input.split(/\s+/);
    const maxLength = Math.max(originalWords.length, inputWords.length);
    let matches = 0;

    for (const inputWord of inputWords) {
      if (originalWords.includes(inputWord)) {
        matches++;
      }
    }

    return Math.round((matches / maxLength) * 100);
  }
}
