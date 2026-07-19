import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { WeaknessLevelEnum } from '../../domain/enums/exam.enum';
import {
  PartMasteryDto,
  WeaknessAnalysisResponseDto,
} from '../responses/weakness-analysis.response.dto';

export class GetWeaknessAnalysisQuery {
  constructor(public readonly userId: string) {}
}

const PART_NAMES: Record<number, string> = {
  1: 'Photographs',
  2: 'Question-Response',
  3: 'Conversations',
  4: 'Short Talks',
  5: 'Incomplete Sentences',
  6: 'Text Completion',
  7: 'Reading Comprehension',
};

@Injectable()
@QueryHandler(GetWeaknessAnalysisQuery)
export class GetWeaknessAnalysisHandler implements IQueryHandler<
  GetWeaknessAnalysisQuery,
  WeaknessAnalysisResponseDto
> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(
    query: GetWeaknessAnalysisQuery,
  ): Promise<WeaknessAnalysisResponseDto> {
    // Join exam_attempts and jsonb answers with the actual toeic_questions table to fetch the real Part (1-7)
    const rawAnswers: {
      part: number;
      isCorrect: boolean;
    }[] = await this.dataSource.query(
      `
      SELECT 
        q.part AS "part",
        ans."isCorrect" AS "isCorrect"
      FROM exam_attempts ea
      CROSS JOIN jsonb_to_recordset(ea.answers) AS ans(
        "questionId" uuid, 
        "isCorrect" boolean
      )
      JOIN toeic_questions q ON q.id = ans."questionId"
      WHERE ea."userId" = $1 AND ea.status = 'COMPLETED' AND ans."isCorrect" IS NOT NULL
      `,
      [query.userId],
    );

    const partStats: Record<number, { attempted: number; correct: number }> =
      {};
    for (let partIndex = 1; partIndex <= 7; partIndex += 1) {
      partStats[partIndex] = { attempted: 0, correct: 0 };
    }

    let totalAttempted = 0;
    let totalCorrect = 0;

    for (const answer of rawAnswers) {
      totalAttempted += 1;
      if (answer.isCorrect) totalCorrect += 1;

      if (partStats[answer.part]) {
        partStats[answer.part].attempted += 1;
        if (answer.isCorrect) {
          partStats[answer.part].correct += 1;
        }
      }
    }

    const partMasteries: PartMasteryDto[] = [];
    for (let partIndex = 1; partIndex <= 7; partIndex += 1) {
      const stat = partStats[partIndex];
      const accuracy =
        stat.attempted > 0
          ? Math.round((stat.correct / stat.attempted) * 100)
          : 0;

      let weaknessLevel: WeaknessLevelEnum = WeaknessLevelEnum.NEEDS_PRACTICE;
      if (stat.attempted === 0) {
        weaknessLevel = WeaknessLevelEnum.NEEDS_PRACTICE;
      } else if (accuracy >= 80) {
        weaknessLevel = WeaknessLevelEnum.MASTERED;
      } else if (accuracy >= 50) {
        weaknessLevel = WeaknessLevelEnum.MODERATE;
      }

      partMasteries.push(
        new PartMasteryDto(
          partIndex,
          PART_NAMES[partIndex],
          stat.attempted,
          stat.correct,
          accuracy,
          weaknessLevel,
        ),
      );
    }

    const sortedByAccuracy = [...partMasteries].sort(
      (firstMastery, secondMastery) =>
        firstMastery.accuracyPercentage - secondMastery.accuracyPercentage,
    );
    const recommendedPartNumbers = sortedByAccuracy
      .slice(0, 3)
      .map((masteryItem) => masteryItem.partNumber);

    const overallAccuracy =
      totalAttempted > 0
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : 0;

    return new WeaknessAnalysisResponseDto(
      partMasteries,
      recommendedPartNumbers,
      overallAccuracy,
    );
  }
}
