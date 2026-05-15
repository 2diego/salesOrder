import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from "../../../components/common/Header/Header";
import { HeaderBackNavLink } from "../../../components/mobile/header/HeaderBackNavLink";
import { CustomerOrderSummaryHeaderIcon } from '../../../components/mobile/header/CustomerOrderSummaryHeaderIcon';
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../components/common/BtnBlue/BtnBlue";
import ProductList from "../../../components/common/ProductList/ProductList";
import { ordersService, OrderStatus } from '../../../services/ordersService';
import { ordersItemsService } from '../../../services/ordersItemsService';
import type { OrderItem } from '../../../services/ordersItemsService';
import { customerPortalService } from '../../../services/customerPortalService';
import type { ProductItem } from '../../../components/desktop/CustomerPanels/types';
import { mapOrderItemToProductItem } from '../../../utils/mapProductItem';

const HistoryOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [processing, setProcessing] = useState(false);

  // Determinar si viene de CustomerOrderHistory (tiene token) o de OrderHistory (solo lectura)
  const isCustomerView = !!token;
  const backPath = isCustomerView ? `/CustomerOrderHistory${token ? `?token=${token}` : ''}` : '/OrderHistory';

  useEffect(() => {
    const loadOrderData = async () => {
      if (!id) {
        setError('ID de pedido no encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Cargar datos de la orden
        const orderData = token
          ? await customerPortalService.findOrder(parseInt(id, 10), token)
          : await ordersService.findOne(parseInt(id, 10));
        
        // Formatear número de pedido
        setOrderNumber(`Pedido Nº ${orderData.id.toString().padStart(6, '0')}`);
        setOrderStatus(orderData.status);
        
        // Formatear fecha
        if (orderData.createdAt) {
          const date = new Date(orderData.createdAt);
          setOrderDate(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }));
        }

        // Nombre del cliente
        setClientName(orderData.client?.name || 'Sin cliente');

        // 2. Cargar items de la orden
        const items = token
          ? await customerPortalService.findOrderItems(orderData.id, token)
          : await ordersItemsService.findAll({ orderId: orderData.id });

        // 3. Mapear items a ProductItem
          const mappedProducts: ProductItem[] = items.map((item) =>
          mapOrderItemToProductItem(item as OrderItem),
        );

        setProducts(mappedProducts);

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos del pedido');
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [id, token]);

  const handleRepeatOrder = () => {
    if (!token) return;

    // Guardar productos del pedido histórico en localStorage para que NewOrder los cargue
    const productsToRepeat = products.filter(p => p.quantity > 0);
    localStorage.setItem(`cart-${token}`, JSON.stringify(productsToRepeat));

    // Navegar a NewOrder con el token
    navigate(`/NewOrder?token=${token}`);
  };

  const handleMarkAsProcessed = async () => {
    if (!id) return;
    try {
      setProcessing(true);
      setError(null);
      const updated = token
        ? await customerPortalService.updateOrderStatus(parseInt(id, 10), OrderStatus.PROCESSED, token)
        : await ordersService.updateStatus(parseInt(id, 10), OrderStatus.PROCESSED);
      setOrderStatus(updated.status);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo marcar el pedido como cargado');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}        
      <Header
        title={orderNumber}
        subtitle={orderDate}
        leftSlot={<HeaderBackNavLink to={backPath} ariaLabel="Volver" />}
        rightSlot={<CustomerOrderSummaryHeaderIcon />}
      />

      {/* Section Title */}
      <SectionTitle>
        <h2>{clientName}</h2>
      </SectionTitle>

      {/* Order Details */}
      <ProductList 
        products={products}
        showQuantityControls={false}
        showExpandArrow={false}
      />

      {/* Bottom Actions */}
      <div className="bottom-actions">
        {!isCustomerView && orderStatus === OrderStatus.VALIDATED && (
          <BtnBlue width="100%" height="3rem" onClick={handleMarkAsProcessed} disabled={processing}>
            <span>{processing ? 'Marcando...' : 'Marcar como cargado'}</span>
          </BtnBlue>
        )}

        {/* Repeat Order Button - Solo mostrar si viene de CustomerOrderHistory */}
        {isCustomerView && (
          <BtnBlue width="100%" height="3rem" onClick={handleRepeatOrder}>
            <span>Repetir pedido</span>
          </BtnBlue>
        )}

        {/* Back Button */}
        <div style={{ marginBottom: isCustomerView ? '2rem' : '0', width: '100%' }}>
          <Link to={backPath} style={{ textDecoration: 'none', color: 'inherit' }}>
            <BtnBlue width="100%" height="3rem">
              <span>Volver</span>
            </BtnBlue>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HistoryOrderDetails;


/* Para OrderHistory (read only):
        <ProductList 
          products={cartProducts}
          showQuantityControls={false}
          showExpandArrow={false}
        />

        */