import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { JoinRequest } from "../../entities/join-request.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { IJoinRequestRepository } from "./join-request.repository.interface";

@Service()
@EntityRepository(JoinRequest)
export class JoinRequestRepository
  extends IdentifiableEntityRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKey(
    userId: number,
    postId: number,
    roleId: number
  ): Promise<JoinRequest | undefined> {
    return this.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
        role: { id: roleId },
      },
    });
  }
}
