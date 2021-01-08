import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { IdentifiableEntityRepository } from "../generic-identifiable-entity.repository";
import { JoinRequestRelationKeys } from "./join-request-relation-keys";
import { IJoinRequestRepository } from "./join-request.repository.interface";

@Service()
@EntityRepository(JoinRequest)
export class JoinRequestRepository
  extends IdentifiableEntityRepository<JoinRequest>
  implements IJoinRequestRepository {
  private static relations = ["user", "post", "role"];

  async findByKeys(keys: JoinRequestRelationKeys): Promise<JoinRequest[]> {
    const where = this.createWhereQuery(keys);

    // find join requests matching where query and populate relations
    return this.findMany({ where, relations: JoinRequestRepository.relations });
  }

  // turns optional relations keys into where-query
  private createWhereQuery(keys: JoinRequestRelationKeys) {
    const { userId, postId, roleId } = keys;

    let where: { [key: string]: any } = {};
    if (userId) {
      where.user = { id: userId };
    }
    if (postId) {
      where.post = { id: postId };
    }
    if (roleId) {
      where.role = { id: roleId };
    }

    return where;
  }
}
