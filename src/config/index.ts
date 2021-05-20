import dotenv from "dotenv";
import path from "path";
import { ConnectionOptions } from "typeorm";
import { parseEnvString, parseEnvNumber } from "./env.utils";

const env = process.env.NODE_ENV || "dev";
const is_test = env === "test";

const pathToConfigFile = path.join(__dirname, `../../.env.${env}`);
dotenv.config({ path: pathToConfigFile });

/**
 * Connection options needed for TypeORM
 */
const database: ConnectionOptions = {
  type: "postgres",
  host: parseEnvString("DATABASE_HOST"),
  port: parseEnvNumber("DATABASE_PORT"),
  database: parseEnvString("DATABASE_NAME"),
  username: parseEnvString("DATABASE_USERNAME"),
  password: parseEnvString("DATABASE_PASSWORD"),
  logging: ["error"],
  synchronize: is_test,
  entities: [
    // .js needed for dev environment where code has been compiled to js
    path.join(__dirname, "../data/entities/**/*.js"),
    // .ts needed for test environent where code just stays in ts
    path.join(__dirname, "../data/entities/**/*.ts"),
  ],
  migrations: [path.join(__dirname, "../data/migrations/*.js")],
  migrationsRun: true,
};

const server = {
  jwt: {
    secret: parseEnvString("JWT_SECRET"),
    options: {
      expiresIn: "1d",
    },
  },
  port: parseEnvNumber("PORT"),
};

export const config = {
  database,
  server,
};
