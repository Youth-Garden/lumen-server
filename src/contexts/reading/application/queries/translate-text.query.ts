export class TranslateTextQuery {
  constructor(
    public readonly text: string,
    public readonly from: string = 'en',
    public readonly to: string = 'vi',
  ) {}
}
