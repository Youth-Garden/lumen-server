import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { PaginatedResponseDto } from '../../../../shared/presentation/dtos/paginated-response.dto';
import { CreateGrammarTopicDto } from '../../application/dtos/create-grammar-topic.dto';
import { AddGrammarLessonDto } from '../../application/dtos/add-grammar-lesson.dto';
import { AddGrammarExerciseDto } from '../../application/dtos/add-grammar-exercise.dto';
import { SubmitGrammarExerciseDto } from '../../application/dtos/submit-grammar-exercise.dto';
import { GrammarTopicResponseDto } from '../../application/responses/grammar-topic.response.dto';
import { GrammarExerciseResponseDto } from '../../application/responses/grammar-exercise.response.dto';
import { SubmitExerciseResponseDto } from '../../application/responses/submit-exercise.response.dto';
import { CreateGrammarTopicCommand } from '../../application/commands/create-grammar-topic.command';
import { AddGrammarLessonCommand } from '../../application/commands/add-grammar-lesson.command';
import { AddGrammarExerciseCommand } from '../../application/commands/add-grammar-exercise.command';
import { SubmitGrammarExerciseCommand } from '../../application/commands/submit-grammar-exercise.command';
import { ListGrammarTopicsQuery } from '../../application/queries/list-grammar-topics.query';
import { GetGrammarTopicDetailsQuery } from '../../application/queries/get-grammar-topic-details.query';
import { ListGrammarLessonExercisesQuery } from '../../application/queries/list-grammar-lesson-exercises.query';
import { ListGrammarTopicsFilterDto } from '../../application/dtos/list-grammar-topics-filter.dto';

@ApiTags('Grammar')
@Controller('grammar')
export class GrammarController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Get('topics')
  @ApiOperation({ summary: 'List all grammar topics' })
  @ApiResponse({ status: 200, description: 'Paginated list of topics.' })
  async listTopics(
    @Query() filter: ListGrammarTopicsFilterDto,
  ): Promise<PaginatedResponseDto<GrammarTopicResponseDto>> {
    return this.queryBus.execute<
      ListGrammarTopicsQuery,
      PaginatedResponseDto<GrammarTopicResponseDto>
    >(
      new ListGrammarTopicsQuery(
        filter.page || 1,
        filter.limit || 20,
        filter.search,
        filter.cefrLevel,
      ),
    );
  }

  @Public()
  @Get('topics/:id')
  @ApiOperation({ summary: 'Get grammar topic details including lessons' })
  @ApiResponse({
    status: 200,
    type: GrammarTopicResponseDto,
  })
  async getTopicDetails(
    @Param('id') id: string,
  ): Promise<GrammarTopicResponseDto> {
    return this.queryBus.execute<
      GetGrammarTopicDetailsQuery,
      GrammarTopicResponseDto
    >(new GetGrammarTopicDetailsQuery(id));
  }

  @ApiBearerAuth()
  @Get('lessons/:id/exercises')
  @ApiOperation({ summary: 'List exercises for a grammar lesson' })
  @ApiResponse({
    status: 200,
    type: [GrammarExerciseResponseDto],
  })
  async getLessonExercises(
    @Param('id') lessonId: string,
  ): Promise<GrammarExerciseResponseDto[]> {
    return this.queryBus.execute<
      ListGrammarLessonExercisesQuery,
      GrammarExerciseResponseDto[]
    >(new ListGrammarLessonExercisesQuery(lessonId));
  }

  // Admin routes (Authentication normally required, skipped role check for brevity as per instructions)
  @ApiBearerAuth()
  @Post('topics')
  @ApiOperation({ summary: 'Create a new grammar topic' })
  @ApiBody({ type: CreateGrammarTopicDto })
  async createTopic(
    @Body() dto: CreateGrammarTopicDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateGrammarTopicCommand, string>(
      new CreateGrammarTopicCommand(dto.title, dto.description, dto.cefrLevel),
    );
    return { id };
  }

  @ApiBearerAuth()
  @Post('topics/:id/lessons')
  @ApiOperation({ summary: 'Add a lesson to a grammar topic' })
  @ApiBody({ type: AddGrammarLessonDto })
  async addLesson(
    @Param('id') topicId: string,
    @Body() dto: AddGrammarLessonDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<AddGrammarLessonCommand, string>(
      new AddGrammarLessonCommand(
        topicId,
        dto.title,
        dto.content,
        dto.orderIndex,
      ),
    );
    return { id };
  }

  @ApiBearerAuth()
  @Post('lessons/:id/exercises')
  @ApiOperation({ summary: 'Add an exercise to a grammar lesson' })
  @ApiBody({ type: AddGrammarExerciseDto })
  async addExercise(
    @Param('id') lessonId: string,
    @Body() dto: AddGrammarExerciseDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<AddGrammarExerciseCommand, string>(
      new AddGrammarExerciseCommand(
        lessonId,
        dto.questionText,
        dto.options,
        dto.correctAnswer,
        dto.explanation,
      ),
    );
    return { id };
  }

  @ApiBearerAuth()
  @Post('exercises/:id/submit')
  @ApiOperation({ summary: 'Submit an answer to a grammar exercise' })
  @ApiBody({ type: SubmitGrammarExerciseDto })
  @ApiResponse({
    status: 200,
    type: SubmitExerciseResponseDto,
  })
  async submitExercise(
    @Param('id') exerciseId: string,
    @CurrentUser() userId: string,
    @Body() dto: SubmitGrammarExerciseDto,
  ): Promise<SubmitExerciseResponseDto> {
    return this.commandBus.execute<
      SubmitGrammarExerciseCommand,
      SubmitExerciseResponseDto
    >(new SubmitGrammarExerciseCommand(exerciseId, userId, dto.answer));
  }
}
