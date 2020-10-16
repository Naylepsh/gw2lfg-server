import { createConnection } from "typeorm";
import { config } from "../config";

export const loadTypeORM = () => {
  return createConnection(config.database);
};
