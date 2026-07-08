import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query as QueryParam,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  SubmitDictationDto,
  DictationResultDto,
} from '../../application/dtos/dictation.dto';
import { SubmitDictationCommand } from '../../application/commands/submit-dictation.command';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import {
  MaterialDto,
  MaterialListDto,
} from '../../application/dtos/material.response.dto';
import {
  ListMaterialsQuery,
  GetMaterialByIdQuery,
} from '../../application/queries/get-material.query';
import { MaterialType } from '../../infrastructure/typeorm/entities/material.entity';
import { Public } from '../../../../shared-kernel/decorators/public.decorator';

@ApiTags('Materials (Content Hub)')
@Controller('materials')
export class MaterialController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @Public() // Allow dictation without login for now if needed, or remove @Public
  @ApiOperation({ summary: 'List materials (audio, text, etc)' })
  @ApiQuery({ name: 'type', enum: MaterialType, required: false })
  @ApiResponse({ status: 200, type: MaterialListDto })
  async listMaterials(
    @QueryParam('type') type?: MaterialType,
    @QueryParam('page') page: number = 1,
    @QueryParam('limit') limit: number = 20,
  ): Promise<MaterialListDto> {
    return this.queryBus.execute<ListMaterialsQuery, MaterialListDto>(
      new ListMaterialsQuery(type, page, limit),
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
