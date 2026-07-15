import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('articles')
export class ArticleEntity extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('uuid')
  userId: string;
}
