import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import type { IVocabularyWordRepository } from '../../../domain/repositories/vocabulary-word.repository.interface';
import { VocabularyWord } from '../../../domain/aggregates/vocabulary-word.aggregate';
import { VocabularyDefinition } from '../../../domain/entities/vocabulary-definition.entity';
import { VocabularyExample } from '../../../domain/entities/vocabulary-example.entity';
import { WordEntity } from '../entities/word.entity';
import { DefinitionEntity } from '../entities/definition.entity';
import { ExampleEntity } from '../entities/example.entity';

@Injectable()
export class VocabularyWordRepository implements IVocabularyWordRepository {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepo: Repository<WordEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<VocabularyWord | null> {
    const entity = await this.wordRepo.findOne({
      where: { id },
      relations: { definitions: { examples: true } },
    });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByTerm(term: string): Promise<VocabularyWord | null> {
    const entity = await this.wordRepo.findOne({
      where: { term },
      relations: { definitions: { examples: true } },
    });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findRandom(limit: number): Promise<VocabularyWord[]> {
    const entities = await this.wordRepo
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.definitions', 'definition')
      .leftJoinAndSelect('definition.examples', 'example')
      .orderBy('RANDOM()')
      .take(limit)
      .getMany();

    return entities.map((entity) => this.toDomain(entity));
  }

  async save(word: VocabularyWord): Promise<void> {
    const wordEntity = new WordEntity();
    wordEntity.id = word.id;
    wordEntity.term = word.term;
    wordEntity.phonetic = word.phonetic;
    wordEntity.audioUrl = word.audioUrl;
    wordEntity.cefrLevel = word.cefrLevel;

    wordEntity.definitions = word.definitions.map(
      (def: VocabularyDefinition) => {
        const defEntity = new DefinitionEntity();
        defEntity.id = def.id;
        defEntity.wordId = word.id;
        defEntity.partOfSpeech = def.partOfSpeech;
        defEntity.definitionEn = def.definitionEn;
        defEntity.translationVi = def.translationVi;

        defEntity.examples = def.examples.map((ex: VocabularyExample) => {
          const exEntity = new ExampleEntity();
          exEntity.id = ex.id;
          exEntity.definitionId = def.id;
          exEntity.sentenceEn = ex.sentenceEn;
          exEntity.translationVi = ex.translationVi;
          return exEntity;
        });
        return defEntity;
      },
    );

    await this.wordRepo.save(wordEntity);
  }

  private toDomain(entity: WordEntity): VocabularyWord {
    const definitions =
      entity.definitions?.map((defEntity) => {
        const def = new VocabularyDefinition(
          defEntity.id,
          defEntity.partOfSpeech,
          defEntity.definitionEn,
          defEntity.translationVi,
        );
        defEntity.examples?.forEach((exEntity) => {
          def.addExample(
            new VocabularyExample(
              exEntity.id,
              exEntity.sentenceEn,
              exEntity.translationVi,
            ),
          );
        });
        return def;
      }) || [];

    return VocabularyWord.restore(
      entity.id,
      entity.term,
      entity.phonetic,
      entity.audioUrl,
      entity.cefrLevel,
      definitions,
    );
  }
}
