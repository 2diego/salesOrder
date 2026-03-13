import ProductList from '../../common/ProductList/ProductList';
import BtnBlue from '../../common/BtnBlue/BtnBlue';
import type { ProductItem } from './types';

interface CartPanelProps {
  products: ProductItem[];
  onQuantityChange: ((productId: string, change: number) => void) | undefined;
  orderSent: boolean;
  sending: boolean;
  onSendOrder: () => void;
}

const CartPanel = ({
  products,
  onQuantityChange,
  orderSent,
  sending,
  onSendOrder,
}: CartPanelProps) => (
  <div className="customer-desktop-panel">
    <div className="customer-desktop-panel-header">
      <h3>Carrito actual</h3>
    </div>
    <div className="customer-desktop-cart-list">
      {products.length === 0 ? (
        <div className="customer-desktop-empty">
          <p>No hay productos seleccionados</p>
        </div>
      ) : (
        <ProductList
          products={products}
          onQuantityChange={onQuantityChange}
          showQuantityControls={!orderSent}
          showExpandArrow={false}
          className="products-list-full"
        />
      )}
    </div>
    <div className="customer-desktop-panel-footer">
      <BtnBlue
        width="100%"
        height="3rem"
        onClick={onSendOrder}
        disabled={
          sending || orderSent || products.filter((p) => p.quantity > 0).length === 0
        }
      >
        <span>
          {orderSent ? 'Pedido enviado' : sending ? 'Enviando...' : 'Enviar pedido'}
        </span>
      </BtnBlue>
    </div>
  </div>
);

export default CartPanel;
