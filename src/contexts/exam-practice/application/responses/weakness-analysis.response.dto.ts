import { Expose, Type } from 'class-transformer';
import { WeaknessLevelEnum } from '../../domain/enums/exam.enum';

export class PartMasteryDto {
  @Expose()
  partNumber: number;

  @Expose()
  name: string;

  @Expose()
  totalAttempted: number;

  @Expose()
  correctCount: number;

  @Expose()
  accuracyPercentage: number;

  @Expose()
  weaknessLevel: WeaknessLevelEnum;

  constructor(
    partNumber: number,
    name: string,
    totalAttempted: number,
    correctCount: number,
    accuracyPercentage: number,
    weaknessLevel: WeaknessLevelEnum,
  ) {
    this.partNumber = partNumber;
    this.name = name;
    this.totalAttempted = totalAttempted;
    this.correctCount = correctCount;
    this.accuracyPercentage = accuracyPercentage;
    this.weaknessLevel = weaknessLevel;
  }
}

export class WeaknessAnalysisResponseDto {
  @Expose()
  @Type(() => PartMasteryDto)
  partMasteries: PartMasteryDto[];

  @Expose()
  recommendedPartNumbers: number[];

  @Expose()
  overallAccuracy: number;

  constructor(
    partMasteries: PartMasteryDto[],
    recommendedPartNumbers: number[],
    overallAccuracy: number,
  ) {
    this.partMasteries = partMasteries;
    this.recommendedPartNumbers = recommendedPartNumbers;
    this.overallAccuracy = overallAccuracy;
  }
}
