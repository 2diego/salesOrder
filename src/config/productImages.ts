/**
 * URLs de miniaturas de producto.
 * - Hay que usar el enlace directo (`https://i.ibb.co/...`) que muestra ImgBB.
 * - `VITE_DEFAULT_PRODUCT_IMAGE_URL` permite cambiar el placeholder sin tocar código.
 */
const FALLBACK_DEFAULT_IMAGE =
  'https://i.ibb.co/rRcn6PMv/default.webp';

export function getDefaultProductImageUrl(): string {
  const fromEnv = import.meta.env.VITE_DEFAULT_PRODUCT_IMAGE_URL?.trim();
  return fromEnv || FALLBACK_DEFAULT_IMAGE;
}

/** URL a mostrar en la lista: la del producto o el placeholder. */
export function resolveProductListImageSrc(imageUrl?: string | null): string {
  const t = imageUrl?.trim();
  if (t) return t;
  return getDefaultProductImageUrl();
}
