export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80';

/**
 * Central Media URL Handler for VetNova
 * Enforces permanent HTTPS Cloudinary URLs and handles legacy/broken image fallbacks cleanly.
 */
export function getMediaUrl(url?: string | null, fallback: string = DEFAULT_FALLBACK_IMAGE): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim();

  // 1. Permanent Cloudinary absolute URL -> return unchanged
  if (trimmed.includes('res.cloudinary.com')) {
    return trimmed;
  }

  // 2. Legacy ephemeral Render /uploads/ URL -> flag and use fallback
  if (trimmed.includes('/uploads/') || trimmed.includes('onrender.com/uploads')) {
    console.warn(`[Media] Legacy ephemeral /uploads/ URL detected: "${trimmed}". Using fallback.`);
    return fallback;
  }

  // 3. Absolute http:// or https:// URL -> return unchanged
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 4. Relative static asset paths (e.g. assets/... or /assets/...) -> return absolute path
  if (trimmed.startsWith('assets/') || trimmed.startsWith('/assets/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  return fallback;
}

export function handleImageLoadError(event: React.SyntheticEvent<HTMLImageElement, Event>, originalUrl?: string, fallback: string = DEFAULT_FALLBACK_IMAGE) {
  const target = event.currentTarget;
  if (target.getAttribute('data-error-handled') === 'true') {
    return;
  }
  target.setAttribute('data-error-handled', 'true');
  console.warn(`[Media] Failed to load image asset: "${originalUrl || target.src}". Applying fallback.`);
  target.src = fallback;
}
