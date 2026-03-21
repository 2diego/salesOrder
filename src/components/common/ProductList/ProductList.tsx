import { useState } from 'react'
import './ProductList.css'

interface Product {
  id: string;
  name: string;
  detail?: string;
  quantity?: number;
  price?: number;
}

interface ProductListProps {
  products: Product[];
  onQuantityChange?: (productId: string, change: number) => void;
  showQuantityControls?: boolean;
  showQuantityInput?: boolean;
  showExpandArrow?: boolean;
  className?: string;
}

const ProductList = ({ 
  products, 
  onQuantityChange, 
  showQuantityControls = true,
  showQuantityInput = false,
  showExpandArrow = true,
  className = ""
}: ProductListProps) => {
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({});

  const updateQuantity = (productId: string, change: number) => {
    if (onQuantityChange) {
      onQuantityChange(productId, change)
    }
  }

  return (
    <div className={`product-list-container ${className}`}>
      {/* Products List */}
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
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
        ))}
      </div>

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
