import gw2ApiServices from "./gw2-api";
import joinRequestSerivces from "./join-request";
import raidBossServices from "./raid-boss";
import raidPostServices from "./raid-post";
import requirementServices from "./requirement";
import userSerivces from "./user";

/**
 * All services that may possibly need to present their metadata to dependency injection service
 * to get their dependencies resolved.
 * Gw2items does not contain any dependencies and can be loaded anytime, thus it's skipped
 */
export const services = {
  ...gw2ApiServices,
  ...joinRequestSerivces,
  ...raidBossServices,
  ...raidPostServices,
  ...requirementServices,
  ...userSerivces,
};
