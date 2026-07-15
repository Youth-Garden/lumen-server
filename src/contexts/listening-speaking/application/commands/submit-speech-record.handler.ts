import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SubmitSpeechRecordCommand } from './submit-speech-record.command';
import { SPEECH_RECORD_REPOSITORY } from '../../domain/repositories/speech-record.repository.interface';
import type { ISpeechRecordRepository } from '../../domain/repositories/speech-record.repository.interface';
import { SPEAKING_TASK_REPOSITORY } from '../../domain/repositories/speaking-task.repository.interface';
import type { ISpeakingTaskRepository } from '../../domain/repositories/speaking-task.repository.interface';
import { SpeechRecord } from '../../domain/entities/speech-record.entity';
import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { ListeningSpeakingEx } from '../../domain/exceptions/listening-speaking.exception';
import { SpeechRecordResponseDto } from '../responses/speech-record.response.dto';
import { SpeakingTaskCompletedEvent } from '../../../../shared/domain/events/speaking-task-completed.event';

@CommandHandler(SubmitSpeechRecordCommand)
export class SubmitSpeechRecordHandler implements ICommandHandler<
  SubmitSpeechRecordCommand,
  SpeechRecordResponseDto
> {
  constructor(
    @Inject(SPEECH_RECORD_REPOSITORY)
    private readonly recordRepo: ISpeechRecordRepository,
    @Inject(SPEAKING_TASK_REPOSITORY)
    private readonly taskRepo: ISpeakingTaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: SubmitSpeechRecordCommand,
  ): Promise<SpeechRecordResponseDto> {
    const task = await this.taskRepo.findById(command.speakingTaskId);
    if (!task) {
      throw new AppException(ListeningSpeakingEx.SpeakingTaskNotFound);
    }

    // MOCK: AI Speech-to-Text Grading (Simulate scoring)
    const mockScore = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    const mockFeedback = 'Mock AI feedback based on pronunciation accuracy.';

    const record = new SpeechRecord(
      uuidv4(),
      command.userId,
      task.id,
      command.audioUrl,
      mockScore,
      mockFeedback,
    );

    await this.recordRepo.save(record);

    // Emit event if score is decent
    if (record.accuracyScore > 60) {
      this.eventBus.publish(
        new SpeakingTaskCompletedEvent(
          command.userId,
          task.id,
          record.accuracyScore,
        ),
      );
    }

    return new SpeechRecordResponseDto(record);
  }
}
