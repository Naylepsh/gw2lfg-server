import { charactersUrl } from "../gw2-api.constants";
import { sendRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

export const fetchCharacters = async (apiKey: string) => {
  const response = await sendRequestWithBearerToken(charactersUrl, apiKey);
  return response.data as string[];
};
