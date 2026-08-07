import axios from "axios";
import { getTokens } from "./tokenStore";

export const api = axios.create({
  baseURL: "https://logic.seliseblocks.com/api",
  headers: {
    "X-Blocks-Key": "d7e5554c758541db8a18694b64ef423d",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const tokens = getTokens();

  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});
