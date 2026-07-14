import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { Roles } from '../../../../shared-kernel/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared-kernel/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared-kernel/guards/roles.guard';
import { Role } from '../../../iam/domain/enums/role.enum';
import { SaveUserNoteCommand } from '../../application/commands/save-user-note.handler';
import { UpdateExplanationCommand } from '../../application/commands/update-explanation.handler';
import { GetQuestionsWithoutExplanationQuery } from '../../application/queries/get-questions-without-explanation.handler';
import { GetToeicTestByIdQuery } from '../../application/queries/get-toeic-test-by-id.query';
import { GetUserNotesQuery } from '../../application/queries/get-user-notes.handler';
import { ListToeicTestsQuery } from '../../application/queries/list-toeic-tests.query';
import { MissingExplanationResponseDto } from '../../application/responses/missing-explanation.response.dto';
import { ToeicTestResponseDto } from '../../application/responses/toeic-test.response.dto';
import { UserNoteEntity } from '../../infrastructure/entities/user-note.entity';
import { CreateToeicTestCommand } from '../../application/commands/create-toeic-test.handler';
import { UpdateToeicTestCommand } from '../../application/commands/update-toeic-test.handler';
import { DeleteToeicTestCommand } from '../../application/commands/delete-toeic-test.handler';
import { PublishToeicTestCommand } from '../../application/commands/publish-toeic-test.handler';
import { CreateToeicTestDto } from './dto/create-toeic-test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic-test.dto';
import { SaveUserNoteDto } from './dto/save-user-note.dto';
import { UpdateExplanationDto } from './dto/update-explanation.dto';

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
    return this.queryBus.execute<GetUserNotesQuery, UserNoteEntity[]>(
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update explanation for a question (Admin)' })
  async updateExplanation(
    @Param('id') questionId: string,
    @Body() dto: UpdateExplanationDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateExplanationCommand, void>(
      new UpdateExplanationCommand(questionId, dto.explanation, dto.mediaUrls),
    );
  }

  @Get('admin/missing-explanations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get questions that lack an explanation (Admin)' })
  @ApiResponse({ type: [MissingExplanationResponseDto] })
  async getMissingExplanations(): Promise<MissingExplanationResponseDto[]> {
    return this.queryBus.execute<
      GetQuestionsWithoutExplanationQuery,
      MissingExplanationResponseDto[]
    >(new GetQuestionsWithoutExplanationQuery());
  }

  @Post('tests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new TOEIC test (Admin)' })
  @ApiResponse({ status: 201, description: 'Test created', type: String })
  async createTest(@Body() dto: CreateToeicTestDto): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateToeicTestCommand, string>(
      new CreateToeicTestCommand(dto.title, dto.description, dto.isPublished),
    );
    return { id };
  }

  @Put('tests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a TOEIC test (Admin)' })
  async updateTest(
    @Param('id') id: string,
    @Body() dto: UpdateToeicTestDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateToeicTestCommand, void>(
      new UpdateToeicTestCommand(
        id,
        dto.title,
        dto.description,
        dto.isPublished,
        dto.questions,
      ),
    );
  }

  @Delete('tests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a TOEIC test (Admin)' })
  async deleteTest(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute<DeleteToeicTestCommand, void>(
      new DeleteToeicTestCommand(id),
    );
  }

  @Post('tests/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a TOEIC test (Admin)' })
  async publishTest(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute<PublishToeicTestCommand, void>(
      new PublishToeicTestCommand(id),
    );
  }
}
