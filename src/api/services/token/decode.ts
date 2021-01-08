import * as jwt from "jsonwebtoken";
import { JwtAuthToken } from "./auth-token";

/*
Decodes string token into data
*/
export class DecodeJWTService {
  decodeToken(token: string) {
    const decoded = jwt.decode(token);
    return decoded as JwtAuthToken;
  }
}
