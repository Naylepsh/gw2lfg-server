import { accountUrl } from "../gw2-api.constants";
import { sendRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

interface Account {
  name: string;
}

export const fetchCharacters = async (apiKey: string) => {
  const response = await sendRequestWithBearerToken(accountUrl, apiKey);
  return response.data as Account;
};
