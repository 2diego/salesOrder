import { useState, type SyntheticEvent } from 'react'
import './ProductList.css'
import { getDefaultProductImageUrl, resolveProductListImageSrc } from '../../../config/productImages'
import { ProductImagePreview } from '../ProductImagePreview/ProductImagePreview'

interface Product {
  id: string;
  name: string;
  detail?: string;
  quantity?: number;
  price?: number;
  /** Si viene del API/admin; si no, se usa solo el placeholder. */
  imageUrl?: string;
}

interface ProductListProps {
  products: Product[];
  onQuantityChange?: (productId: string, change: number) => void;
  showQuantityControls?: boolean;
  showQuantityInput?: boolean;
  showExpandArrow?: boolean;
  /** Miniatura desde `product.imageUrl` o URL por defecto (env / fallback). */
  showProductImage?: boolean;
  /** Lightbox al tocar la miniatura (misma URL, más grande). */
  enableImagePreview?: boolean;
  className?: string;
}

const ProductList = ({ 
  products, 
  onQuantityChange, 
  showQuantityControls = true,
  showQuantityInput = false,
  showExpandArrow = true,
  showProductImage = true,
  enableImagePreview = true,
  className = ""
}: ProductListProps) => {
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<{ src: string; alt: string } | null>(null);

  const handleProductImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.dataset.fallback === '1') return;
    el.dataset.fallback = '1';
    el.src = getDefaultProductImageUrl();
  };

  const updateQuantity = (productId: string, change: number) => {
    if (onQuantityChange) {
      onQuantityChange(productId, change)
    }
  }

  return (
    <div className={`product-list-container ${className}`}>
      {/* Products List */}
      <div className="products-list">
        {products.map((product) => {
          const thumbSrc = resolveProductListImageSrc(product.imageUrl);
          return (
          <div key={product.id} className="product-item">
            {showProductImage && (
              enableImagePreview ? (
                <button
                  type="button"
                  className="product-thumb product-thumb--interactive"
                  aria-label={`Ver imagen ampliada: ${product.name}`}
                  onClick={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    const src =
                      img instanceof HTMLImageElement
                        ? img.currentSrc || img.src || thumbSrc
                        : thumbSrc;
                    setImagePreview({
                      src,
                      alt: `Producto ${product.name}`,
                    });
                  }}
                >
                  <img
                    src={thumbSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="product-thumb__img"
                    onError={handleProductImageError}
                  />
                </button>
              ) : (
                <div className="product-thumb" aria-hidden="true">
                  <img
                    src={thumbSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="product-thumb__img"
                    onError={handleProductImageError}
                  />
                </div>
              )
            )}
            <div className="product-info">
              <div className="product-name">
                <span>{product.name}</span>
              </div>
              <div className="product-detail">
                <span>{product.detail || 'Detalle'}</span>
              </div>
            </div>

            {/* Controles de cantidad - Solo se muestran si están habilitados */}
            {showQuantityControls && (
              <div className={`quantity-controls ${showQuantityInput ? 'quantity-controls--with-input' : ''}`}>
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="quantity-button"
                >
                  <span>-</span>
                </button>

                {showQuantityInput ? (
                  <input
                    className="quantity-input"
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    value={quantityDrafts[product.id] ?? String(product.quantity ?? 0)}
                    onChange={(e) => {
                      const next = e.target.value;
                      setQuantityDrafts((prev) => ({ ...prev, [product.id]: next }));
                    }}
                    onBlur={() => {
                      const raw = quantityDrafts[product.id];
                      const currentQty = product.quantity ?? 0;

                      // Revertir si está vacío o no es un número válido
                      const parsed = raw === undefined || raw === '' ? NaN : parseInt(raw, 10);
                      if (Number.isNaN(parsed)) {
                        setQuantityDrafts((prev) => {
                          const copy = { ...prev };
                          delete copy[product.id];
                          return copy;
                        });
                        return;
                      }

                      const targetQty = Math.max(0, parsed);
                      const delta = targetQty - currentQty;
                      if (delta !== 0) updateQuantity(product.id, delta);

                      // Limpia draft al aplicar
                      setQuantityDrafts((prev) => {
                        const copy = { ...prev };
                        delete copy[product.id];
                        return copy;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        (e.currentTarget as HTMLInputElement).blur();
                      }
                    }}
                  />
                ) : (
                  <div className="quantity-display">
                    <span>{product.quantity || 0}</span>
                  </div>
                )}

                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="quantity-button"
                >
                  <span>+</span>
                </button>
              </div>
            )}

            {/* Vista alternativa para carrito/detalles de pedido sin controles de cantidad */}
            {!showQuantityControls && product.quantity && product.quantity > 0 && (
              <div className="product-quantity-info">
                <span className="quantity-text">{product.quantity}</span>
              </div>
            )}
          </div>
        );
        })}
      </div>

      {enableImagePreview && showProductImage && imagePreview && (
        <ProductImagePreview
          isOpen
          imageSrc={imagePreview.src}
          alt={imagePreview.alt}
          onClose={() => setImagePreview(null)}
        />
      )}

      {/* Flecha de expandir - Solo se muestra si está habilitada */}
      {showExpandArrow && (
        <div className="expand-arrow">
          <div className="expand-button">
            <span>▼</span>
          </div>
        </div>
      )}
    </div>
  )
}



export default ProductList
