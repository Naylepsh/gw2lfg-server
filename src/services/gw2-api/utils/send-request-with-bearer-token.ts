import axios from "axios";

/**
 * Sends a GET request to the given url with given bearer token.
 */
export const sendGetRequestWithBearerToken = <T>(
  url: string,
  token: string
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get<T>(url, config);
};
