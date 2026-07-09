import { DictationResultDto, SubmitDictationDto } from '../dtos/dictation.dto';
import {
  MaterialDto,
  MaterialListDto,
} from '../responses/material.response.dto';
import { MaterialType } from '../../domain/enums/material.enum';

export const MATERIAL_QUERY_REPOSITORY = Symbol('MATERIAL_QUERY_REPOSITORY');

export interface IMaterialQueryRepository {
  findAll(
    type: MaterialType | undefined,
    page: number,
    limit: number,
  ): Promise<MaterialListDto>;
  findById(id: string): Promise<MaterialDto | null>;
  submitDictation(
    dto: SubmitDictationDto,
    userId: string,
  ): Promise<DictationResultDto | null>;
}
