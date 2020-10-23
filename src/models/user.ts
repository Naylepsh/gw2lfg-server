export class User {
  id: number;
  username!: string;
  password!: string;
  apiKey: string;

  constructor(username: string, password: string, apiKey: string) {
    this.username = username;
    this.password = password;
    this.apiKey = apiKey;
  }
}
