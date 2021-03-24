import * as jwt from "jsonwebtoken";
import { JwtAuthToken } from "./auth-token";

/**
 * Decodes jwt string into data
 */
export function decodeToken(token: string) {
  const decoded = jwt.decode(token);
  return decoded as JwtAuthToken;
}
