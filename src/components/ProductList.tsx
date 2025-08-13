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
  showExpandArrow?: boolean;
  className?: string;
}

const ProductList = ({ 
  products, 
  onQuantityChange, 
  showQuantityControls = true,
  showExpandArrow = true,
  className = ""
}: ProductListProps) => {
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

            {/* Quantity Controls - Only show if enabled */}
            {showQuantityControls && (
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="quantity-button"
                >
                  <span>-</span>
                </button>
                <div className="quantity-display">
                  <span>{product.quantity || 0}</span>
                </div>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="quantity-button"
                >
                  <span>+</span>
                </button>
              </div>
            )}

            {/* Alternative display for cart/order details without quantity controls */}
            {!showQuantityControls && product.quantity && product.quantity > 0 && (
              <div className="product-quantity-info">
                <span className="quantity-text">{product.quantity}</span>
                {product.price && (
                  <span className="price-text">${product.price}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expand Arrow - Only show if enabled */}
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
