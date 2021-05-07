import { compare } from "bcrypt";
import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { userRepositoryType } from "@loaders/typedi.constants";
import { loginDTO } from "./dtos/login.dto";
import { InvalidLoginDetailsError } from "./errors/invalid-login-details.error";
import { byUsername } from "@data/queries/user/by-username.query";

/**
 * Service for loging in user.
 */
@Service()
export class LoginService {
  constructor(
    @Inject(userRepositoryType) private readonly userRepository: IUserRepository
  ) {}

  /**
   * Checks whether given username and password match with any database users
   * returns the user on success
   */
  async login(dto: loginDTO) {
    const user = await this.userRepository.findOne(byUsername(dto.username));
    if (!user) throw new InvalidLoginDetailsError();

    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) throw new InvalidLoginDetailsError();

    return user;
  }
}
