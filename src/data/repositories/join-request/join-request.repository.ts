import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { JoinRequest } from "../../entities/join-request/join-request.entity";
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

  findMany(params: JoinRequestQueryParams): Promise<JoinRequest[]> {
    const relations = params.relations ?? JoinRequestRepository.relations;
    return this.repository.find({ ...params, relations });
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria.where ?? criteria);
  }
}
