import SectionTitle from '../../common/SectionTitle/SectionTitle';
import ProductList from '../../common/ProductList/ProductList';
import type { ProductItem } from './types';

interface ProductsPanelProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  products: ProductItem[];
  onQuantityChange: ((productId: string, change: number) => void) | undefined;
  orderSent: boolean;
}

const ProductsPanel = ({
  categories,
  activeCategory,
  onCategoryChange,
  products,
  onQuantityChange,
  orderSent,
}: ProductsPanelProps) => (
  <>
    <SectionTitle>
      <h2>Productos</h2>
    </SectionTitle>
    <div className="customer-desktop-products">
      <div className="customer-desktop-categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`customer-desktop-category-btn${
              category === activeCategory ? ' customer-desktop-category-btn-active' : ''
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <ProductList
        products={products}
        onQuantityChange={onQuantityChange}
        showQuantityControls={!orderSent}
        showQuantityInput={!orderSent}
        showExpandArrow={false}
        className="products-list-full"
      />
      {orderSent && (
        <div className="customer-desktop-order-sent">
          <p>✓ Pedido enviado correctamente. Ya no puede ser modificado.</p>
        </div>
      )}
    </div>
  </>
);

export default ProductsPanel;
