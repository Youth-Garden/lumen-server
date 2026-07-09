import { AggregateRoot } from '@nestjs/cqrs';
import { GrammarLesson } from '../entities/grammar-lesson.entity';

export class GrammarTopic extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private _title: string,
    private _description: string,
    private _cefrLevel: string,
    private _lessons: GrammarLesson[],
  ) {
    super();
  }

  static create(
    id: string,
    title: string,
    description: string,
    cefrLevel: string,
    lessons: GrammarLesson[] = [],
  ): GrammarTopic {
    return new GrammarTopic(id, title, description, cefrLevel, lessons);
  }

  static restore(
    id: string,
    title: string,
    description: string,
    cefrLevel: string,
    lessons: GrammarLesson[],
  ): GrammarTopic {
    return new GrammarTopic(id, title, description, cefrLevel, lessons);
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

  get cefrLevel(): string {
    return this._cefrLevel;
  }

  get lessons(): GrammarLesson[] {
    return this._lessons;
  }

  public updateDetails(
    title: string,
    description: string,
    cefrLevel: string,
  ): void {
    this._title = title;
    this._description = description;
    this._cefrLevel = cefrLevel;
  }

  public addLesson(lesson: GrammarLesson): void {
    this._lessons.push(lesson);
    // Ensure lessons are sorted by orderIndex
    this._lessons.sort((a, b) => a.orderIndex - b.orderIndex);
  }
}
