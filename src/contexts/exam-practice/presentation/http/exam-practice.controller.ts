import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared-kernel/guards/jwt-auth.guard';

import { StartExamAttemptDto } from '../../application/dtos/start-exam-attempt.dto';
import { SubmitExamAnswerDto } from '../../application/dtos/submit-exam-answer.dto';
import { ExamAttemptResponseDto } from '../../application/responses/exam-attempt.response.dto';

import { StartExamAttemptCommand } from '../../application/commands/start-exam-attempt.handler';
import { SubmitExamAnswerCommand } from '../../application/commands/submit-exam-answer.handler';
import { FinishExamAttemptCommand } from '../../application/commands/finish-exam-attempt.handler';
import { GetExamAttemptQuery } from '../../application/queries/get-exam-attempt.handler';

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
