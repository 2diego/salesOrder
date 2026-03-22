import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './ProductImagePreview.css';

export interface ProductImagePreviewProps {
  /** URL mostrada (misma que la miniatura, a mayor tamaño). */
  imageSrc: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Lightbox simple: fondo oscuro, imagen centrada, cerrar con X, clic fuera o Escape.
 */
export function ProductImagePreview({ imageSrc, alt, isOpen, onClose }: ProductImagePreviewProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="product-image-preview"
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada de imagen"
    >
      <button
        type="button"
        className="product-image-preview__backdrop"
        aria-label="Cerrar vista ampliada"
        onClick={onClose}
      />
      <div
        className="product-image-preview__frame"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <button
          type="button"
          className="product-image-preview__close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
        <img
          src={imageSrc}
          alt={alt}
          className="product-image-preview__img"
          decoding="async"
        />
      </div>
    </div>,
    document.body,
  );
}

export default ProductImagePreview;
