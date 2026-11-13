export const LOCALITY_STORAGE_KEY = 'fivesarena.locality.v1';
export const LOCALITY_EVENT = 'fivesarena:locality-change';
export const DEFAULT_PROVINCE_SLUG = 'western-cape';

export type SouthAfricaProvince = {
  slug: string;
  label: string;
  weatherLabel: string;
  latitude: number;
  longitude: number;
  leagueSlug: 'psl';
  aliases: readonly string[];
};

export const ARENA_LOCATION = {
  slug: 'arena',
  label: "5s Arena",
  weatherLabel: 'Milnerton',
  latitude: -33.8766,
  longitude: 18.4904,
  provinceSlug: DEFAULT_PROVINCE_SLUG,
} as const;

export const SOUTH_AFRICA_PROVINCES = [
  {
    slug: 'western-cape',
    label: 'Western Cape',
    weatherLabel: 'Cape Town',
    latitude: -33.9249,
    longitude: 18.4241,
    leagueSlug: 'psl',
    aliases: ['Cape Town', 'Milnerton', 'Stellenbosch', 'George'],
  },
  {
    slug: 'eastern-cape',
    label: 'Eastern Cape',
    weatherLabel: 'Gqeberha',
    latitude: -33.9608,
    longitude: 25.6022,
    leagueSlug: 'psl',
    aliases: ['Gqeberha', 'East London', 'Mthatha'],
  },
  {
    slug: 'northern-cape',
    label: 'Northern Cape',
    weatherLabel: 'Kimberley',
    latitude: -28.7282,
    longitude: 24.7499,
    leagueSlug: 'psl',
    aliases: ['Kimberley', 'Upington'],
  },
  {
    slug: 'free-state',
    label: 'Free State',
    weatherLabel: 'Bloemfontein',
    latitude: -29.0852,
    longitude: 26.1596,
    leagueSlug: 'psl',
    aliases: ['Bloemfontein', 'Welkom'],
  },
  {
    slug: 'kwazulu-natal',
    label: 'KwaZulu-Natal',
    weatherLabel: 'Durban',
    latitude: -29.8587,
    longitude: 31.0218,
    leagueSlug: 'psl',
    aliases: ['Durban', 'Pietermaritzburg', 'Richards Bay'],
  },
  {
    slug: 'north-west',
    label: 'North West',
    weatherLabel: 'Mahikeng',
    latitude: -25.8652,
    longitude: 25.6442,
    leagueSlug: 'psl',
    aliases: ['Mahikeng', 'Rustenburg', 'Potchefstroom'],
  },
  {
    slug: 'gauteng',
    label: 'Gauteng',
    weatherLabel: 'Johannesburg',
    latitude: -26.2041,
    longitude: 28.0473,
    leagueSlug: 'psl',
    aliases: ['Johannesburg', 'Pretoria', 'Soweto'],
  },
  {
    slug: 'mpumalanga',
    label: 'Mpumalanga',
    weatherLabel: 'Mbombela',
    latitude: -25.4753,
    longitude: 30.9694,
    leagueSlug: 'psl',
    aliases: ['Mbombela', 'Nelspruit', 'Emalahleni'],
  },
  {
    slug: 'limpopo',
    label: 'Limpopo',
    weatherLabel: 'Polokwane',
    latitude: -23.9045,
    longitude: 29.4689,
    leagueSlug: 'psl',
    aliases: ['Polokwane', 'Thohoyandou', 'Tzaneen'],
  },
] as const satisfies readonly SouthAfricaProvince[];

export type ProvinceSlug = (typeof SOUTH_AFRICA_PROVINCES)[number]['slug'];

export function getProvinceBySlug(value: string | null | undefined) {
  const slug = value || DEFAULT_PROVINCE_SLUG;
  return (
    SOUTH_AFRICA_PROVINCES.find((province) => province.slug === slug) ||
    SOUTH_AFRICA_PROVINCES[0]
  );
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(latitudeB - latitudeA);
  const longitudeDelta = toRadians(longitudeB - longitudeA);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestProvince(latitude: number, longitude: number) {
  return SOUTH_AFRICA_PROVINCES.reduce((nearest, province) => {
    const candidateDistance = distanceKm(
      latitude,
      longitude,
      province.latitude,
      province.longitude,
    );
    const nearestDistance = distanceKm(
      latitude,
      longitude,
      nearest.latitude,
      nearest.longitude,
    );

    return candidateDistance < nearestDistance ? province : nearest;
  }, SOUTH_AFRICA_PROVINCES[0]);
}
