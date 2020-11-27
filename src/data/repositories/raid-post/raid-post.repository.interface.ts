import { RaidPost } from "../../entities/raid-post.entitity";
import { IIdentifiableEntityRepository } from "../repository.interface";

export interface IRaidPostRepository
  extends IIdentifiableEntityRepository<RaidPost> {}
