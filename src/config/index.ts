import path from "path";
import { ConnectionOptions } from "typeorm";
import { parseEnvString, parseEnvNumber, loadEnv } from "./env.utils";

loadEnv();

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
  synchronize: process.env.NODE_ENV === "test",
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
