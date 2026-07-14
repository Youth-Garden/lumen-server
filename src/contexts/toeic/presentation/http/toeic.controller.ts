import { Controller, Get, Param, Post, Body, Query, UseGuards, Put } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ToeicTestResponseDto } from '../../application/responses/toeic-test.response.dto';
import { ListToeicTestsQuery } from '../../application/queries/list-toeic-tests.query';
import { GetToeicTestByIdQuery } from '../../application/queries/get-toeic-test-by-id.query';
import { SaveUserNoteDto } from './dto/save-user-note.dto';
import { SaveUserNoteCommand } from '../../application/commands/save-user-note.handler';
import { GetUserNotesQuery } from '../../application/queries/get-user-notes.handler';
import { UpdateExplanationDto } from './dto/update-explanation.dto';
import { UpdateExplanationCommand } from '../../application/commands/update-explanation.handler';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared-kernel/guards/jwt-auth.guard';

@ApiTags('TOEIC')
@Controller('toeic')
export class ToeicController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('tests')
  @ApiOperation({ summary: 'Get list of published TOEIC tests' })
  @ApiResponse({
    status: 200,
    description: 'List of tests',
    type: [ToeicTestResponseDto],
  })
  async listTests(): Promise<ToeicTestResponseDto[]> {
    return this.queryBus.execute<ListToeicTestsQuery, ToeicTestResponseDto[]>(
      new ListToeicTestsQuery(),
    );
  }

  @Get('tests/:id')
  @ApiOperation({ summary: 'Get details of a TOEIC test including questions' })
  @ApiResponse({
    status: 200,
    description: 'Test details',
    type: ToeicTestResponseDto,
  })
  async getTestById(@Param('id') id: string): Promise<ToeicTestResponseDto> {
    return this.queryBus.execute<GetToeicTestByIdQuery, ToeicTestResponseDto>(
      new GetToeicTestByIdQuery(id),
    );
  }

  @Get('notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notes, optionally filtered by testId' })
  async listNotes(
    @CurrentUser() userId: string,
    @Query('testId') testId?: string,
  ) {
    return this.queryBus.execute<GetUserNotesQuery, any>(
      new GetUserNotesQuery(userId, testId),
    );
  }

  @Post('notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update a question note' })
  async saveNote(
    @CurrentUser() userId: string,
    @Body() dto: SaveUserNoteDto,
  ): Promise<void> {
    await this.commandBus.execute<SaveUserNoteCommand, void>(
      new SaveUserNoteCommand(
        userId,
        dto.questionId,
        dto.testId,
        dto.content,
        dto.category,
        dto.tags,
      ),
    );
  }

  @Put('questions/:id/explanation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update explanation for a question (Admin)' })
  async updateExplanation(
    @Param('id') questionId: string,
    @Body() dto: UpdateExplanationDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateExplanationCommand, void>(
      new UpdateExplanationCommand(
        questionId,
        dto.explanation,
        dto.mediaUrls,
      ),
    );
  }
}

