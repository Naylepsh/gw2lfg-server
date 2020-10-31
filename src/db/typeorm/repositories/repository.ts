import { Repository } from "typeorm";
import { IRepository } from "../../repository";
import { Mapper } from "../mappers/map.type";

export class MappingRepository<DomainModel, PersistenceModel>
  implements IRepository<DomainModel> {
  constructor(
    private toPersistence: Mapper<DomainModel, PersistenceModel>,
    private toDomain: Mapper<PersistenceModel, DomainModel>,
    private repository: Repository<PersistenceModel>
  ) {}

  async save(model: DomainModel) {
    const persistenceModel = this.toPersistence(model);
    const savedModel = await this.repository.save(persistenceModel);
    return this.toDomain(savedModel);
  }

  async findById(id: number): Promise<DomainModel | null> {
    const model = await this.repository.findOne(id);
    return model ? this.toDomain(model) : null;
  }
}
