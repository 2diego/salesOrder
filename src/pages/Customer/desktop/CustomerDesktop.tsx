import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import { ordersLinksService } from '../../../services/ordersLinksService';
import { clientsService } from '../../../services/clientsService';
import { productsService, Product } from '../../../services/productsService';
import { categoriesService } from '../../../services/categoriesService';
import { ordersItemsService } from '../../../services/ordersItemsService';
import { ordersService, Order } from '../../../services/ordersService';
import {
  ClientDataPanel,
  ProductsPanel,
  CartPanel,
  OrderHistoryPanel,
  type ProductItem,
} from '../../../components/desktop/CustomerPanels';
import { mapApiProductToItem, mapOrderItemToProductItem } from '../../../utils/mapProductItem';
import './CustomerDesktop.css';

const CustomerDesktop = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [orderSent, setOrderSent] = useState(false);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedHistoryOrderId, setSelectedHistoryOrderId] = useState<number | null>(null);
  const [historyProducts, setHistoryProducts] = useState<ProductItem[]>([]);
  const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setError('Token no encontrado en la URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const orderLink = await ordersLinksService.findByToken(token);

        if (!orderLink.order?.client) {
          throw new Error('No se encontró información del cliente');
        }

        const clientId = orderLink.order.clientId;
        const orderIdValue = orderLink.orderId;
        setOrderId(orderIdValue);
        setOrderNumber(`Pedido Nº ${orderIdValue.toString().padStart(8, '0')}`);

        if (orderLink.createdAt) {
          const date = new Date(orderLink.createdAt);
          setOrderDate(
            date.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
          );
        }

        if (orderLink.expiresAt) {
          setExpiresAt(orderLink.expiresAt);
        }

        const client = await clientsService.findOne(clientId);
        setClientName(client.name);
        setClientAddress(client.address || '');

        const productsData = await productsService.findAll();
        setAllProducts(productsData);

        const categoriesData = await categoriesService.findAll();
        const activeCategories = categoriesData.filter((cat) => cat.isActive);
        setCategories(['Todos', ...activeCategories.map((cat) => cat.name)]);

        const existingItems = await ordersItemsService.findAll({ orderId: orderIdValue });
        const savedProducts = localStorage.getItem(`cart-${token}`);

        if (existingItems.length > 0) {
          setOrderSent(true);
        }

        const initialQuantities: Record<string, number> = {};

        if (existingItems.length > 0) {
          existingItems.forEach((item) => {
            if (item.quantity > 0) {
              initialQuantities[item.productId.toString()] = item.quantity;
            }
          });
        } else if (savedProducts) {
          try {
            const savedProductsArray: ProductItem[] = JSON.parse(savedProducts);
            savedProductsArray.forEach((product) => {
              if (product.quantity > 0) {
                initialQuantities[product.id] = product.quantity;
              }
            });
          } catch (e) {
            console.error('Error parsing saved products:', e);
          }
        }

        const mappedProducts: ProductItem[] = productsData
          .filter((product) => product.isActive)
          .map((product) =>
            mapApiProductToItem(product, initialQuantities[product.id.toString()] || 0),
          );

        setFilteredProducts(mappedProducts);
        setProductQuantities(initialQuantities);

        const clientOrders = await ordersService.findAll({ clientId });
        const sortedOrders = clientOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        setOrders(sortedOrders);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setTimeRemaining('Este enlace ha caducado');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(
          `Este enlace caduca en ${hours} hora${hours !== 1 ? 's' : ''}${
            minutes > 0 ? ` y ${minutes} minuto${minutes !== 1 ? 's' : ''}` : ''
          }`,
        );
      } else if (minutes > 0) {
        setTimeRemaining(
          `Este enlace caduca en ${minutes} minuto${minutes !== 1 ? 's' : ''}${
            seconds > 0 ? ` y ${seconds} segundo${seconds !== 1 ? 's' : ''}` : ''
          }`,
        );
      } else {
        setTimeRemaining(
          `Este enlace caduca en ${seconds} segundo${seconds !== 1 ? 's' : ''}`,
        );
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    let productsToShow: Product[];

    if (activeCategory === 'Todos') {
      productsToShow = allProducts.filter((product) => product.isActive);
    } else {
      productsToShow = allProducts.filter(
        (product) => product.isActive && product.category?.name === activeCategory,
      );
    }

    const mappedProducts: ProductItem[] = productsToShow.map((product) =>
      mapApiProductToItem(product, productQuantities[product.id.toString()] || 0),
    );

    setFilteredProducts(mappedProducts);
  }, [activeCategory, allProducts, productQuantities]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const updateQuantity = (productId: string, change: number) => {
    if (orderSent) return;

    setProductQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      const updatedQuantities = {
        ...prevQuantities,
        [productId]: newQuantity,
      };

      if (token && !orderSent) {
        const productsWithQuantities = allProducts
          .filter((product) => product.isActive)
          .map((product) =>
            mapApiProductToItem(product, updatedQuantities[product.id.toString()] || 0),
          )
          .filter((p) => p.quantity > 0);

        localStorage.setItem(`cart-${token}`, JSON.stringify(productsWithQuantities));
      }

      return updatedQuantities;
    });
  };

  const cartProducts = useMemo<ProductItem[]>(() => {
    return allProducts
      .filter((product) => product.isActive)
      .map((product) =>
        mapApiProductToItem(product, productQuantities[product.id.toString()] || 0),
      )
      .filter((p) => p.quantity > 0);
  }, [allProducts, productQuantities]);

  const handleSendOrder = async () => {
    if (!orderId || !token) {
      setError('No se puede enviar el pedido: falta información de la orden');
      return;
    }

    const productsToSend = cartProducts.filter((p) => p.quantity > 0);

    if (productsToSend.length === 0) {
      setError('Debe seleccionar al menos un producto para enviar el pedido');
      return;
    }

    try {
      setSending(true);
      setError(null);

      for (const product of productsToSend) {
        await ordersItemsService.create({
          orderId,
          productId: parseInt(product.id),
          quantity: product.quantity,
        });
      }

      localStorage.removeItem(`cart-${token}`);
      setOrderSent(true);
    } catch (err: any) {
      console.error('Error sending order:', err);
      setError(err.message || 'Error al enviar el pedido');
      setSending(false);
    }
  };

  const loadHistoryOrderDetails = async (order: Order) => {
    setSelectedHistoryOrderId(order.id);
    setLoadingHistoryDetail(true);
    setHistoryProducts([]);

    try {
      const items = await ordersItemsService.findAll({ orderId: order.id });
      const mappedProducts: ProductItem[] = items.map((item) => mapOrderItemToProductItem(item));
      setHistoryProducts(mappedProducts);
    } catch (err) {
      console.error('Error loading history order details:', err);
    } finally {
      setLoadingHistoryDetail(false);
    }
  };

  const handleRepeatHistoryOrder = () => {
    if (!token || orderSent || historyProducts.length === 0) return;

    const nextQuantities: Record<string, number> = {};

    historyProducts.forEach((product) => {
      if (product.quantity > 0) {
        nextQuantities[product.id] = product.quantity;
      }
    });

    setProductQuantities(nextQuantities);

    const productsToSave = historyProducts.filter((p) => p.quantity > 0);
    localStorage.setItem(`cart-${token}`, JSON.stringify(productsToSave));

    setActiveCategory('Todos');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatOrderNumber = (id: number) => {
    return `Pedido Nº ${id.toString().padStart(8, '0')}`;
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
    <div className="customer-desktop">
      <Header title={orderNumber || 'Pedido'} subtitle={orderDate || ''}>
        <span />
        <span />
      </Header>

      <div className="customer-desktop-timer-row">
        <span className="customer-desktop-timer">
          {timeRemaining || 'Este enlace caduca en 24 horas'}
        </span>
      </div>

      <div className="customer-desktop-content">
        <div className="customer-desktop-left">
          <ClientDataPanel clientName={clientName} clientAddress={clientAddress} />
          <ProductsPanel
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            products={filteredProducts}
            onQuantityChange={orderSent ? undefined : updateQuantity}
            orderSent={orderSent}
          />
        </div>

        <div className="customer-desktop-right">
          <CartPanel
            products={cartProducts}
            onQuantityChange={orderSent ? undefined : updateQuantity}
            orderSent={orderSent}
            sending={sending}
            onSendOrder={handleSendOrder}
          />
          <OrderHistoryPanel
            orders={orders}
            selectedOrderId={selectedHistoryOrderId}
            historyProducts={historyProducts}
            loadingDetail={loadingHistoryDetail}
            orderSent={orderSent}
            onSelectOrder={loadHistoryOrderDetails}
            onRepeatOrder={handleRepeatHistoryOrder}
            formatDate={formatDate}
            formatOrderNumber={formatOrderNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDesktop;
