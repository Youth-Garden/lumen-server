import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranscriptEntity } from '../../infrastructure/typeorm/entities/transcript.entity';
import {
  ActivityLogEntity,
  ActivityType,
} from '../../infrastructure/typeorm/entities/activity-log.entity';
import { SubmitDictationDto, DictationResultDto } from '../dtos/dictation.dto';
import { NotFoundException } from '@nestjs/common';

export class SubmitDictationCommand {
  constructor(
    public readonly dto: SubmitDictationDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(SubmitDictationCommand)
export class SubmitDictationHandler implements ICommandHandler<
  SubmitDictationCommand,
  DictationResultDto
> {
  constructor(
    @InjectRepository(TranscriptEntity)
    private readonly transcriptRepo: Repository<TranscriptEntity>,
    @InjectRepository(ActivityLogEntity)
    private readonly activityRepo: Repository<ActivityLogEntity>,
  ) {}

  async execute(command: SubmitDictationCommand): Promise<DictationResultDto> {
    const { dto, userId } = command;

    const transcript = await this.transcriptRepo.findOne({
      where: { id: dto.transcriptId },
      relations: { material: true }, // Need to know which material it belongs to
    });

    if (!transcript) {
      throw new NotFoundException('Transcript not found');
    }

    const originalText = transcript.text.trim();
    const userInput = dto.userInput.trim();

    // Exact match (case and punctuation sensitive as requested)
    const isCorrect = originalText === userInput;
    const score = isCorrect
      ? 100
      : this.calculateSimilarity(originalText, userInput);

    // Log the activity
    const log = this.activityRepo.create({
      userId,
      materialId: transcript.materialId,
      activityType: ActivityType.DICTATION,
      score,
    });
    await this.activityRepo.save(log);

    return {
      isCorrect,
      originalText,
      score,
    };
  }

  /**
   * Basic Levenshtein or simplified similarity score
   */
  private calculateSimilarity(original: string, input: string): number {
    if (original === input) return 100;
    if (!original || !input) return 0;

    // Simplistic word-by-word match score for now
    const origWords = original.split(/\s+/);
    const inputWords = input.split(/\s+/);

    let matches = 0;
    const maxLen = Math.max(origWords.length, inputWords.length);

    for (let i = 0; i < inputWords.length; i++) {
      if (origWords.includes(inputWords[i])) {
        matches++;
      }
    }

    return Math.round((matches / maxLen) * 100);
  }
}
