import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { SubmitDictationCommand } from '../../application/commands/submit-dictation.command';
import {
  DictationResultDto,
  SubmitDictationDto,
} from '../../application/dtos/dictation.dto';
import { ListMaterialsDto } from '../../application/dtos/list-materials.dto';
import {
  GetMaterialByIdQuery,
  ListMaterialsQuery,
} from '../../application/queries/get-material.query';
import {
  MaterialDto,
  MaterialListDto,
} from '../../application/responses/material.response.dto';

@ApiTags('Materials (Content Hub)')
@Controller('materials')
export class MaterialController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List materials (audio, text, etc)' })
  @ApiResponse({ status: 200, type: MaterialListDto })
  async listMaterials(
    @Query() queryDto: ListMaterialsDto,
  ): Promise<MaterialListDto> {
    return this.queryBus.execute<ListMaterialsQuery, MaterialListDto>(
      new ListMaterialsQuery(queryDto.type, queryDto.page, queryDto.limit),
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get material details and transcripts' })
  @ApiResponse({ status: 200, type: MaterialDto })
  async getMaterialById(@Param('id') id: string): Promise<MaterialDto> {
    return this.queryBus.execute<GetMaterialByIdQuery, MaterialDto>(
      new GetMaterialByIdQuery(id),
    );
  }

  @Post('dictation')
  @ApiOperation({ summary: 'Submit a dictation answer' })
  @ApiBody({ type: SubmitDictationDto })
  @ApiResponse({ status: 201, type: DictationResultDto })
  async submitDictation(
    @Body() dto: SubmitDictationDto,
    @CurrentUser() userId: string,
  ): Promise<DictationResultDto> {
    return this.commandBus.execute<SubmitDictationCommand, DictationResultDto>(
      new SubmitDictationCommand(dto, userId),
    );
  }
}
