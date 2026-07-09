import { GrammarTopic } from '../aggregates/grammar-topic.aggregate';
import { PaginatedResult } from '../../../../shared-kernel/interfaces/paginated-result.interface';

export const GRAMMAR_TOPIC_REPOSITORY = Symbol('GRAMMAR_TOPIC_REPOSITORY');

export interface IGrammarTopicRepository {
  save(topic: GrammarTopic): Promise<void>;
  findById(id: string): Promise<GrammarTopic | null>;
  findAll(filter: {
    search?: string;
    cefrLevel?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<GrammarTopic>>;
}
