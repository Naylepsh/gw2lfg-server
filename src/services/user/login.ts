import { IUserRepository } from "../../data/repositories/user/user.repository.interface";
import { compare } from "bcrypt";

export class InvalidLoginDetailsError extends Error {}

export interface loginDTO {
  username: string;
  password: string;
}

export class LoginService {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(loginDto: loginDTO) {
    const user = await this.userRepository.findByUsername(loginDto.username);
    if (!user) throw new InvalidLoginDetailsError();

    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new InvalidLoginDetailsError();

    return user;
  }
}
