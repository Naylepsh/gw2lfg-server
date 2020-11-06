import { RaidPost } from "../../entities/raid-post.entitity";
import { IRaidPostRepository } from "../../repositories/raid-post.repository";

export class InvalidPropertyError extends Error {
  constructor(public readonly property: string, message: string) {
    super(message);
  }
}

export class PastDateError extends InvalidPropertyError {
  constructor(property: string) {
    super(property, `property ${property} cannot be a past date`);
  }
}

export const publish = async (
  post: RaidPost,
  raidPostRepository: IRaidPostRepository
) => {
  if (isDateInThePast(post.date)) throw new PastDateError("date");

  const _post = { ...post };
  return raidPostRepository.save(_post);
};

const isDateInThePast = (date: Date) => {
  return new Date() > date;
};
