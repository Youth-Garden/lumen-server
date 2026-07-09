import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ReadingController } from './presentation/http/reading.controller';
import {
  TranslateTextHandler,
  TRANSLATION_PORT,
} from './application/handlers/translate-text.handler';
import { MyMemoryTranslationAdapter } from './infrastructure/adapters/mymemory-translation.adapter';

@Module({
  imports: [CqrsModule],
  controllers: [ReadingController],
  providers: [
    TranslateTextHandler,
    {
      provide: TRANSLATION_PORT,
      useClass: MyMemoryTranslationAdapter,
    },
  ],
})
export class ReadingModule {}
