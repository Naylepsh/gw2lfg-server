export function byUsername(username: string) {
  return { where: { username } };
}
