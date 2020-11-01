import { Posting } from "../../../../entities/posting.entity";
import { Requirement } from "../../../../entities/requirement.entity";
import { User } from "../../../../entities/user.entity";
import { IPostingRepository } from "../../../../repositories/posting.repository";

export type CreateAndSavePosting = (
  author: User,
  requirements?: Requirement[],
  date?: Date,
  server?: string
) => Promise<Posting>;

export const createAndSavePostingWithRepository = (
  repository: IPostingRepository
): CreateAndSavePosting => (
  author: User,
  requirements: Requirement[] = [],
  date: Date = new Date(),
  server: string = "EU"
) => {
  const reqs = requirements ? requirements : undefined;
  const posting = new Posting(author, date, server, { requirements: reqs });
  return repository.save(posting);
};
