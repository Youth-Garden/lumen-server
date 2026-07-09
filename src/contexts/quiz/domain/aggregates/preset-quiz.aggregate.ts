import { PresetQuestion } from '../entities/preset-question.entity';
import { AggregateRoot } from '@nestjs/cqrs';

export class PresetQuiz extends AggregateRoot {
  private _questions: PresetQuestion[] = [];

  private constructor(
    private readonly _id: string,
    private _title: string,
    private _description: string,
    private _isPublished: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  static create(
    id: string,
    title: string,
    description: string,
    isPublished: boolean = false,
  ): PresetQuiz {
    return new PresetQuiz(
      id,
      title,
      description,
      isPublished,
      new Date(),
      new Date(),
    );
  }

  get id(): string {
    return this._id;
  }
  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get isPublished(): boolean {
    return this._isPublished;
  }
  get questions(): PresetQuestion[] {
    return [...this._questions];
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateDetails(title: string, description: string): void {
    this._title = title;
    this._description = description;
    this._updatedAt = new Date();
  }

  setPublished(isPublished: boolean): void {
    this._isPublished = isPublished;
    this._updatedAt = new Date();
  }

  addQuestion(question: PresetQuestion): void {
    this._questions.push(question);
    this._updatedAt = new Date();
  }
}
