import { Compare, Hash } from "../../../../utils/hashing/hashing.types";
import { turnIntoPromise } from "../../../helpers/turn-into-promise";

export const simpleHash: Hash = (text: string) =>
  turnIntoPromise(() => text + "123");

export const simpleCompare: Compare = async (
  text: string,
  hashedText: string
) => {
  const simpleHashed = await simpleHash(text);
  return simpleHashed === hashedText;
};
