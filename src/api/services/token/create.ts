import * as jwt from "jsonwebtoken";
import { config } from "../../../config";

export class CreateJwtService {
  createToken(id: number) {
    const token = jwt.sign({ id }, config.jwt.secret, config.jwt.options);
    return token;
  }
}
