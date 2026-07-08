import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from './infrastructure/typeorm/entities/material.entity';
import { TranscriptEntity } from './infrastructure/typeorm/entities/transcript.entity';
import { ActivityLogEntity } from './infrastructure/typeorm/entities/activity-log.entity';

import { MaterialController } from './presentation/http/material.controller';
import {
  ListMaterialsHandler,
  GetMaterialByIdHandler,
} from './application/queries/get-material.query';
import { SubmitDictationHandler } from './application/commands/submit-dictation.command';
import { CqrsModule } from '@nestjs/cqrs';

const QueryHandlers = [ListMaterialsHandler, GetMaterialByIdHandler];
const CommandHandlers = [SubmitDictationHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      MaterialEntity,
      TranscriptEntity,
      ActivityLogEntity,
    ]),
  ],
  controllers: [MaterialController],
  providers: [...QueryHandlers, ...CommandHandlers],
  exports: [TypeOrmModule],
})
export class MaterialModule {}
