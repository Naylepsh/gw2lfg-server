import assert from "assert";

export function getGw2ApiKey() {
  assert(typeof process.env.GW2API_TOKEN !== "undefined");
  const apiKey = process.env.GW2API_TOKEN;
  return apiKey;
}
