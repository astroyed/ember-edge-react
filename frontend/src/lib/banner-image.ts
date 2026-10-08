const FALLBACK_BANNER_IMAGE = '/images/banner1.png';

export function resolveBannerImageSrc(imagePath?: string | null): string {
  const path = imagePath?.trim();

  if (!path) return FALLBACK_BANNER_IMAGE;
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('/')) return path;

  return `/images/${path.replace(/^\.\/+/, '')}`;
}

export { FALLBACK_BANNER_IMAGE };