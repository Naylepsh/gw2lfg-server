import { createConnection } from "typeorm";
import { config } from "../config";

/*
Loads TypeORM with configuration specified by the config
*/
export const loadTypeORM = () => {
  return createConnection(config.database);
};
