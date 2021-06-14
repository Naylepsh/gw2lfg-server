import dotenv from "dotenv";
import path from "path";

export const loadEnv = () => {
  const env = process.env.NODE_ENV || "dev";
  const pathToConfigFile = path.join(__dirname, `../../.env.${env}`);
  dotenv.config({ path: pathToConfigFile });
};
