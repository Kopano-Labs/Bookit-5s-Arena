import { NextResponse } from 'next/server';
import { getKpgsDomainAdapterState } from '@/lib/kpgs/domainAdapterClient';
import {
  parseEditorialOrganPayload,
  type EditorialOrganPayload,
} from '@/lib/organism/editorialContract';
import { getProvinceBySlug } from '@/lib/organism/southAfrica';
import { getLeagueNews } from '@/lib/sports/football';
import { getProvinceWeather } from '@/lib/weather/openMeteo';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const EDITORIAL_ORIGIN =
  process.env.FIVESARENA_EDITORIAL_ORIGIN || 'https://blog.fivesarena.com';

function articleText(article: Record<string, unknown>) {
  return [
    article.title,
    article.summary,
    article.description,
    ...(Array.isArray(article.locations) ? article.locations : []),
    ...(Array.isArray(article.provinceSlugs) ? article.provinceSlugs : []),
    ...(Array.isArray(article.tags) ? article.tags : []),
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase();
}

function localityScore(
  article: Record<string, unknown>,
  terms: readonly string[],
) {
  const text = articleText(article);
  return terms.reduce(
    (score, term) => score + (text.includes(term.toLowerCase()) ? 1 : 0),
    0,
  );
}

function normalizeArticles(
  input: unknown,
  terms: readonly string[],
  sourceKind: 'editorial-organ' | 'psl-fallback',
) {
  if (!Array.isArray(input)) return [];

  return input
    .filter((article): article is Record<string, unknown> => Boolean(article && typeof article === 'object'))
    .map((article) => ({
      title:
        typeof article.title === 'string' && article.title.trim()
          ? article.title
          : '5s Arena update',
      summary:
        typeof article.summary === 'string'
          ? article.summary
          : typeof article.description === 'string'
            ? article.description
            : '',
      image:
        typeof article.image === 'string'
          ? article.image
          : typeof article.thumbnail === 'string'
            ? article.thumbnail
            : null,
      publishedAt:
        typeof article.publishedAt === 'string'
          ? article.publishedAt
          : typeof article.date === 'string'
            ? article.date
            : null,
      publisher:
        typeof article.source === 'string'
          ? article.source
          : typeof article.publisher === 'string'
            ? article.publisher
            : sourceKind === 'editorial-organ'
              ? '5s Arena Blog'
              : 'South Africa football feed',
      sourceUrl: typeof article.url === 'string' ? article.url : null,
      canonicalPath:
        typeof article.canonicalPath === 'string' ? article.canonicalPath : null,
      sourceKind,
      localityScore: localityScore(article, terms),
    }))
    .sort((left, right) => right.localityScore - left.localityScore)
    .slice(0, 6);
}

async function fetchEditorialOrgan(provinceSlug: string): Promise<EditorialOrganPayload | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);

  try {
    const response = await fetch(
      `${EDITORIAL_ORIGIN}/api/v1/organism/feed?province=${encodeURIComponent(provinceSlug)}`,
      {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        next: { revalidate: 180 },
      },
    );

    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;

    return parseEditorialOrganPayload(await response.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const province = getProvinceBySlug(searchParams.get('province'));
  const currentYear = new Date().getFullYear();
  const localityTerms = [
    province.label,
    province.weatherLabel,
    province.slug,
    ...province.aliases,
    'South Africa',
    'PSL',
  ];

  const [weatherResult, editorialResult, pslResult, adapterResult] =
    await Promise.allSettled([
      getProvinceWeather(province.slug),
      fetchEditorialOrgan(province.slug),
      getLeagueNews('psl', String(currentYear)),
      getKpgsDomainAdapterState(),
    ]);

  const weather =
    weatherResult.status === 'fulfilled' ? weatherResult.value : null;
  const editorial =
    editorialResult.status === 'fulfilled' ? editorialResult.value : null;
  const pslNews = pslResult.status === 'fulfilled' ? pslResult.value : null;
  const adapter =
    adapterResult.status === 'fulfilled'
      ? adapterResult.value
      : {
          configured: false,
          status: 'degraded',
          origin: null,
          health: null,
          version: null,
          checkedAt: new Date().toISOString(),
        };

  const editorialArticles = normalizeArticles(
    editorial?.articles,
    localityTerms,
    'editorial-organ',
  );
  const fallbackArticles = normalizeArticles(
    pslNews?.articles,
    localityTerms,
    'psl-fallback',
  );
  const articles = editorialArticles.length
    ? editorialArticles
    : fallbackArticles;

  return NextResponse.json(
    {
      schema: 'fivesarena.organism.feed.v1',
      canonicalSurface: 'https://fivesarena.com',
      locality: {
        country: 'South Africa',
        province: province.label,
        provinceSlug: province.slug,
        weatherLabel: province.weatherLabel,
        source: 'user-governed-context',
      },
      weather,
      editorial: {
        status: editorialArticles.length ? 'live' : 'fallback',
        requestedOrigin: EDITORIAL_ORIGIN,
        contractPath: '/api/v1/organism/feed',
        schema: editorial?.schema || 'fivesarena.editorial-organ.v1',
        persistence: editorial?.persistence || null,
        articles,
      },
      governance: {
        adapter,
        executionPolicy:
          adapter.status === 'ready'
            ? 'canonical-dotnet-boundary-ready'
            : 'domain-runtime-direct-with-canonical-adapter-not-promoted',
      },
      organs: {
        blog: 'https://blog.fivesarena.com',
        news: 'https://news.fivesarena.com',
        policy: 'render-inside-fivesarena-shell',
      },
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    },
  );
}
