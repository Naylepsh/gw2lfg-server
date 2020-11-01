import { IUserRepository } from "../../repositories/user.repository";
import { Compare } from "../../utils/hashing/hashing.types";

export class InvalidLoginDetailsError extends Error {}

export interface loginDTO {
  username: string;
  password: string;
}

export const login = async (
  loginDto: loginDTO,
  userRepository: IUserRepository,
  comparePassword: Compare
) => {
  const user = await userRepository.findByUsername(loginDto.username);
  if (!user) throw new InvalidLoginDetailsError();

  const isPasswordValid = await comparePassword(
    loginDto.password,
    user.password
  );
  if (!isPasswordValid) throw new InvalidLoginDetailsError();

  return user;
};
