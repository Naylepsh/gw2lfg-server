import { accountUrl } from "../gw2-api.constants";
import { sendRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

/*
Fetches the names of cleared raid bosses of an account associated with api key.
*/
export const fetchRaidClearStatus = async (apiKey: string) => {
  const raidsUrl = `${accountUrl}/raids`;
  try {
    const response = await sendRequestWithBearerToken(raidsUrl, apiKey);
    return response.data as string[];
  } catch (error) {
    throw new Error("Couldn't access user's raid clears: " + error.message);
  }
};