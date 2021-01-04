import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import {
  findRaidPostServiceType,
  raidPostRepositoryType,
} from "@loaders/typedi.constants";
import { PostNotFoundError } from "../common/errors/entity-not-found.error";
import { FindRaidPostDTO } from "./dtos/find-raid-post.dto";

@Service(findRaidPostServiceType)
export class FindRaidPostService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly repository: IRaidPostRepository
  ) {}

  async find(dto: FindRaidPostDTO) {
    const { id } = dto;

    const post = await this.repository.findById(id);
    if (!post) {
      throw new PostNotFoundError();
    }

    return post;
  }
}
