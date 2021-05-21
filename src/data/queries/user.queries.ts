export const byUsername = (username: string) => {
  return { where: { username } };
}
