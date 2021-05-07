import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { JoinRequestRelationKeys } from "./join-request-relation-keys";
import {
  IJoinRequestRepository,
  JoinRequestQueryParams,
} from "./join-request.repository.interface";

@Service()
@EntityRepository(JoinRequest)
export class JoinRequestRepository
  extends AbstractRepository<JoinRequest>
  implements IJoinRequestRepository {
  private static relations = ["user", "post", "role"];

  save(joinRequest: JoinRequest): Promise<JoinRequest> {
    return this.repository.save(joinRequest);
  }

  findOne(params: JoinRequestQueryParams): Promise<JoinRequest | undefined> {
    const relations = params.relations ?? JoinRequestRepository.relations;
    return this.repository.findOne({ ...params, relations });
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria.where ?? criteria);
  }

  async findByKeys(keys: JoinRequestRelationKeys): Promise<JoinRequest[]> {
    const where = this.createWhereQuery(keys);

    // find join requests matching where query and populate relations
    return this.repository.find({
      where,
      relations: JoinRequestRepository.relations,
    });
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
