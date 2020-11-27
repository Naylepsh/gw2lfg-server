import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../repositories/user.repository";
import { hash } from "bcrypt";
import { Service } from "typedi";

export class UsernameTakenError extends Error {}

@Service()
export class RegisterService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(user: User) {
    if (await this.isUsernameTaken(user.username)) {
      throw new UsernameTakenError();
    }

    const _user = { ...user };
    await this.hashUserPassword(_user);
    await this.userRepository.save(_user);
  }

  private async isUsernameTaken(username: string) {
    return !!(await this.userRepository.findByUsername(username));
  }

  private async hashUserPassword(user: User) {
    const salt = 6;
    const hashedPassword = await hash(user.password, salt);
    user.password = hashedPassword;
  }
}
