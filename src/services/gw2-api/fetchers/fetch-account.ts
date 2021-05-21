import { accountUrl } from "../gw2-api.constants";
import { sendGetRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

export interface Gw2Account {
  name: string;
}

/**
 * Fetches account associated with given API key from official GW2 API
 */
export const fetchAccount = async (apiKey: string) => {
  try {
    const response = await sendGetRequestWithBearerToken<Gw2Account>(
      accountUrl,
      apiKey
    );
    return response.data;
  } catch (error) {
    throw new Error("Couldn't access user's account: " + error.message);
  }
};
