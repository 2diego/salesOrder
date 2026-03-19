import { useEffect, useMemo, useState } from 'react';
import { ordersService, Order, OrderStatus } from '../../../../services/ordersService';
import { ordersItemsService, OrderItem } from '../../../../services/ordersItemsService';
import BtnBlue from '../../../../components/common/BtnBlue/BtnBlue';
import './OrderDetailsDesktopPopup.css';

interface OrderDetailsDesktopPopupProps {
  orderId: number;
  onClose: () => void;
}

const formatStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.VALIDATED]: 'Validado',
    [OrderStatus.CANCELLED]: 'Cancelado',
  };
  return statusMap[status] || status;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatMoney = (value?: number): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';
  return `$${value.toFixed(2)}`;
};

const OrderDetailsDesktopPopup: React.FC<OrderDetailsDesktopPopupProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const [orderData, itemsData] = await Promise.all([
          ordersService.findOne(orderId),
          ordersItemsService.findAll({ orderId }),
        ]);
        setOrder(orderData);
        setItems(itemsData);
      } catch (err: any) {
        setError(err?.message || 'No se pudieron cargar los detalles del pedido');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const computedTotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [items]);

  const statusClass = `status-badge ${order?.status?.toLowerCase() || ''}`;

  return (
    <div className="desktop-popup-overlay" onClick={onClose}>
      <div className="desktop-popup order-details-popup" onClick={(e) => e.stopPropagation()}>
        <div className="desktop-popup-header">
          <h3>Detalle de pedido</h3>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="order-details-content">
          {loading && <p className="order-details-muted">Cargando pedido...</p>}
          {!loading && error && <div className="alert alert-error desktop-alert">{error}</div>}

          {!loading && !error && order && (
            <>
              <div className="order-details-meta">
                <div>
                  <h4>{`Pedido Nº ${String(order.id).padStart(8, '0')}`}</h4>
                  <p>Fecha: {formatDate(order.createdAt)}</p>
                </div>
                <span className={statusClass}>{formatStatus(order.status)}</span>
              </div>

              <div className="order-details-client">
                <h5>{order.client?.name || 'Sin cliente'}</h5>
                <p>{order.client?.address || 'Sin dirección'}</p>
                <p>{order.client?.city || 'Sin ciudad'}{order.client?.phone ? ` - Tel: ${order.client.phone}` : ''}</p>
                <p>{order.client?.email || 'Sin email'}</p>
              </div>

              <div className="order-details-items-wrapper">
                <table className="order-details-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const price = item.product?.price || 0;
                      const subtotal = price * item.quantity;
                      return (
                        <tr key={item.id}>
                          <td>{item.product?.name || `Producto #${item.productId}`}</td>
                          <td>{item.quantity}</td>
                          <td>{formatMoney(price)}</td>
                          <td>{formatMoney(subtotal)}</td>
                        </tr>
                      );
                    })}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="order-details-empty">Este pedido no tiene productos.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="order-details-total">
                <span>Total:</span>
                <strong>{formatMoney(order.totalAmount || computedTotal)}</strong>
              </div>

              {order.notes && (
                <div className="order-details-notes">
                  <h5>Observaciones</h5>
                  <p>{order.notes}</p>
                </div>
              )}

              <div className="order-details-actions">
                <BtnBlue
                  width="100%"
                  height="2.75rem"
                  onClick={() => window.print()}
                  background="linear-gradient(195deg, rgba(43, 118, 184, 0.699), rgba(15, 55, 107, 0.459))"
                >
                  <span>Imprimir</span>
                </BtnBlue>
                <BtnBlue
                  width="100%"
                  height="2.75rem"
                  onClick={onClose}
                  background="rgba(107, 114, 128, 0.9)"
                >
                  <span>Cerrar</span>
                </BtnBlue>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsDesktopPopup;
