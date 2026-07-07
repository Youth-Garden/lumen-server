import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { GetVocabularyWordByIdQuery } from '../../application/queries/get-vocabulary-word-by-id.query';
import { VocabularyWordResponseDto } from '../../application/responses/vocabulary-word.response.dto';
import { JwtAuthGuard } from '../../../../shared-kernel/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';

@ApiTags('Vocabulary')
@Controller('vocabulary/words')
export class VocabularyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vocabulary word' })
  @ApiResponse({
    status: 201,
    description: 'The word has been successfully created',
  })
  async createWord(
    @Body() dto: CreateVocabularyWordDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<
      CreateVocabularyWordCommand,
      string
    >(
      new CreateVocabularyWordCommand(
        dto.term,
        dto.phonetic,
        dto.audioUrl,
        dto.cefrLevel,
        dto.definitions,
      ),
    );
    return { id };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vocabulary word by ID' })
  @ApiResponse({
    status: 200,
    description: 'The word details',
    type: VocabularyWordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Word not found' })
  async getWord(@Param('id') id: string): Promise<VocabularyWordResponseDto> {
    return this.queryBus.execute<
      GetVocabularyWordByIdQuery,
      VocabularyWordResponseDto
    >(new GetVocabularyWordByIdQuery(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('decks')
  @ApiOperation({ summary: 'Create a new deck' })
  @ApiResponse({ status: 201, description: 'Deck created' })
  async createDeck(
    @Body() dto: CreateDeckDto,
    @CurrentUser() userId: string,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateDeckCommand, string>(
      new CreateDeckCommand(dto.name, dto.description, userId),
    );
    return { id };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('flashcards')
  @ApiOperation({ summary: 'Create a new flashcard' })
  @ApiResponse({ status: 201, description: 'Flashcard created' })
  async createFlashcard(
    @Body() dto: CreateFlashcardDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateFlashcardCommand, string>(
      new CreateFlashcardCommand(dto.deckId, dto.wordId),
    );
    return { id };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('flashcards/review')
  @ApiOperation({ summary: 'Review a flashcard (SM-2 algorithm)' })
  @ApiResponse({ status: 201, description: 'Flashcard reviewed' })
  async reviewFlashcard(
    @Body() dto: ReviewFlashcardDto,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute<ReviewFlashcardCommand, void>(
      new ReviewFlashcardCommand(dto.flashcardId, dto.grade, userId),
    );
  }
}
