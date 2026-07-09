import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ToeicTestResponseDto } from '../../application/responses/toeic-test.response.dto';
import { ListToeicTestsQuery } from '../../application/queries/list-toeic-tests.query';
import { GetToeicTestByIdQuery } from '../../application/queries/get-toeic-test-by-id.query';

@ApiTags('TOEIC')
@Controller('toeic/tests')
export class ToeicController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get list of published TOEIC tests' })
  @ApiResponse({
    status: 200,
    description: 'List of tests',
    type: [ToeicTestResponseDto],
  })
  async listTests(): Promise<ToeicTestResponseDto[]> {
    return this.queryBus.execute<ListToeicTestsQuery, ToeicTestResponseDto[]>(
      new ListToeicTestsQuery(),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a TOEIC test including questions' })
  @ApiResponse({
    status: 200,
    description: 'Test details',
    type: ToeicTestResponseDto,
  })
  async getTestById(@Param('id') id: string): Promise<ToeicTestResponseDto> {
    return this.queryBus.execute<GetToeicTestByIdQuery, ToeicTestResponseDto>(
      new GetToeicTestByIdQuery(id),
    );
  }
}
