import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToeicTestEntity } from '../../infrastructure/typeorm/entities/toeic-test.entity';
import { ToeicTestResponseDto } from '../dtos/toeic-test.response.dto';

export class ListToeicTestsQuery implements IQuery {}

@QueryHandler(ListToeicTestsQuery)
export class ListToeicTestsHandler implements IQueryHandler<
  ListToeicTestsQuery,
  ToeicTestResponseDto[]
> {
  constructor(
    @InjectRepository(ToeicTestEntity)
    private readonly testRepo: Repository<ToeicTestEntity>,
  ) {}

  async execute(): Promise<ToeicTestResponseDto[]> {
    const tests = await this.testRepo.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });

    return tests.map((test) => {
      const dto = new ToeicTestResponseDto();
      dto.id = test.id;
      dto.title = test.title;
      dto.description = test.description;
      dto.isPublished = test.isPublished;
      dto.createdAt = test.createdAt;
      return dto;
    });
  }
}
