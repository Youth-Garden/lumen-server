import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { PagedData } from '../../../../shared/presentation/response/paging';
import { FinishExamAttemptCommand } from '../../application/commands/finish-exam-attempt.handler';
import { PauseExamAttemptCommand } from '../../application/commands/pause-exam-attempt.handler';
import { ResumeExamAttemptCommand } from '../../application/commands/resume-exam-attempt.handler';
import { StartExamAttemptCommand } from '../../application/commands/start-exam-attempt.handler';
import { StartRetestAttemptCommand } from '../../application/commands/start-retest-attempt.handler';
import { SubmitExamAnswerCommand } from '../../application/commands/submit-exam-answer.handler';
import { GetMyAttemptsDto } from '../../application/dtos/get-my-attempts.dto';
import { PauseExamAttemptDto } from '../../application/dtos/pause-exam-attempt.dto';
import { StartExamAttemptDto } from '../../application/dtos/start-exam-attempt.dto';
import { SubmitExamAnswerDto } from '../../application/dtos/submit-exam-answer.dto';
import { GetAdaptiveDrillQuery } from '../../application/queries/get-adaptive-drill.handler';
import { GetExamAttemptQuery } from '../../application/queries/get-exam-attempt.handler';
import { GetMyAttemptsQuery } from '../../application/queries/get-my-attempts.handler';
import { GetWeaknessAnalysisQuery } from '../../application/queries/get-weakness-analysis.handler';
import { AdaptiveDrillResponseDto } from '../../application/responses/adaptive-drill.response.dto';
import { AttemptSummaryResponseDto } from '../../application/responses/attempt-summary.response.dto';
import { ExamAttemptResponseDto } from '../../application/responses/exam-attempt.response.dto';
import { WeaknessAnalysisResponseDto } from '../../application/responses/weakness-analysis.response.dto';

@ApiTags('Exam Practice')
@Controller('exam-practice/attempts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamPracticeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Start a new mock test attempt' })
  @ApiResponse({ status: 201, description: 'Attempt started', type: String })
  async startAttempt(
    @CurrentUser() userId: string,
    @Body() dto: StartExamAttemptDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<StartExamAttemptCommand, string>(
      new StartExamAttemptCommand(
        userId,
        dto.testId,
        dto.testType,
        dto.mode,
        dto.partsAttempted,
        dto.customTimeLimit,
      ),
    );
    return { id };
  }

  @Put(':id/answers')
  @HttpCode(204)
  @ApiOperation({ summary: 'Submit or update an answer (autosave)' })
  @ApiResponse({ status: 204, description: 'Answer saved' })
  async submitAnswer(
    @CurrentUser() userId: string,
    @Param('id') attemptId: string,
    @Body() dto: SubmitExamAnswerDto,
  ): Promise<void> {
    await this.commandBus.execute<SubmitExamAnswerCommand, void>(
      new SubmitExamAnswerCommand(
        userId,
        attemptId,
        dto.questionId,
        dto.userAnswer,
        dto.timeSpent,
        dto.flaggedHard,
      ),
    );
  }

  @Post(':id/finish')
  @HttpCode(200)
  @ApiOperation({ summary: 'Finish the exam attempt and calculate score' })
  @ApiResponse({ status: 200, description: 'Exam finished' })
  async finishAttempt(
    @CurrentUser() userId: string,
    @Param('id') attemptId: string,
  ): Promise<void> {
    await this.commandBus.execute<FinishExamAttemptCommand, void>(
      new FinishExamAttemptCommand(userId, attemptId),
    );
  }

  @Post(':id/pause')
  @HttpCode(200)
  @ApiOperation({ summary: 'Pause the exam attempt' })
  @ApiResponse({ status: 200, description: 'Exam paused' })
  async pauseAttempt(
    @CurrentUser() userId: string,
    @Param('id') attemptId: string,
    @Body() dto: PauseExamAttemptDto,
  ): Promise<void> {
    await this.commandBus.execute<PauseExamAttemptCommand, void>(
      new PauseExamAttemptCommand(userId, attemptId, dto.elapsedSeconds || 0),
    );
  }

  @Post(':id/resume')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resume the exam attempt' })
  @ApiResponse({ status: 200, description: 'Exam resumed' })
  async resumeAttempt(
    @CurrentUser() userId: string,
    @Param('id') attemptId: string,
  ): Promise<void> {
    await this.commandBus.execute<ResumeExamAttemptCommand, void>(
      new ResumeExamAttemptCommand(userId, attemptId),
    );
  }

  @Post(':id/retest')
  @HttpCode(201)
  @ApiOperation({
    summary:
      'Start a retest with only the incorrect questions from a previous attempt',
  })
  @ApiResponse({
    status: 201,
    description: 'Retest attempt started',
    type: String,
  })
  async startRetest(
    @CurrentUser() userId: string,
    @Param('id') attemptId: string,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<StartRetestAttemptCommand, string>(
      new StartRetestAttemptCommand(userId, attemptId),
    );
    return { id };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my exam attempt history (paginated)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of my exam attempts',
    type: AttemptSummaryResponseDto,
    isArray: true,
  })
  async getMyAttempts(
    @CurrentUser() userId: string,
    @Query() dto: GetMyAttemptsDto,
  ): Promise<PagedData<AttemptSummaryResponseDto>> {
    return this.queryBus.execute<
      GetMyAttemptsQuery,
      PagedData<AttemptSummaryResponseDto>
    >(new GetMyAttemptsQuery(userId, dto.page, dto.limit));
  }

  @Get('weakness-analysis')
  @ApiOperation({ summary: 'Get user TOEIC weakness analysis' })
  @ApiResponse({
    status: 200,
    description: 'Weakness analysis breakdown',
    type: WeaknessAnalysisResponseDto,
  })
  async getWeaknessAnalysis(
    @CurrentUser() userId: string,
  ): Promise<WeaknessAnalysisResponseDto> {
    return this.queryBus.execute<
      GetWeaknessAnalysisQuery,
      WeaknessAnalysisResponseDto
    >(new GetWeaknessAnalysisQuery(userId));
  }

  @Get('adaptive-drill')
  @ApiOperation({ summary: 'Get personalized adaptive drill questions' })
  @ApiResponse({
    status: 200,
    description: '5-question adaptive drill',
    type: AdaptiveDrillResponseDto,
  })
  async getAdaptiveDrill(
    @CurrentUser() userId: string,
  ): Promise<AdaptiveDrillResponseDto> {
    return this.queryBus.execute<
      GetAdaptiveDrillQuery,
      AdaptiveDrillResponseDto
    >(new GetAdaptiveDrillQuery(userId));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of an exam attempt (including score and answers)',
  })
  @ApiResponse({
    status: 200,
    description: 'Exam attempt details',
    type: ExamAttemptResponseDto,
  })
  async getAttempt(
    @CurrentUser() userId: string,
    @Param('id') attemptId: string,
  ): Promise<ExamAttemptResponseDto> {
    return this.queryBus.execute<GetExamAttemptQuery, ExamAttemptResponseDto>(
      new GetExamAttemptQuery(userId, attemptId),
    );
  }
}
