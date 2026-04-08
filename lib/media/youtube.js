import { withRuntimeCache } from "@/lib/runtimeCache";
import { getYouTubeRapidApiConfig } from "@/lib/media/config";

const YOUTUBE_NAMESPACE = "youtube-rapidapi";

function collectCandidateVideos(payload, accumulator = []) {
  if (!payload || accumulator.length >= 12) {
    return accumulator;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      collectCandidateVideos(item, accumulator);
      if (accumulator.length >= 12) {
        break;
      }
    }
    return accumulator;
  }

  if (typeof payload !== "object") {
    return accumulator;
  }

  const videoId =
    payload.videoId ||
    payload.id ||
    payload.video?.videoId ||
    payload.content?.videoId ||
    payload.playlistVideoRenderer?.videoId;

  const title =
    payload.title?.text ||
    payload.title ||
    payload.video?.title ||
    payload.headline ||
    payload.channelVideoRenderer?.title?.runs?.[0]?.text;

  const channelName =
    payload.author?.title ||
    payload.author ||
    payload.channelName ||
    payload.video?.author?.title ||
    payload.ownerText?.runs?.[0]?.text;

  const thumbnail =
    payload.thumbnails?.[0]?.url ||
    payload.thumbnail?.[0]?.url ||
    payload.thumbnail?.thumbnails?.[0]?.url ||
    payload.video?.thumbnails?.[0]?.url ||
    payload.video?.thumbnail?.[0]?.url;

  if (videoId && title) {
    accumulator.push({
      id: String(videoId),
      title: String(title),
      channelName: channelName ? String(channelName) : "",
      thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }

  for (const value of Object.values(payload)) {
    if (accumulator.length >= 12) {
      break;
    }
    collectCandidateVideos(value, accumulator);
  }

  return accumulator;
}

async function fetchYouTube(path, params = {}, { ttlMs = 300_000 } = {}) {
  const config = getYouTubeRapidApiConfig();

  if (!config.enabled) {
    throw new Error("YouTube RapidAPI is not configured");
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const requestUrl = `${config.baseUrl}${path}?${searchParams.toString()}`;
  const cacheKey = `${path}:${searchParams.toString()}`;

  return withRuntimeCache(YOUTUBE_NAMESPACE, cacheKey, ttlMs, async () => {
    const response = await fetch(requestUrl, {
      headers: {
        "x-rapidapi-key": config.apiKey,
        "x-rapidapi-host": config.host,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`YouTube RapidAPI request failed with ${response.status}`);
    }

    return response.json();
  });
}

export async function searchYouTubeVideos(query, { limit = 6 } = {}) {
  if (!query) {
    return [];
  }

  const payload = await fetchYouTube(
    "/search/",
    {
      q: query,
      hl: "en",
      gl: "ZA",
    },
    { ttlMs: 600_000 },
  );

  return collectCandidateVideos(payload).slice(0, limit);
}

export async function getYouTubeProviderHealth() {
  const config = getYouTubeRapidApiConfig();

  if (!config.enabled) {
    return {
      provider: "YouTube RapidAPI",
      configured: false,
      status: "unconfigured",
      host: config.host,
    };
  }

  try {
    const videos = await searchYouTubeVideos("Premier League", { limit: 1 });

    return {
      provider: "YouTube RapidAPI",
      configured: true,
      status: "ok",
      host: config.host,
      sampleCount: videos.length,
    };
  } catch (error) {
    return {
      provider: "YouTube RapidAPI",
      configured: true,
      status: "degraded",
      host: config.host,
      error: error.message,
    };
  }
}
