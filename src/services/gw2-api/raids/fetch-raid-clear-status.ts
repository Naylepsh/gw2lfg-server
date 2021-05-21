import { accountUrl } from "../gw2-api.constants";
import { sendGetRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

/**
 * Fetches the names of cleared raid bosses of an account associated with api key.
 */
export const fetchRaidClearStatus = async (apiKey: string) => {
  const raidsUrl = `${accountUrl}/raids`;
  try {
    const { data } = await sendGetRequestWithBearerToken<string[]>(
      raidsUrl,
      apiKey
    );
    return data;
  } catch (error) {
    throw new Error("Couldn't access user's raid clears: " + error.message);
  }
};
