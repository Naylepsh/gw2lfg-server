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
