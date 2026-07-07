import { Controller, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
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
  @ApiOperation({ summary: 'Tạo một bài Quiz mới' })
  @ApiResponse({ status: 201, description: 'Trả về ID của bài Quiz' })
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
  @ApiOperation({ summary: 'Nộp đáp án cho một câu hỏi' })
  @ApiResponse({ status: 201, description: 'Nộp thành công' })
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
  @ApiOperation({ summary: 'Kết thúc bài Quiz và tính điểm' })
  @ApiResponse({ status: 201, description: 'Trả về điểm số' })
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
