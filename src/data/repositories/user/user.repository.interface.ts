import { IIdentifiableEntityRepository } from "../repository.interface";
import { User } from "../../entities/user.entity";

export interface IUserRepository extends IIdentifiableEntityRepository<User> {
  findByUsername(username: string): Promise<User | undefined>;
}