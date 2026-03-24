import ProductList from '../../common/ProductList/ProductList';
import BtnBlue from '../../common/BtnBlue/BtnBlue';
import InfoRow from '../../common/InfoRow/InfoRow';
import { LuClipboardList } from 'react-icons/lu';
import type { ProductItem } from './types';
import type { Order } from '../../../services/ordersService';

interface OrderHistoryPanelProps {
  orders: Order[];
  selectedOrderId: number | null;
  historyProducts: ProductItem[];
  loadingDetail: boolean;
  orderSent: boolean;
  onSelectOrder: (order: Order) => void;
  onRepeatOrder: () => void;
  formatDate: (dateString: string) => string;
  formatOrderNumber: (id: number) => string;
}

const OrderHistoryPanel = ({
  orders,
  selectedOrderId,
  historyProducts,
  loadingDetail,
  orderSent,
  onSelectOrder,
  onRepeatOrder,
  formatDate,
  formatOrderNumber,
}: OrderHistoryPanelProps) => (
  <div className="customer-desktop-panel">
    <div className="customer-desktop-panel-header">
      <h3>Historial de pedidos</h3>
    </div>
    {orders.length === 0 ? (
      <div className="customer-desktop-empty">
        <p>No hay pedidos registrados</p>
      </div>
    ) : (
      <div className="customer-desktop-history-layout">
        <div className="customer-desktop-history-list">
          {orders.map((order) => (
            <InfoRow
              key={order.id}
              columns={[
                <span key="date">{formatDate(order.createdAt)}</span>,
                <span key="orderId">{formatOrderNumber(order.id)}</span>,
              ]}
              actionLabel="Ver detalle"
              actionIcon={<LuClipboardList />}
              onActionClick={() => onSelectOrder(order)}
              onRowClick={() => onSelectOrder(order)}
              className={selectedOrderId === order.id ? 'customer-desktop-history-item-active' : ''}
            />
          ))}
        </div>
        <div className="customer-desktop-history-details">
          {loadingDetail && <p>Cargando detalle...</p>}
          {!loadingDetail && historyProducts.length === 0 && (
            <p>Selecciona un pedido para ver el detalle.</p>
          )}
          {!loadingDetail && historyProducts.length > 0 && (
            <>
              <ProductList
                products={historyProducts}
                showQuantityControls={false}
                showExpandArrow={false}
              />
              {!orderSent && (
                <div className="customer-desktop-repeat-wrapper">
                  <BtnBlue width="100%" height="2.5rem" onClick={onRepeatOrder}>
                    <span>Repetir pedido</span>
                  </BtnBlue>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )}
  </div>
);

export default OrderHistoryPanel;
