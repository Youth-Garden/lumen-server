import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { CreateListeningLessonDto } from '../../application/dtos/create-listening-lesson.dto';
import { CreateSpeakingTaskDto } from '../../application/dtos/create-speaking-task.dto';
import { SubmitSpeechRecordDto } from '../../application/dtos/submit-speech-record.dto';
import { ListListeningLessonsFilterDto } from '../../application/dtos/list-listening-lessons-filter.dto';
import { ListSpeakingTasksFilterDto } from '../../application/dtos/list-speaking-tasks-filter.dto';
import { CreateListeningLessonCommand } from '../../application/commands/create-listening-lesson.command';
import { CreateSpeakingTaskCommand } from '../../application/commands/create-speaking-task.command';
import { SubmitSpeechRecordCommand } from '../../application/commands/submit-speech-record.command';
import { ListListeningLessonsQuery } from '../../application/queries/list-listening-lessons.query';
import { GetListeningLessonDetailsQuery } from '../../application/queries/get-listening-lesson-details.query';
import { ListSpeakingTasksQuery } from '../../application/queries/list-speaking-tasks.query';
import { ListeningLessonResponseDto } from '../../application/responses/listening-lesson.response.dto';
import { SpeakingTaskResponseDto } from '../../application/responses/speaking-task.response.dto';
import { SpeechRecordResponseDto } from '../../application/responses/speech-record.response.dto';
import { PaginatedResponseDto } from '../../../../shared/presentation/dtos/paginated-response.dto';

// Note: Ensure to import Auth/User decorators for the real user ID instead of mock

@ApiTags('Listening & Speaking')
@Controller('listening-speaking')
export class ListeningSpeakingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('listening-lessons')
  @ApiOperation({ summary: 'Create a new listening lesson (Admin)' })
  async createListeningLesson(
    @Body() dto: CreateListeningLessonDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<
      CreateListeningLessonCommand,
      string
    >(
      new CreateListeningLessonCommand(
        dto.title,
        dto.audioUrl,
        dto.cefrLevel,
        dto.transcript,
      ),
    );
    return { id };
  }

  @Get('listening-lessons')
  @ApiOperation({ summary: 'List listening lessons' })
  async listListeningLessons(
    @Query() filter: ListListeningLessonsFilterDto,
  ): Promise<PaginatedResponseDto<ListeningLessonResponseDto>> {
    return this.queryBus.execute<
      ListListeningLessonsQuery,
      PaginatedResponseDto<ListeningLessonResponseDto>
    >(
      new ListListeningLessonsQuery(
        filter.page || 1,
        filter.limit || 10,
        filter.search,
        filter.cefrLevel,
      ),
    );
  }

  @Get('listening-lessons/:id')
  @ApiOperation({ summary: 'Get details of a listening lesson' })
  async getListeningLessonDetails(
    @Param('id') id: string,
  ): Promise<ListeningLessonResponseDto> {
    return this.queryBus.execute<
      GetListeningLessonDetailsQuery,
      ListeningLessonResponseDto
    >(new GetListeningLessonDetailsQuery(id));
  }

  @Post('speaking-tasks')
  @ApiOperation({ summary: 'Create a new speaking task (Admin)' })
  async createSpeakingTask(
    @Body() dto: CreateSpeakingTaskDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateSpeakingTaskCommand, string>(
      new CreateSpeakingTaskCommand(
        dto.title,
        dto.prompt,
        dto.referenceAudioUrl || null,
        dto.keywords,
      ),
    );
    return { id };
  }

  @Get('speaking-tasks')
  @ApiOperation({ summary: 'List speaking tasks' })
  async listSpeakingTasks(
    @Query() filter: ListSpeakingTasksFilterDto,
  ): Promise<PaginatedResponseDto<SpeakingTaskResponseDto>> {
    return this.queryBus.execute<
      ListSpeakingTasksQuery,
      PaginatedResponseDto<SpeakingTaskResponseDto>
    >(
      new ListSpeakingTasksQuery(
        filter.page || 1,
        filter.limit || 10,
        filter.search,
        filter.category,
      ),
    );
  }

  @ApiBearerAuth()
  @Post('speaking-tasks/:id/submit')
  @ApiOperation({ summary: 'Submit an audio recording for a speaking task' })
  async submitSpeechRecord(
    @Param('id') taskId: string,
    @CurrentUser() userId: string,
    @Body() dto: SubmitSpeechRecordDto,
  ): Promise<SpeechRecordResponseDto> {
    return this.commandBus.execute<
      SubmitSpeechRecordCommand,
      SpeechRecordResponseDto
    >(new SubmitSpeechRecordCommand(taskId, userId, dto.audioUrl));
  }
}
