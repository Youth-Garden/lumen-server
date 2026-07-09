import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  Query as QueryParam,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreatePresetQuizDto,
  UpdatePresetQuizDto,
} from '../../application/dtos/preset-quiz.dto';
import { CreatePresetQuizCommand } from '../../application/commands/create-preset-quiz.command';
import {
  UpdatePresetQuizCommand,
  DeletePresetQuizCommand,
} from '../../application/commands/preset-quiz-extra.commands';
import { PresetQuizResponseDto } from '../../application/responses/preset-quiz.response.dto';
import { PresetQuizListResponseDto } from '../../application/responses/preset-quiz-list.response.dto';
import { ListPresetQuizzesQuery } from '../../application/queries/list-preset-quizzes.query';
import { GetPresetQuizByIdQuery } from '../../application/queries/get-preset-quiz-by-id.query';

@ApiTags('Admin Quizzes')
@Controller('admin/quizzes')
export class AdminQuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List preset quizzes for Admin' })
  @ApiResponse({ status: 200, type: PresetQuizListResponseDto })
  async listPresetQuizzes(
    @QueryParam('page') page: number = 1,
    @QueryParam('limit') limit: number = 20,
  ): Promise<PresetQuizListResponseDto> {
    return this.queryBus.execute<
      ListPresetQuizzesQuery,
      PresetQuizListResponseDto
    >(new ListPresetQuizzesQuery(page, limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get preset quiz by ID' })
  @ApiResponse({ status: 200, type: PresetQuizResponseDto })
  async getPresetQuizById(
    @Param('id') id: string,
  ): Promise<PresetQuizResponseDto> {
    return this.queryBus.execute<GetPresetQuizByIdQuery, PresetQuizResponseDto>(
      new GetPresetQuizByIdQuery(id),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new preset quiz' })
  @ApiBody({ type: CreatePresetQuizDto })
  @ApiResponse({ status: 201, description: 'Quiz created successfully.' })
  async createPresetQuiz(
    @Body() dto: CreatePresetQuizDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreatePresetQuizCommand, string>(
      new CreatePresetQuizCommand(dto),
    );
    return { id };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing preset quiz' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdatePresetQuizDto })
  @ApiResponse({ status: 200 })
  async updatePresetQuiz(
    @Param('id') id: string,
    @Body() dto: UpdatePresetQuizDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdatePresetQuizCommand, void>(
      new UpdatePresetQuizCommand(id, dto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a preset quiz' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async deletePresetQuiz(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute<DeletePresetQuizCommand, void>(
      new DeletePresetQuizCommand(id),
    );
  }
}
