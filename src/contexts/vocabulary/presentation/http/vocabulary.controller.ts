import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
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
import { ListWordsQuery } from '../../application/queries/list-words.query';
import { ListDecksQuery } from '../../application/queries/list-decks.query';
import { GetDeckByIdQuery } from '../../application/queries/get-deck-by-id.query';
import { ListDueFlashcardsQuery } from '../../application/queries/list-due-flashcards.query';
import { VocabularyWordResponseDto } from '../../application/responses/vocabulary-word.response.dto';
import { WordListResponseDto } from '../../application/queries/list-words.handler';
import { DeckResponseDto } from '../../application/queries/list-decks.handler';
import { DeckDetailResponseDto } from '../../application/queries/get-deck-by-id.handler';
import { DueFlashcardResponseDto } from '../../application/queries/list-due-flashcards.handler';
import { IdResponseDto } from '../../../../shared-kernel/dto/id-response.dto';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { Public } from '../../../../shared-kernel/decorators/public.decorator';
import { Query as QueryParam } from '@nestjs/common';

@ApiTags('Vocabulary')
@Controller('vocabulary/words')
export class VocabularyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
  ): Promise<IdResponseDto> {
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
    return new IdResponseDto(id);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List vocabulary words' })
  @ApiResponse({ type: WordListResponseDto, status: 200 })
  async listWords(
    @QueryParam('page') page: number = 1,
    @QueryParam('limit') limit: number = 20,
    @QueryParam('search') search?: string,
    @QueryParam('cefrLevel') cefrLevel?: string,
  ): Promise<WordListResponseDto> {
    return this.queryBus.execute<ListWordsQuery, WordListResponseDto>(
      new ListWordsQuery(page, limit, search, cefrLevel),
    );
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

  @Get('decks')
  @ApiOperation({ summary: 'List user decks' })
  @ApiResponse({ type: [DeckResponseDto], status: 200 })
  async listDecks(@CurrentUser() userId: string): Promise<DeckResponseDto[]> {
    return this.queryBus.execute<ListDecksQuery, DeckResponseDto[]>(
      new ListDecksQuery(userId),
    );
  }

  @Get('decks/:id')
  @ApiOperation({ summary: 'Get deck details with flashcards' })
  @ApiResponse({ type: DeckDetailResponseDto, status: 200 })
  async getDeckById(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<DeckDetailResponseDto> {
    return this.queryBus.execute<GetDeckByIdQuery, DeckDetailResponseDto>(
      new GetDeckByIdQuery(id, userId),
    );
  }

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
  ): Promise<IdResponseDto> {
    const id = await this.commandBus.execute<CreateDeckCommand, string>(
      new CreateDeckCommand(dto.name, dto.description, userId),
    );
    return new IdResponseDto(id);
  }

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
  ): Promise<IdResponseDto> {
    const id = await this.commandBus.execute<CreateFlashcardCommand, string>(
      new CreateFlashcardCommand(dto.deckId, dto.wordId),
    );
    return new IdResponseDto(id);
  }

  @Get('flashcards/due')
  @ApiOperation({ summary: 'List due flashcards for today' })
  @ApiResponse({ type: [DueFlashcardResponseDto], status: 200 })
  async listDueFlashcards(
    @CurrentUser() userId: string,
  ): Promise<DueFlashcardResponseDto[]> {
    return this.queryBus.execute<
      ListDueFlashcardsQuery,
      DueFlashcardResponseDto[]
    >(new ListDueFlashcardsQuery(userId));
  }

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
