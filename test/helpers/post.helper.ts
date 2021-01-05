import { Post } from "@root/data/entities/post/post.entity";
import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { User } from "@root/data/entities/user/user.entity";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";

interface PostProps {
  author: User;
  requirements?: Requirement[];
  date?: Date;
  server?: string;
}

export const createAndSavePosting = (
  repository: IPostRepository,
  postProps: PostProps
) => {
  const props = {
    author: postProps.author,
    requirements: postProps.requirements ?? [],
    date: postProps.date ?? new Date(),
    server: postProps.server ?? "EU",
    description: "",
  };
  const post = new Post(props);
  return repository.save(post);
};
