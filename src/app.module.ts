import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './contexts/iam/iam.module';
import { DatabaseModule } from './shared-kernel/infrastructure/database/database.module';
import { VocabularyModule } from './contexts/vocabulary/vocabulary.module';

@Module({
  imports: [IamModule, VocabularyModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
