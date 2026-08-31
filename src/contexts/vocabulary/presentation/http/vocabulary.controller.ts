import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
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
import { UpdateVocabularyWordDto } from '../../application/dtos/update-vocabulary-word.dto';
import { UpdateDeckDto } from '../../application/dtos/update-deck.dto';
import { ReviewFlashcardDto } from '../../application/dtos/review-flashcard.dto';
import { CreateVocabularyWordCommand } from '../../application/commands/create-vocabulary-word.command';
import { CreateDeckCommand } from '../../application/commands/create-deck.command';
import { CreateFlashcardCommand } from '../../application/commands/create-flashcard.command';
import { ReviewFlashcardCommand } from '../../application/commands/review-flashcard.command';
import { UpdateVocabularyWordCommand } from '../../application/commands/update-vocabulary-word.command';
import { DeleteVocabularyWordCommand } from '../../application/commands/delete-vocabulary-word.command';
import { UpdateDeckCommand } from '../../application/commands/update-deck.command';
import { DeleteDeckCommand } from '../../application/commands/delete-deck.command';
import { DeleteFlashcardCommand } from '../../application/commands/delete-flashcard.command';
import { GetVocabularyWordByIdQuery } from '../../application/queries/get-vocabulary-word-by-id.query';
import { ListWordsQuery } from '../../application/queries/list-words.query';
import { ListDecksQuery } from '../../application/queries/list-decks.query';
import { GetDeckByIdQuery } from '../../application/queries/get-deck-by-id.query';
import { ListDueFlashcardsQuery } from '../../application/queries/list-due-flashcards.query';
import { VocabularyWordResponseDto } from '../../application/responses/vocabulary-word.response.dto';
import { WordListResponseDto } from '../../application/responses/word-list.response.dto';
import {
  DeckDetailResponseDto,
  DeckResponseDto,
} from '../../application/responses/deck.response.dto';
import { DueFlashcardResponseDto } from '../../application/responses/due-flashcard.response.dto';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { Query } from '@nestjs/common';
import { ListWordsFilterDto } from '../../application/dtos/list-words-filter.dto';

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

  @Put(':id')
  @ApiOperation({ summary: 'Update a vocabulary word' })
  @ApiParam({ name: 'id', description: 'The UUID of the word' })
  @ApiBody({ type: UpdateVocabularyWordDto })
  @ApiResponse({ status: 200, description: 'Word updated successfully.' })
  async updateWord(
    @Param('id') id: string,
    @Body() dto: UpdateVocabularyWordDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateVocabularyWordCommand(
        id,
        dto.term,
        dto.phonetic,
        dto.audioUrl,
        dto.cefrLevel,
        dto.definitions,
      ),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vocabulary word' })
  @ApiParam({ name: 'id', description: 'The UUID of the word' })
  @ApiResponse({ status: 200, description: 'Word deleted successfully.' })
  async deleteWord(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteVocabularyWordCommand(id));
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List vocabulary words' })
  @ApiResponse({ type: WordListResponseDto, status: 200 })
  async listWords(
    @Query() filterDto: ListWordsFilterDto,
  ): Promise<WordListResponseDto> {
    return this.queryBus.execute<ListWordsQuery, WordListResponseDto>(
      new ListWordsQuery(
        filterDto.page || 1,
        filterDto.limit || 20,
        filterDto.search,
        filterDto.sortBy,
        filterDto.sortOrder,
        filterDto.cefrLevel,
        filterDto.partOfSpeech,
      ),
    );
  }

  @Public()
  @Get('decks')
  @ApiOperation({ summary: 'List decks' })
  @ApiResponse({ type: [DeckResponseDto], status: 200 })
  async listDecks(
    @CurrentUser() userId?: string,
  ): Promise<DeckResponseDto[]> {
    return this.queryBus.execute<ListDecksQuery, DeckResponseDto[]>(
      new ListDecksQuery(userId || ''),
    );
  }

  @Public()
  @Get('decks/:id')
  @ApiOperation({ summary: 'Get deck details with flashcards' })
  @ApiResponse({ type: DeckDetailResponseDto, status: 200 })
  async getDeckById(
    @Param('id') id: string,
    @CurrentUser() userId?: string,
  ): Promise<DeckDetailResponseDto> {
    return this.queryBus.execute<GetDeckByIdQuery, DeckDetailResponseDto>(
      new GetDeckByIdQuery(id, userId || ''),
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
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateDeckCommand, string>(
      new CreateDeckCommand(dto.name, dto.description, userId),
    );
    return { id };
  }

  @Put('decks/:id')
  @ApiOperation({ summary: 'Update a deck' })
  @ApiParam({ name: 'id', description: 'The UUID of the deck' })
  @ApiBody({ type: UpdateDeckDto })
  @ApiResponse({ status: 200, description: 'Deck updated successfully.' })
  async updateDeck(
    @Param('id') id: string,
    @Body() dto: UpdateDeckDto,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateDeckCommand(id, userId, dto.name, dto.description),
    );
  }

  @Delete('decks/:id')
  @ApiOperation({ summary: 'Delete a deck' })
  @ApiParam({ name: 'id', description: 'The UUID of the deck' })
  @ApiResponse({ status: 200, description: 'Deck deleted successfully.' })
  async deleteDeck(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteDeckCommand(id, userId));
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
  ): Promise<{ id: string }> {
    const id = await this.commandBus.execute<CreateFlashcardCommand, string>(
      new CreateFlashcardCommand(dto.deckId, dto.wordId),
    );
    return { id };
  }

  @Delete('flashcards/:id')
  @ApiOperation({ summary: 'Delete a flashcard' })
  @ApiParam({ name: 'id', description: 'The UUID of the flashcard' })
  @ApiResponse({ status: 200, description: 'Flashcard deleted successfully.' })
  async deleteFlashcard(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteFlashcardCommand(id, userId));
  }

  @Get('flashcards/due')
  @ApiOperation({ summary: 'List due flashcards for today' })
  @ApiResponse({ type: [DueFlashcardResponseDto], status: 200 })
  async listDueFlashcards(
    @CurrentUser() userId: string,
    @Query('deckId') deckId?: string,
    @Query('limit') limit?: string,
  ): Promise<DueFlashcardResponseDto[]> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.queryBus.execute<
      ListDueFlashcardsQuery,
      DueFlashcardResponseDto[]
    >(new ListDueFlashcardsQuery(userId, deckId, limitNum));
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

  @Post('flashcards/review')
  @ApiOperation({
    summary: 'Review a flashcard (FSRS)',
    description:
      'Submit a review quality (1–4) for a flashcard. The FSRS spaced repetition algorithm will calculate the next review date and update the card metrics.',
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
      new ReviewFlashcardCommand(dto.flashcardId, dto.quality, userId),
    );
  }
}
