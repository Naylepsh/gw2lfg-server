export class User {
  constructor(
    readonly id: number,
    public username: string,
    public password: string,
    public apiKey: string
  ) {}
}
