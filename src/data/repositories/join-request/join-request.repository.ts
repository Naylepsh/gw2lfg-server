import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { JoinRequest } from "../../entities/join-request.entity";
import { GenericRepository } from "../generic.repository";
import { IJoinRequestRepository } from "./join-request.repository.interface";

@Service()
@EntityRepository(JoinRequest)
export class JoinRequestRepository
  extends GenericRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined> {
    return this.findOne({ where: { userId, postId } });
  }
}
