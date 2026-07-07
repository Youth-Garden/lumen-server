import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateVocabularyWordDto } from '../../application/dtos/create-vocabulary-word.dto';
import {
  CreateDeckDto,
  CreateFlashcardDto,
} from '../../application/dtos/deck-flashcard.dto';
import { ReviewFlashcardDto } from '../../application/dtos/review-flashcard.dto';
import { CreateVocabularyWordCommand } from '../../application/commands/create-vocabulary-word.command';
import { CreateDeckCommand } from '../../application/commands/create-deck.command';
import { CreateFlashcardCommand } from '../../application/commands/create-flashcard.command';
import { ReviewFlashcardCommand } from '../../application/commands/review-flashcard.command';
import { VocabularyWordResponseDto } from '../../application/responses/vocabulary-word.response.dto';
import { Inject, UseGuards, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../../../../shared-kernel/guards/jwt-auth.guard';
import type { IVocabularyWordRepository } from '../../domain/repositories/vocabulary-word.repository.interface';
import { VOCABULARY_WORD_REPOSITORY } from '../../domain/repositories/vocabulary-word.repository.interface';

@Controller('vocabulary/words')
export class VocabularyController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(VOCABULARY_WORD_REPOSITORY)
    private readonly repository: IVocabularyWordRepository,
  ) {}

  @Post()
  async createWord(
    @Body() dto: CreateVocabularyWordDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<
      CreateVocabularyWordCommand,
      string
    >(new CreateVocabularyWordCommand(dto));
    return { id };
  }

  @Get(':id')
  async getWord(@Param('id') id: string): Promise<VocabularyWordResponseDto> {
    const word = await this.repository.findById(id);
    if (!word) {
      throw new NotFoundException('Word not found');
    }

    // Manual mapping for demo, usually a query handler or separate read-model mapper is used
    return new VocabularyWordResponseDto({
      id: word.id,
      term: word.term,
      phonetic: word.phonetic,
      audioUrl: word.audioUrl,
      cefrLevel: word.cefrLevel,
      definitions: word.definitions.map((def) => ({
        id: def.id,
        partOfSpeech: def.partOfSpeech,
        definitionEn: def.definitionEn,
        translationVi: def.translationVi,
        examples: def.examples.map((ex) => ({
          id: ex.id,
          sentenceEn: ex.sentenceEn,
          translationVi: ex.translationVi,
        })),
      })),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('decks')
  async createDeck(
    @Body() dto: CreateDeckDto,
    @Req() req: FastifyRequest & { user?: { userId: string } },
  ): Promise<{ id: string }> {
    const authorId = req.user?.userId || 'unknown';
    const id = await this.commandBus.execute<CreateDeckCommand, string>(
      new CreateDeckCommand(dto, authorId),
    );
    return { id };
  }

  @UseGuards(JwtAuthGuard)
  @Post('flashcards')
  async createFlashcard(
    @Body() dto: CreateFlashcardDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateFlashcardCommand, string>(
      new CreateFlashcardCommand(dto),
    );
    return { id };
  }

  @UseGuards(JwtAuthGuard)
  @Post('flashcards/review')
  async reviewFlashcard(
    @Body() dto: ReviewFlashcardDto,
    @Req() req: FastifyRequest & { user?: { userId: string } },
  ): Promise<{ success: boolean }> {
    const userId = req.user?.userId || 'unknown';
    await this.commandBus.execute<ReviewFlashcardCommand, void>(
      new ReviewFlashcardCommand(dto, userId),
    );
    return { success: true };
  }
}
