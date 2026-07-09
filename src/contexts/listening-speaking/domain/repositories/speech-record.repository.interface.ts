import { SpeechRecord } from '../entities/speech-record.entity';

export const SPEECH_RECORD_REPOSITORY = Symbol('SPEECH_RECORD_REPOSITORY');

export interface ISpeechRecordRepository {
  findById(id: string): Promise<SpeechRecord | null>;
  findByUserId(userId: string): Promise<SpeechRecord[]>;
  save(record: SpeechRecord): Promise<void>;
}
