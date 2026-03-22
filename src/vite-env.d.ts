/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL HTTPS de imagen por defecto cuando el producto no tiene `imageUrl` (ej. ImgBB direct link). */
  readonly VITE_DEFAULT_PRODUCT_IMAGE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
