import dotenv from "dotenv";
import path from "path";
import { ConnectionOptions } from "typeorm";

const env = process.env.NODE_ENV || "dev";
const is_test = env === "test";

const pathToConfigFile = path.join(__dirname, `../../.env.${env}`);
dotenv.config({ path: pathToConfigFile });

/*
Finds the env variable of string type or throws if one could not be found
*/
const parseEnvString = (name: string) => {
  const env = process.env[name];
  if (env === undefined) {
    throw new Error(`Missing environment variable for ${name}`);
  }

  return env;
};

/*
Finds the env variable of number type or throws if one could not be found
*/
const parseEnvNumber = (name: string) => {
  const env = parseInt(parseEnvString(name));
  if (isNaN(env)) {
    throw new Error(`Bad environment variable for ${name}: Not a Number`);
  }

  return env;
};

interface ConfigProperties {
  database: ConnectionOptions;
  jwt: JwtOptions;
  port: number;
}

/*
Connection options needed for TypeORM
*/
const database: ConnectionOptions = {
  type: "postgres",
  host: parseEnvString("DATABASE_HOST"),
  port: parseEnvNumber("DATABASE_PORT"),
  database: parseEnvString("DATABASE_NAME"),
  username: parseEnvString("DATABASE_USERNAME"),
  password: parseEnvString("DATABASE_PASSWORD"),
  logging: is_test ? ['error'] : false,
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

/*
JWT options for authentication
*/
const jwt: JwtOptions = {
  secret: parseEnvString("JWT_SECRET"),
  options: {
    expiresIn: "1d",
  },
};

/*
Server port
*/
const port = parseEnvNumber("PORT");

export const config: ConfigProperties = {
  database,
  jwt,
  port,
};
