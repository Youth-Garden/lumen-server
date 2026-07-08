import { CreateArticleDto } from '../dtos/reading.dto';

export class CreateArticleCommand {
  constructor(
    public readonly dto: CreateArticleDto,
    public readonly userId: string,
  ) {}
}
