import * as jwt from "jsonwebtoken";
import { config } from "../../../config";

/**
 * Turns numeric id into associated token.
 */
export class CreateJwtService {
  createToken(id: number) {
    const token = jwt.sign(
      { id },
      config.server.jwt.secret,
      config.server.jwt.options
    );

    return token;
  }
}
