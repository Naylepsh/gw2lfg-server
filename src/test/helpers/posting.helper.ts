import { Posting } from "../../entities/posting.entity";
import { Requirement } from "../../entities/requirement.entity";
import { User } from "../../entities/user.entity";
import { IPostingRepository } from "../../repositories/posting.repository";

interface PostingProps {
  author: User;
  requirements?: Requirement[];
  date?: Date;
  server?: string;
}

export const createAndSavePosting = (
  repository: IPostingRepository,
  postingProps: PostingProps
) => {
  const props = {
    author: postingProps.author,
    requirements: postingProps.requirements ?? [],
    date: postingProps.date ?? new Date(),
    server: postingProps.server ?? "EU",
    description: "",
  };
  const posting = new Posting(props);
  return repository.save(posting);
};
