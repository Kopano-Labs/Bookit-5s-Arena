/**
 * Prefer real court photos over SVG placeholders shipped for empty-cache recovery.
 */
export function normalizeCourtImageFilename(filename) {
  if (!filename || typeof filename !== 'string') return filename;
  if (/^court-[1-4]\.svg$/i.test(filename)) {
    return filename.replace(/\.svg$/i, '.jpg');
  }
  return filename;
}

export function courtImageUrl(filename) {
  const normalized = normalizeCourtImageFilename(filename);
  return normalized ? `/images/courts/${normalized}` : '';
}

export function courtImageFallbackUrl(filename) {
  if (!filename || typeof filename !== 'string') return '';
  if (/\.jpg$/i.test(filename)) {
    return `/images/courts/${filename.replace(/\.jpg$/i, '.svg')}`;
  }
  return '';
}
