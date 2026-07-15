import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppException } from '../../../../shared/domain/exceptions';
import { MaterialEx } from '../../domain/exceptions/material.exception';
import { DictationResultDto, SubmitDictationDto } from '../dtos/dictation.dto';
import type { IMaterialQueryRepository } from '../ports/material-query.repository';
import { MATERIAL_QUERY_REPOSITORY } from '../ports/material-query.repository';

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
    @Inject(MATERIAL_QUERY_REPOSITORY)
    private readonly materialQueryRepository: IMaterialQueryRepository,
  ) {}

  async execute(command: SubmitDictationCommand): Promise<DictationResultDto> {
    const result = await this.materialQueryRepository.submitDictation(
      command.dto,
      command.userId,
    );

    if (!result) {
      throw new AppException(MaterialEx.MaterialNotFound);
    }

    return result;
  }
}
