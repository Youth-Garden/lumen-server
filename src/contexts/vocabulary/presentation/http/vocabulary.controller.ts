import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
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
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { Public } from '../../../../shared-kernel/decorators/public.decorator';

@ApiTags('Vocabulary')
@Controller('vocabulary/words')
export class VocabularyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Create a new vocabulary word',
    description:
      'Add a new word to the vocabulary bank. Requires authentication. Includes phonetics, audio, CEFR level, definitions and example sentences.',
  })
  @ApiBody({ type: CreateVocabularyWordDto })
  @ApiResponse({
    status: 201,
    description: 'Word created successfully. Returns the new word ID.',
    schema: { example: { id: 'uuid-string' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error in the request body.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid access token.',
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

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get a vocabulary word by ID',
    description:
      'Retrieve the full details of a single vocabulary word including definitions and examples. This endpoint is publicly accessible.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the vocabulary word',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the vocabulary word details.',
    type: VocabularyWordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Word not found.' })
  async getWord(@Param('id') id: string): Promise<VocabularyWordResponseDto> {
    return this.queryBus.execute<
      GetVocabularyWordByIdQuery,
      VocabularyWordResponseDto
    >(new GetVocabularyWordByIdQuery(id));
  }

  @ApiBearerAuth()
  @Post('decks')
  @ApiOperation({
    summary: 'Create a flashcard deck',
    description:
      'Create a new personal deck to organize flashcards. The deck is owned by the authenticated user.',
  })
  @ApiBody({ type: CreateDeckDto })
  @ApiResponse({
    status: 201,
    description: 'Deck created successfully. Returns the new deck ID.',
    schema: { example: { id: 'uuid-string' } },
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @Post('flashcards')
  @ApiOperation({
    summary: 'Add a flashcard to a deck',
    description:
      'Link a vocabulary word to a deck as a flashcard. The flashcard will be initialized with SM-2 algorithm defaults for spaced repetition.',
  })
  @ApiBody({ type: CreateFlashcardDto })
  @ApiResponse({
    status: 201,
    description:
      'Flashcard created successfully. Returns the new flashcard ID.',
    schema: { example: { id: 'uuid-string' } },
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createFlashcard(
    @Body() dto: CreateFlashcardDto,
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateFlashcardCommand, string>(
      new CreateFlashcardCommand(dto.deckId, dto.wordId),
    );
    return { id };
  }

  @ApiBearerAuth()
  @Post('flashcards/review')
  @ApiOperation({
    summary: 'Review a flashcard (SM-2)',
    description:
      'Submit a review grade (0–5) for a flashcard. The SM-2 spaced repetition algorithm will calculate the next review date and update the easiness factor.',
  })
  @ApiBody({ type: ReviewFlashcardDto })
  @ApiResponse({
    status: 201,
    description: 'Review submitted. Next review date calculated.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Flashcard not found or does not belong to this user.',
  })
  async reviewFlashcard(
    @Body() dto: ReviewFlashcardDto,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute<ReviewFlashcardCommand, void>(
      new ReviewFlashcardCommand(dto.flashcardId, dto.grade, userId),
    );
  }
}
