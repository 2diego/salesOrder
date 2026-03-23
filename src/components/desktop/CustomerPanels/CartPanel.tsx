import { useMemo, useState } from 'react';
import ProductList from '../../common/ProductList/ProductList';
import BtnBlue from '../../common/BtnBlue/BtnBlue';
import type { ProductItem } from './types';
import { getDefaultProductImageUrl, resolveProductListImageSrc } from '../../../config/productImages';

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
}: CartPanelProps) => {
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const productsToSend = useMemo(
    () => products.filter((p) => p.quantity > 0),
    [products],
  );

  return (
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
          showQuantityInput={!orderSent}
          showExpandArrow={false}
          className="products-list-full"
        />
      )}
    </div>
    <div className="customer-desktop-panel-footer">
      <BtnBlue
        width="100%"
        height="3rem"
        onClick={() => setShowSendConfirm(true)}
        disabled={
          sending || orderSent || productsToSend.length === 0
        }
      >
        <span>
          {orderSent ? 'Pedido enviado' : sending ? 'Enviando...' : 'Enviar pedido'}
        </span>
      </BtnBlue>
      {orderSent && (
        <div className="customer-desktop-order-sent">
          <p>✓ Pedido enviado correctamente. Ya no puede ser modificado.</p>
        </div>
      )}
    </div>

    {showSendConfirm && (
      <div className="desktop-popup-overlay" onClick={() => setShowSendConfirm(false)}>
        <div
          className="desktop-popup"
          style={{ maxWidth: '520px', width: '95%', backgroundColor: 'var(--mainWhite) !important' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="desktop-popup-header">
            <h3 style={{ color: 'var(--mainBlack)' }}>Confirmar envío de pedido</h3>
            <button
              className="close-button"
              onClick={() => setShowSendConfirm(false)}
              aria-label="Cerrar"
              style={{ color: 'var(--mainBlack)', fontSize: '1.5rem' }}
            >
              ×
            </button>
          </div>
          <div style={{ padding: '1rem 1.25rem', maxHeight: '50vh', overflowY: 'auto' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              Mi pedido:
            </p>
            {productsToSend.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', gap: '0.6rem', minWidth: 0 }}>
                  <img
                    src={resolveProductListImageSrc(p.imageUrl)}
                    alt=""
                    style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, background: '#e8edf2' }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.dataset.fallback === '1') return;
                      el.dataset.fallback = '1';
                      el.src = getDefaultProductImageUrl();
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    {p.detail && (
                      <div style={{ fontSize: '0.875rem', color: 'rgba(107,114,128,0.95)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.detail}
                      </div>
                    )}
                  </div>
                </div>
                <strong>x{p.quantity}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0 1.25rem 1.25rem', justifyContent: 'center' }}>
            <BtnBlue width="100%" height="2.75rem" onClick={() => setShowSendConfirm(false)} background="rgba(107, 114, 128, 0.9)">
              <span>Cancelar</span>
            </BtnBlue>
            <BtnBlue
              width="100%"
              height="2.75rem"
              onClick={() => {
                setShowSendConfirm(false);
                onSendOrder();
              }}
              disabled={sending || productsToSend.length === 0}
            >
              <span>{sending ? 'Enviando...' : 'Confirmar envío'}</span>
            </BtnBlue>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default CartPanel;
