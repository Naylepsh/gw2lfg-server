import * as jwt from "jsonwebtoken";
import { JwtAuthToken } from "./auth-token";

export class DecodeJWTService {
  decodeToken(token: any) {
    const decoded = jwt.decode(token);
    return decoded as JwtAuthToken;
  }
}
