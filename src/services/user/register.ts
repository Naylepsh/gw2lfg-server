import { hash } from "bcrypt";
import { Inject, Service } from "typedi";
import { User } from "@data/entities/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { userRepositoryType } from "@loaders/typedi.constants";
import { EntityAlreadyExistsError } from "../errors/entity-already-exists.error";

export class UsernameTakenError extends EntityAlreadyExistsError {}

@Service()
export class RegisterService {
  constructor(
    @Inject(userRepositoryType) private readonly userRepository: IUserRepository
  ) {}

  async register(user: User) {
    if (await this.isUsernameTaken(user.username)) {
      throw new UsernameTakenError();
    }

    const _user = { ...user };
    await this.hashUserPassword(_user);
    return await this.userRepository.save(_user);
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
