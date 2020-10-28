export class User {
  constructor(
    protected readonly id: number,
    public username: string,
    public password: string,
    public apiKey: string
  ) {}
}
