import axios from "axios";

export const sendRequestWithBearerToken = (url: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(url, config);
};
