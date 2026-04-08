import { getFirstEnv, parseUrlLikeEnv } from "@/lib/config/env";

const DEFAULT_ISPORTS_BASE_URL = "http://api.isportsapi.com";

export function getISportsConfig() {
  const parsedUrlConfig = parseUrlLikeEnv(
    getFirstEnv(
      "ISPORTS_API_CONNECTION",
      "ISPORTS_API_URL",
      "ISPORTS_API_ENDPOINT",
      "FOOTBALL_API_URL",
      "FOOTBALL_API_ENDPOINT",
      "SPORTS_API_URL",
    ),
  );

  const apiKey =
    getFirstEnv(
      "ISPORTS_API_KEY",
      "SPORTS_API_KEY",
      "FOOTBALL_API_KEY",
      "KEY",
    ) || parsedUrlConfig.apiKey;

  const baseUrl =
    getFirstEnv(
      "ISPORTS_API_BASE_URL",
      "SPORTS_API_BASE_URL",
      "FOOTBALL_API_BASE_URL",
    ) ||
    parsedUrlConfig.baseUrl ||
    DEFAULT_ISPORTS_BASE_URL;

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    enabled: Boolean(apiKey),
    defaults: {
      sportPath: "/sport/football",
    },
  };
}
