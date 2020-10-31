export class User {
  constructor(
    public username: string,
    public password: string,
    public apiKey: string
  ) {}

  equals(otherUser: User) {
    return this.username === otherUser.username;
  }
}
