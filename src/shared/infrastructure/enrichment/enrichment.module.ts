import { Module } from '@nestjs/common';
import { VocabularyEnricherService } from './services/vocabulary-enricher.service';

@Module({
  providers: [VocabularyEnricherService],
  exports: [VocabularyEnricherService],
})
export class EnrichmentModule {}
