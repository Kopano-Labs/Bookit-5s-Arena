import { getFirstEnv } from "@/lib/config/env";

const DEFAULT_YOUTUBE_RAPIDAPI_HOST = "youtube138.p.rapidapi.com";

export function getYouTubeRapidApiConfig() {
  const apiKey = getFirstEnv(
    "YOUTUBE_RAPIDAPI_KEY",
    "RAPIDAPI_KEY",
    "X_RAPIDAPI_KEY",
    "YOUTUBE_API_KEY",
  );

  const host =
    getFirstEnv(
      "YOUTUBE_RAPIDAPI_HOST",
      "RAPIDAPI_HOST",
      "YOUTUBE_API_HOST",
    ) || DEFAULT_YOUTUBE_RAPIDAPI_HOST;

  return {
    apiKey,
    host,
    baseUrl: `https://${host}`,
    enabled: Boolean(apiKey),
  };
}
