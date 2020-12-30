import { compare } from "bcrypt";
import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { userRepositoryType } from "@loaders/typedi.constants";
import { loginDTO } from "./dtos/login.dto";
import { InvalidLoginDetailsError } from "./errors/invalid-login-details.error";

@Service()
export class LoginService {
  constructor(
    @Inject(userRepositoryType) private readonly userRepository: IUserRepository
  ) {}

  async login(loginDto: loginDTO) {
    const user = await this.userRepository.findByUsername(loginDto.username);
    if (!user) throw new InvalidLoginDetailsError();

    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new InvalidLoginDetailsError();

    return user;
  }
}
