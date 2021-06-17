import dotenv from "dotenv";
import path from "path";

/**
 * Loads environment variables specified in .env.<NODE_ENV> in project root file.
 * If NODE_ENV not specified, then loads from .env.dev
 */
export const loadEnv = () => {
  const env = process.env.NODE_ENV || "dev";
  const pathToConfigFile = path.join(__dirname, `../../.env.${env}`);
  dotenv.config({ path: pathToConfigFile });
};

/**
 * Finds the env variable of string type or throws if one could not be found
 */
export const parseEnvString = (name: string) => {
  const envVar = process.env[name];
  if (envVar === undefined) {
    throw new Error(`Missing environment variable for ${name}`);
  }

  return envVar;
};

/**
 * Finds the env variable of number type or throws if one could not be found
 */
export const parseEnvNumber = (name: string) => {
  const envVar = parseInt(parseEnvString(name));
  if (isNaN(envVar)) {
    throw new Error(`Bad environment variable for ${name}: Not a Number`);
  }

  return envVar;
};
