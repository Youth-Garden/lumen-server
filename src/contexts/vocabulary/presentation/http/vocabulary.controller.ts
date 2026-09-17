import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { CreatedEntityResponseDto } from '../../../../shared/presentation/dtos/created-entity.response.dto';
import { CreateFlashcardCommand } from '../../application/commands/create-flashcard.command';
import { CreateFolderCommand } from '../../application/commands/create-folder.command';
import { CreateVocabularyWordCommand } from '../../application/commands/create-vocabulary-word.command';
import { DeleteFlashcardCommand } from '../../application/commands/delete-flashcard.command';
import { DeleteFolderCommand } from '../../application/commands/delete-folder.command';
import { DeleteVocabularyWordCommand } from '../../application/commands/delete-vocabulary-word.command';
import { ReviewFlashcardCommand } from '../../application/commands/review-flashcard.command';
import { UpdateFolderCommand } from '../../application/commands/update-folder.command';
import { UpdateVocabularyWordCommand } from '../../application/commands/update-vocabulary-word.command';
import { CreateVocabularyWordDto } from '../../application/dtos/create-vocabulary-word.dto';
import {
  CreateFlashcardDto,
  CreateFolderDto,
} from '../../application/dtos/folder-flashcard.dto';
import { ListDueFlashcardsDto } from '../../application/dtos/list-due-flashcards.dto';
import { ListFolderFlashcardsDto } from '../../application/dtos/list-folder-flashcards.dto';
import { ListWordsFilterDto } from '../../application/dtos/list-words-filter.dto';
import { ReviewFlashcardDto } from '../../application/dtos/review-flashcard.dto';
import { UpdateFolderDto } from '../../application/dtos/update-folder.dto';
import { UpdateVocabularyWordDto } from '../../application/dtos/update-vocabulary-word.dto';
import { GetFolderByIdQuery } from '../../application/queries/get-folder-by-id.query';
import { GetVocabularyOverviewQuery } from '../../application/queries/get-vocabulary-overview.query';
import { GetVocabularyWordByIdQuery } from '../../application/queries/get-vocabulary-word-by-id.query';
import { ListDueFlashcardsQuery } from '../../application/queries/list-due-flashcards.query';
import { ListFolderFlashcardsQuery } from '../../application/queries/list-folder-flashcards.query';
import { ListFolderTopicsQuery } from '../../application/queries/list-folder-topics.query';
import { ListFoldersQuery } from '../../application/queries/list-folders.query';
import { ListWordsQuery } from '../../application/queries/list-words.query';
import { DueFlashcardResponseDto } from '../../application/responses/due-flashcard.response.dto';
import { FolderTopicResponseDto } from '../../application/responses/folder-topic.response.dto';
import {
  FolderDetailResponseDto,
  FolderFlashcardsResponseDto,
  FolderResponseDto,
} from '../../application/responses/folder.response.dto';
import { VocabularyOverviewResponseDto } from '../../application/responses/vocabulary-overview.response.dto';
import { VocabularyWordResponseDto } from '../../application/responses/vocabulary-word.response.dto';
import { WordListResponseDto } from '../../application/responses/word-list.response.dto';

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
    type: CreatedEntityResponseDto,
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
  ): Promise<CreatedEntityResponseDto> {
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
    return new CreatedEntityResponseDto(id);
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
        filterDto.page,
        filterDto.limit,
        filterDto.search,
        filterDto.sortBy,
        filterDto.sortOrder,
        filterDto.cefrLevel,
        filterDto.partOfSpeech,
      ),
    );
  }

  @Get('folders')
  @ApiOperation({ summary: 'List folders' })
  @ApiResponse({ type: [FolderResponseDto], status: 200 })
  async listFolders(
    @CurrentUser() userId: string,
  ): Promise<FolderResponseDto[]> {
    return this.queryBus.execute<ListFoldersQuery, FolderResponseDto[]>(
      new ListFoldersQuery(userId),
    );
  }

  @Get('folders/:id')
  @ApiOperation({ summary: 'Get folder summary (no flashcards)' })
  @ApiResponse({ type: FolderDetailResponseDto, status: 200 })
  async getFolderById(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<FolderDetailResponseDto> {
    return this.queryBus.execute<GetFolderByIdQuery, FolderDetailResponseDto>(
      new GetFolderByIdQuery(id, userId),
    );
  }

  @Get('folders/:id/topics')
  @ApiOperation({ summary: 'List topics in a folder with aggregate stats' })
  @ApiParam({ name: 'id', description: 'Folder UUID' })
  @ApiResponse({ type: [FolderTopicResponseDto], status: 200 })
  async listFolderTopics(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<FolderTopicResponseDto[]> {
    return this.queryBus.execute<
      ListFolderTopicsQuery,
      FolderTopicResponseDto[]
    >(new ListFolderTopicsQuery(id, userId));
  }

  @Get('folders/:id/flashcards')
  @ApiOperation({ summary: 'List flashcards in a folder, filtered by topic' })
  @ApiParam({ name: 'id', description: 'Folder UUID' })
  @ApiResponse({ type: FolderFlashcardsResponseDto, status: 200 })
  async listFolderFlashcards(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Query() queryDto: ListFolderFlashcardsDto,
  ): Promise<FolderFlashcardsResponseDto> {
    return this.queryBus.execute<
      ListFolderFlashcardsQuery,
      FolderFlashcardsResponseDto
    >(
      new ListFolderFlashcardsQuery(
        id,
        userId,
        queryDto.topic,
        queryDto.page,
        queryDto.limit,
      ),
    );
  }

  @Post('folders')
  @ApiOperation({
    summary: 'Create a flashcard folder',
    description:
      'Create a new personal folder to organize flashcards. The folder is owned by the authenticated user.',
  })
  @ApiBody({ type: CreateFolderDto })
  @ApiResponse({
    status: 201,
    description: 'Folder created successfully. Returns the new folder ID.',
    type: CreatedEntityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createFolder(
    @Body() dto: CreateFolderDto,
    @CurrentUser() userId: string,
  ): Promise<CreatedEntityResponseDto> {
    const id = await this.commandBus.execute<CreateFolderCommand, string>(
      new CreateFolderCommand(dto.name, dto.description, userId),
    );
    return new CreatedEntityResponseDto(id);
  }

  @Put('folders/:id')
  @ApiOperation({ summary: 'Update a folder' })
  @ApiParam({ name: 'id', description: 'The UUID of the folder' })
  @ApiBody({ type: UpdateFolderDto })
  @ApiResponse({ status: 200, description: 'Folder updated successfully.' })
  async updateFolder(
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateFolderCommand(id, userId, dto.name, dto.description),
    );
  }

  @Delete('folders/:id')
  @ApiOperation({ summary: 'Delete a folder' })
  @ApiParam({ name: 'id', description: 'The UUID of the folder' })
  @ApiResponse({ status: 200, description: 'Folder deleted successfully.' })
  async deleteFolder(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteFolderCommand(id, userId));
  }

  @Post('flashcards')
  @ApiOperation({
    summary: 'Add a flashcard to a folder',
    description:
      'Link a vocabulary word to a folder as a flashcard. The flashcard will be initialized with SM-2 algorithm defaults for spaced repetition.',
  })
  @ApiBody({ type: CreateFlashcardDto })
  @ApiResponse({
    status: 201,
    description:
      'Flashcard created successfully. Returns the new flashcard ID.',
    type: CreatedEntityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createFlashcard(
    @Body() dto: CreateFlashcardDto,
  ): Promise<CreatedEntityResponseDto> {
    const id = await this.commandBus.execute<CreateFlashcardCommand, string>(
      new CreateFlashcardCommand(dto.folderId, dto.wordId),
    );
    return new CreatedEntityResponseDto(id);
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
    @Query() queryDto: ListDueFlashcardsDto,
  ): Promise<DueFlashcardResponseDto[]> {
    return this.queryBus.execute<
      ListDueFlashcardsQuery,
      DueFlashcardResponseDto[]
    >(
      new ListDueFlashcardsQuery(
        userId,
        queryDto.folderId,
        queryDto.limit,
        queryDto.includeNew ?? false,
      ),
    );
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get vocabulary overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Vocabulary overview statistics retrieved successfully.',
    type: VocabularyOverviewResponseDto,
  })
  async getOverview(
    @CurrentUser() userId: string,
  ): Promise<VocabularyOverviewResponseDto> {
    return this.queryBus.execute<
      GetVocabularyOverviewQuery,
      VocabularyOverviewResponseDto
    >(new GetVocabularyOverviewQuery(userId));
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
    description: 'The UUID of the vocabulary word to retrieve.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the full details of the vocabulary word.',
    type: VocabularyWordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Word not found.' })
  async getWordById(
    @Param('id') id: string,
  ): Promise<VocabularyWordResponseDto> {
    return this.queryBus.execute<
      GetVocabularyWordByIdQuery,
      VocabularyWordResponseDto
    >(new GetVocabularyWordByIdQuery(id));
  }

  @Post('flashcards/review')
  @ApiOperation({
    summary: 'Submit a flashcard review (SM-2 spaced repetition)',
    description:
      'Record a review result for a flashcard. Quality is an integer between 1 and 4. Returns the updated schedule.',
  })
  @ApiBody({ type: ReviewFlashcardDto })
  @ApiResponse({
    status: 200,
    description: 'Flashcard review recorded and next due date updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid review quality.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Flashcard not found.' })
  async reviewFlashcard(
    @Body() dto: ReviewFlashcardDto,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new ReviewFlashcardCommand(
        dto.flashcardId,
        dto.isCorrect,
        dto.isFastTrackKnown,
        dto.isFastTrackTempMemory,
        userId,
      ),
    );
  }
}
