import { Controller, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
  GenerateQuizDto,
  SubmitAnswerDto,
} from '../../application/dtos/quiz.dto';
import { GenerateQuizCommand } from '../../application/commands/generate-quiz.command';
import { SubmitAnswerCommand } from '../../application/commands/submit-answer.command';
import { FinishQuizCommand } from '../../application/commands/finish-quiz.command';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import {
  GenerateQuizResponseDto,
  FinishQuizResponseDto,
} from '../../application/dtos/quiz.response.dto';

@ApiTags('Quiz')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a new quiz session',
    description:
      'Create a new quiz session based on the provided vocabulary word IDs or deck. Returns the quiz ID to be used for submitting answers.',
  })
  @ApiBody({ type: GenerateQuizDto })
  @ApiResponse({
    status: 201,
    description: 'Quiz generated successfully. Returns the quiz ID.',
    type: GenerateQuizResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid access token.',
  })
  async generateQuiz(
    @Body() dto: GenerateQuizDto,
    @CurrentUser() userId: string,
  ): Promise<GenerateQuizResponseDto> {
    const id = await this.commandBus.execute<GenerateQuizCommand, string>(
      new GenerateQuizCommand(dto, userId),
    );
    return new GenerateQuizResponseDto({ id });
  }

  @Post(':id/questions/:questionId/answers')
  @ApiOperation({
    summary: 'Submit an answer for a quiz question',
    description:
      'Submit the selected answer for a specific question in a quiz session. The answer is recorded but scoring is calculated when the quiz is finished.',
  })
  @ApiParam({
    name: 'id',
    description: 'Quiz session ID',
    example: 'uuid-string',
  })
  @ApiParam({
    name: 'questionId',
    description: 'Question ID within the quiz',
    example: 'uuid-string',
  })
  @ApiBody({ type: SubmitAnswerDto })
  @ApiResponse({ status: 201, description: 'Answer submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Quiz or question not found.' })
  async submitAnswer(
    @Param('id') quizId: string,
    @Param('questionId') questionId: string,
    @Body() dto: SubmitAnswerDto,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute<SubmitAnswerCommand, void>(
      new SubmitAnswerCommand(quizId, questionId, dto, userId),
    );
  }

  @Post(':id/finish')
  @ApiOperation({
    summary: 'Finish a quiz and calculate score',
    description:
      'Mark the quiz session as completed. The system calculates the final score based on all submitted answers and returns the result.',
  })
  @ApiParam({
    name: 'id',
    description: 'Quiz session ID',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: 201,
    description: 'Quiz finished. Returns the final score.',
    type: FinishQuizResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found or already finished.',
  })
  async finishQuiz(
    @Param('id') quizId: string,
    @CurrentUser() userId: string,
  ): Promise<FinishQuizResponseDto> {
    const score = await this.commandBus.execute<FinishQuizCommand, number>(
      new FinishQuizCommand(quizId, userId),
    );
    return new FinishQuizResponseDto({ score });
  }
}
