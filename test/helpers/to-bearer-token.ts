export const AUTH_HEADER = "Authorization";

export function toBearerToken(tokenValue: string) {
  return `Bearer ${tokenValue}`;
}
