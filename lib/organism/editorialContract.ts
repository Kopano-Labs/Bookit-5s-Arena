export const EDITORIAL_ORGAN_SCHEMA = 'fivesarena.editorial-organ.v1' as const;

export type EditorialPersistence = 'mongo' | 'postgres' | 'hybrid';

export type EditorialOrganArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string | null;
  image?: string | null;
  publisher?: string | null;
  canonicalPath: string;
  provinceSlugs: string[];
  locations: string[];
  tags: string[];
  persistence?: EditorialPersistence;
};

export type EditorialOrganPayload = {
  schema: typeof EDITORIAL_ORGAN_SCHEMA;
  generatedAt: string;
  persistence?: {
    mode: EditorialPersistence;
    authoritative?: 'mongo' | 'postgres' | null;
    readModels?: Array<'mongo' | 'postgres'>;
  };
  articles: EditorialOrganArticle[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function safeString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function safePersistence(value: unknown): EditorialPersistence | undefined {
  return value === 'mongo' || value === 'postgres' || value === 'hybrid'
    ? value
    : undefined;
}

function parseArticle(value: unknown): EditorialOrganArticle | null {
  if (!isRecord(value)) return null;

  const id = safeString(value.id);
  const slug = safeString(value.slug);
  const title = safeString(value.title);
  const summary = safeString(value.summary || value.description);
  const publishedAt = safeString(value.publishedAt || value.date);
  const canonicalPath = safeString(value.canonicalPath || value.path);

  if (!id || !slug || !title || !publishedAt || !canonicalPath.startsWith('/')) {
    return null;
  }

  return {
    id,
    slug,
    title,
    summary,
    publishedAt,
    updatedAt: safeString(value.updatedAt) || null,
    image: safeString(value.image || value.thumbnail) || null,
    publisher: safeString(value.publisher || value.source) || null,
    canonicalPath,
    provinceSlugs: stringArray(value.provinceSlugs),
    locations: stringArray(value.locations),
    tags: stringArray(value.tags),
    persistence: safePersistence(value.persistence),
  };
}

export function parseEditorialOrganPayload(input: unknown): EditorialOrganPayload | null {
  if (!isRecord(input) || input.schema !== EDITORIAL_ORGAN_SCHEMA) return null;

  const generatedAt = safeString(input.generatedAt);
  if (!generatedAt || !Array.isArray(input.articles)) return null;

  const articles = input.articles.map(parseArticle).filter(Boolean) as EditorialOrganArticle[];
  const persistenceValue = isRecord(input.persistence) ? input.persistence : null;
  const persistenceMode = safePersistence(persistenceValue?.mode);
  const authoritative =
    persistenceValue?.authoritative === 'mongo' || persistenceValue?.authoritative === 'postgres'
      ? persistenceValue.authoritative
      : null;
  const readModels = Array.isArray(persistenceValue?.readModels)
    ? persistenceValue.readModels.filter(
        (value): value is 'mongo' | 'postgres' => value === 'mongo' || value === 'postgres',
      )
    : undefined;

  return {
    schema: EDITORIAL_ORGAN_SCHEMA,
    generatedAt,
    persistence: persistenceMode
      ? {
          mode: persistenceMode,
          authoritative,
          readModels,
        }
      : undefined,
    articles,
  };
}
