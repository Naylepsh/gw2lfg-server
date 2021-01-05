import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { FindKeys } from "./find-keys";
import { IJoinRequestRepository } from "./join-request.repository.interface";

@Service()
@EntityRepository(JoinRequest)
export class JoinRequestRepository
  extends IdentifiableEntityRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKeys(keys: FindKeys): Promise<JoinRequest | undefined> {
    const where = this.createWhereQuery(keys);

    return this.findOne({ where });
  }

  private createWhereQuery(keys: FindKeys) {
    const { userId, postId, roleId } = keys;
    const user = userId ? { id: userId } : undefined;
    const post = postId ? { id: postId } : undefined;
    const role = roleId ? { id: roleId } : undefined;
    const where = { user, post, role };
    return where;
  }
}
