import dotenv from "dotenv";
import path from "path";
import { ConnectionOptions } from "typeorm";

const env = process.env.NODE_ENV || "dev";
const is_test = env === "test";

const pathToConfigFile = path.join(__dirname, `../../.env.${env}`);
dotenv.config({ path: pathToConfigFile });

/**
 * Finds the env variable of string type or throws if one could not be found
 */
const parseEnvString = (name: string) => {
  const envVar = process.env[name];
  if (envVar === undefined) {
    throw new Error(`Missing environment variable for ${name}`);
  }

  return envVar;
};

/**
 * Finds the env variable of number type or throws if one could not be found
 */
const parseEnvNumber = (name: string) => {
  const envVar = parseInt(parseEnvString(name));
  if (isNaN(envVar)) {
    throw new Error(`Bad environment variable for ${name}: Not a Number`);
  }

  return envVar;
};

interface ServerOptions {
  jwt: JwtOptions;
  port: number;
}

interface ConfigOptions {
  database: ConnectionOptions;
  server: ServerOptions;
}

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

interface JwtOptions {
  secret: string;
  options: {
    expiresIn: string;
  };
}

/**
 * JWT auth options
 */
const jwt: JwtOptions = {
  secret: parseEnvString("JWT_SECRET"),
  options: {
    expiresIn: "1d",
  },
};

const port = parseEnvNumber("PORT");

const server = { jwt, port };

export const config: ConfigOptions = {
  database,
  server,
};
