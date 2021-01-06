import { hash } from "bcrypt";
import { Inject, Service } from "typedi";
import { User } from "@root/data/entities/user/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  checkApiKeyValidityServiceType,
  userRepositoryType,
} from "@loaders/typedi.constants";
import { UsernameTakenError } from "./errors/username-taken.error";
import { ICheckApiKeyValidityService } from "../gw2-api/api-key/api-key-check.gw2-api.service";
import { InvalidApiKeyError } from "./errors/invalid-api-key.error";

@Service()
export class RegisterService {
  constructor(
    @Inject(userRepositoryType)
    private readonly userRepository: IUserRepository,
    @Inject(checkApiKeyValidityServiceType)
    private readonly checkApiKeyService: ICheckApiKeyValidityService
  ) {}

  async register(user: User) {
    const [isUsernameTaken, isValidApiKey] = await Promise.all([
      this.isUsernameTaken(user.username),
      this.checkApiKeyService.isValid(user.apiKey),
    ]);
    if (isUsernameTaken) {
      throw new UsernameTakenError();
    }
    if (!isValidApiKey) {
      throw new InvalidApiKeyError();
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
