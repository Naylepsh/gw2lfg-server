import dotenv from "dotenv";
import path from "path";
import { ConnectionOptions } from "typeorm";

const env = process.env.NODE_ENV || "dev";
const is_prod = env === "prod";
dotenv.config({ path: `src/../.env.${env}` });

interface ConfigProperties {
  database: ConnectionOptions;
}

const parseEnvString = (name: string) => {
  const env = process.env[name];
  if (env === undefined) {
    throw new Error(`Missing environment variable for ${name}`);
  }

  return env;
};

const parseEnvNumber = (name: string) => {
  const env = parseInt(parseEnvString(name));
  if (isNaN(env)) {
    throw new Error(`Bad environment variable for ${name}: Not a Number`);
  }

  return env;
};

const database: ConnectionOptions = {
  type: "postgres",
  host: parseEnvString("DATABASE_HOST"),
  port: parseEnvNumber("DATABASE_PORT"),
  database: parseEnvString("DATABASE_NAME"),
  username: parseEnvString("DATABASE_USERNAME"),
  password: parseEnvString("DATABASE_PASSWORD"),
  synchronize: is_prod,
  entities: [path.join(__dirname, "../models/*.js")],
};

export const config: ConfigProperties = {
  database,
};
