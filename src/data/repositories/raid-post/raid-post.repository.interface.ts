import { RaidPost } from "../../entities/raid-post/raid-post.entitity";
import { IIdentifiableEntityRepository } from "../repository.interface";

export interface IRaidPostRepository
  extends IIdentifiableEntityRepository<RaidPost> {}
