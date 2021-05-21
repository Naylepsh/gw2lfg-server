import { tokenInfoUrl } from "../gw2-api.constants";
import { sendGetRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

export const fetchPermissions = async (apiKey: string) => {
  const { data } = await sendGetRequestWithBearerToken<{
    permissions: string[];
  }>(tokenInfoUrl, apiKey);

  return data.permissions;
};
