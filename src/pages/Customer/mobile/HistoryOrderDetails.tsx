import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from "../../../components/common/Header/Header";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../components/common/BtnBlue/BtnBlue";
import ProductList from "../../../components/common/ProductList/ProductList";
import { ordersService } from '../../../services/ordersService';
import { ordersItemsService } from '../../../services/ordersItemsService';

interface ProductItem {
  id: string;
  name: string;
  detail?: string;
  quantity: number;
  price?: number;
}

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
        const orderData = await ordersService.findOne(parseInt(id));
        
        // Formatear número de pedido
        setOrderNumber(`Pedido Nº ${orderData.id.toString().padStart(6, '0')}`);
        
        // Formatear fecha
        if (orderData.createdAt) {
          const date = new Date(orderData.createdAt);
          setOrderDate(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }));
        }

        // Nombre del cliente
        setClientName(orderData.client?.name || 'Sin cliente');

        // 2. Cargar items de la orden
        const items = await ordersItemsService.findAll({ orderId: orderData.id });

        // 3. Mapear items a formato ProductItem
        const mappedProducts: ProductItem[] = items.map(item => ({
          id: item.productId.toString(),
          name: item.product?.name || 'Producto',
          detail: item.product?.description || item.product?.sku || '',
          quantity: item.quantity,
          price: item.product?.price
        }));

        setProducts(mappedProducts);

      } catch (err: any) {
        console.error('Error loading order data:', err);
        setError(err.message || 'Error al cargar los datos del pedido');
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [id]);

  const handleRepeatOrder = () => {
    if (!token) return;

    // Guardar productos del pedido histórico en localStorage para que NewOrder los cargue
    const productsToRepeat = products.filter(p => p.quantity > 0);
    localStorage.setItem(`cart-${token}`, JSON.stringify(productsToRepeat));

    // Navegar a NewOrder con el token
    navigate(`/NewOrder?token=${token}`);
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
      <Header title={orderNumber} subtitle={orderDate}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => navigate(backPath)}
          style={{ cursor: 'pointer' }}
        >
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>

        <svg width="24" height="24" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M18.25 0.75H1.75C0.921573 0.75 0.25 1.42157 0.25 2.25V15.75C0.25 16.5784 0.921573 17.25 1.75 17.25H18.25C19.0784 17.25 19.75 16.5784 19.75 15.75V2.25C19.75 1.42157 19.0784 0.75 18.25 0.75ZM18.25 15.75H1.75V2.25H18.25V15.75ZM14.5 5.25C14.5 7.73528 12.4853 9.75 10 9.75C7.51472 9.75 5.5 7.73528 5.5 5.25C5.5 4.83579 5.83579 4.5 6.25 4.5C6.66421 4.5 7 4.83579 7 5.25C7 6.90685 8.34315 8.25 10 8.25C11.6569 8.25 13 6.90685 13 5.25C13 4.83579 13.3358 4.5 13.75 4.5C14.1642 4.5 14.5 4.83579 14.5 5.25Z" fill="#0D141C"/>
        </svg>
      </Header>

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