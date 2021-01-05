import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { JoinRequestRelationKeys } from "./join-request-relation-keys";
import { IJoinRequestRepository } from "./join-request.repository.interface";

@Service()
@EntityRepository(JoinRequest)
export class JoinRequestRepository
  extends IdentifiableEntityRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKeys(keys: JoinRequestRelationKeys): Promise<JoinRequest[]> {
    const where = this.createWhereQuery(keys);

    return this.findMany({ where });
  }

  private createWhereQuery(keys: JoinRequestRelationKeys) {
    const { userId, postId, roleId } = keys;
    const user = userId ? { id: userId } : undefined;
    const post = postId ? { id: postId } : undefined;
    const role = roleId ? { id: roleId } : undefined;
    const where = { user, post, role };
    return where;
  }
}
