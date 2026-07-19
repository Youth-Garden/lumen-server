import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetWeaknessAnalysisQuery } from './get-weakness-analysis.handler';
import { WeaknessAnalysisResponseDto } from '../responses/weakness-analysis.response.dto';
import { DataSource } from 'typeorm';
import {
  AdaptiveDrillQuestionDto,
  AdaptiveDrillResponseDto,
} from '../responses/adaptive-drill.response.dto';

export class GetAdaptiveDrillQuery {
  constructor(public readonly userId: string) {}
}

@Injectable()
@QueryHandler(GetAdaptiveDrillQuery)
export class GetAdaptiveDrillHandler implements IQueryHandler<
  GetAdaptiveDrillQuery,
  AdaptiveDrillResponseDto
> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    query: GetAdaptiveDrillQuery,
  ): Promise<AdaptiveDrillResponseDto> {
    // 1. Get user weakness recommended parts
    const weaknessQuery = new GetWeaknessAnalysisQuery(query.userId);
    const weaknessAnalysis = await this.queryBus.execute<
      GetWeaknessAnalysisQuery,
      WeaknessAnalysisResponseDto
    >(weaknessQuery);

    // Fallback to parts 5, 6, 7 if the user has no history
    const targetParts =
      weaknessAnalysis.recommendedPartNumbers.length > 0
        ? weaknessAnalysis.recommendedPartNumbers
        : [5, 6, 7];

    // 2. Fetch questions belonging strictly to those target parts
    const rawQuestions: {
      id: string;
      part: number;
      questionText: string;
      options: string[];
      explanation: string;
    }[] = await this.dataSource.query(
      `
      SELECT id, part, "questionText", options, explanation
      FROM toeic_questions
      WHERE part = ANY($1)
      ORDER BY RANDOM()
      LIMIT 5
      `,
      [targetParts],
    );

    const questions: AdaptiveDrillQuestionDto[] = (
      rawQuestions.length > 0
        ? rawQuestions
        : [
            {
              id: 'q1',
              part: 5,
              questionText:
                'The financial report must be completed _____ Friday at 5:00 PM.',
              options: ['by', 'until', 'at', 'on'],
              explanation:
                'Use "by" to indicate a deadline before or at a specific time.',
            },
            {
              id: 'q2',
              part: 5,
              questionText:
                'Ms. Carter was _____ recommended for the managerial promotion.',
              options: ['highly', 'high', 'highest', 'heighten'],
              explanation:
                'Adverb "highly" correctly modifies the participle "recommended".',
            },
            {
              id: 'q3',
              part: 5,
              questionText:
                'Please review the attached contract _____ signing it.',
              options: ['before', 'afterwards', 'prior', 'ahead'],
              explanation:
                '"Before" functions as a preposition followed by a gerund ("signing").',
            },
            {
              id: 'q4',
              part: 6,
              questionText:
                'All employees are encouraged to participate in the upcoming wellness _____.',
              options: ['workshop', 'workshops', 'worked', 'working'],
              explanation:
                'Noun "workshop" fits correctly after the adjective "wellness".',
            },
            {
              id: 'q5',
              part: 7,
              questionText: 'What is the main purpose of the announcement?',
              options: [
                'To notify staff of a policy change',
                'To cancel an event',
                'To request feedback',
                'To hire new staff',
              ],
              explanation:
                'Main purpose questions test overall document comprehension.',
            },
          ]
    ).map(
      (questionItem) =>
        new AdaptiveDrillQuestionDto(
          questionItem.id,
          questionItem.part || 5,
          questionItem.questionText || '',
          Array.isArray(questionItem.options)
            ? questionItem.options
            : ['A', 'B', 'C', 'D'],
          questionItem.explanation,
        ),
    );

    return new AdaptiveDrillResponseDto(
      `drill_${Date.now()}`,
      'Adaptive Weakness Remediation Drill',
      [5, 6, 7],
      5,
      questions,
    );
  }
}
