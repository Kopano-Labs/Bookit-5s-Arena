import { withRuntimeCache } from "@/lib/runtimeCache";
import {
  ARENA_LOCATION,
  SOUTH_AFRICA_PROVINCES,
  getProvinceBySlug,
} from "@/lib/organism/southAfrica";

const WEATHER_NAMESPACE = "weather";
const WEATHER_TTL_MS = 15 * 60 * 1000;

const FEATURED_LOCATIONS = [
  {
    slug: ARENA_LOCATION.slug,
    label: ARENA_LOCATION.label,
    subtitle: `${ARENA_LOCATION.weatherLabel} · Western Cape`,
    provinceSlug: ARENA_LOCATION.provinceSlug,
    latitude: ARENA_LOCATION.latitude,
    longitude: ARENA_LOCATION.longitude,
  },
  ...SOUTH_AFRICA_PROVINCES.map((province) => ({
    slug: province.slug,
    label: province.label,
    subtitle: province.weatherLabel,
    provinceSlug: province.slug,
    latitude: province.latitude,
    longitude: province.longitude,
  })),
];

export const WMO_CODES = {
  0: { label: "Clear Sky", emoji: "☀️" },
  1: { label: "Mainly Clear", emoji: "🌤️" },
  2: { label: "Partly Cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Foggy", emoji: "🌫️" },
  48: { label: "Icy Fog", emoji: "🌫️" },
  51: { label: "Light Drizzle", emoji: "🌦️" },
  53: { label: "Drizzle", emoji: "🌦️" },
  55: { label: "Heavy Drizzle", emoji: "🌧️" },
  61: { label: "Light Rain", emoji: "🌧️" },
  63: { label: "Rain", emoji: "🌧️" },
  65: { label: "Heavy Rain", emoji: "🌧️" },
  71: { label: "Light Snow", emoji: "🌨️" },
  73: { label: "Snow", emoji: "❄️" },
  75: { label: "Heavy Snow", emoji: "❄️" },
  80: { label: "Rain Showers", emoji: "🌦️" },
  81: { label: "Rain Showers", emoji: "🌦️" },
  82: { label: "Violent Showers", emoji: "⛈️" },
  95: { label: "Thunderstorm", emoji: "⛈️" },
  96: { label: "Hail Storm", emoji: "⛈️" },
  99: { label: "Heavy Hail Storm", emoji: "⛈️" },
};

function getCondition(code) {
  return WMO_CODES[code] || { label: "Unknown", emoji: "🌡️" };
}

function isFootballWeather(sample) {
  return (
    sample.temperature >= 15 &&
    sample.temperature <= 28 &&
    sample.weatherCode <= 3
  );
}

async function fetchLocationWeather(location) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m",
    timezone: "Africa/Johannesburg",
    wind_speed_unit: "kmh",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with ${response.status}`);
  }

  const payload = await response.json();
  const current = payload?.current;

  if (!current) {
    throw new Error("Open-Meteo current conditions were missing");
  }

  const condition = getCondition(current.weathercode);

  return {
    slug: location.slug,
    label: location.label,
    subtitle: location.subtitle,
    provinceSlug: location.provinceSlug || null,
    latitude: location.latitude,
    longitude: location.longitude,
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    weatherCode: current.weathercode,
    condition: condition.label,
    emoji: condition.emoji,
    wind: Math.round(current.windspeed_10m),
    humidity: current.relativehumidity_2m,
    footballReady: isFootballWeather({
      temperature: Math.round(current.temperature_2m),
      weatherCode: current.weathercode,
    }),
    fetchedAt: new Date().toISOString(),
  };
}

export async function getLocationWeather(location) {
  const normalized = {
    slug: location.slug,
    label: location.label,
    subtitle: location.subtitle || location.weatherLabel || location.label,
    provinceSlug: location.provinceSlug || location.slug,
    latitude: location.latitude,
    longitude: location.longitude,
  };

  return withRuntimeCache(
    WEATHER_NAMESPACE,
    `location:${normalized.slug}`,
    WEATHER_TTL_MS,
    () => fetchLocationWeather(normalized),
  );
}

export async function getProvinceWeather(provinceSlug) {
  const province = getProvinceBySlug(provinceSlug);
  return getLocationWeather({
    ...province,
    subtitle: province.weatherLabel,
    provinceSlug: province.slug,
  });
}

export async function getFeaturedLocationWeather() {
  return withRuntimeCache(
    WEATHER_NAMESPACE,
    "featured-south-africa-locations-v2",
    WEATHER_TTL_MS,
    async () => {
      const results = await Promise.allSettled(
        FEATURED_LOCATIONS.map(fetchLocationWeather),
      );

      return results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
    },
  );
}

export async function getWeatherProviderHealth() {
  try {
    const locations = await getFeaturedLocationWeather();

    return {
      provider: "Open-Meteo",
      configured: true,
      status: locations.length ? "ok" : "degraded",
      sampleCount: locations.length,
      scope: "South Africa provinces + 5s Arena",
      locations,
    };
  } catch (error) {
    return {
      provider: "Open-Meteo",
      configured: true,
      status: "degraded",
      error: error.message,
    };
  }
}
