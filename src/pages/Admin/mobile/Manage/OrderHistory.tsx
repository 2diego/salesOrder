import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/common/BtnBlue/BtnBlue";
import InfoRow from "../../../../components/common/InfoRow/InfoRow";
import { LuClipboardList } from 'react-icons/lu';
import SearchBar from '../../../../components/common/SearchBar/SearchBar';
import { ordersService, Order, OrderStatus } from "../../../../services/ordersService";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los pedidos al montar
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const ordersData = await ordersService.findAll();
        
        // Filtrar órdenes vacías (sin items) que son solo para generar links
        // Estas órdenes se crean solo como contenedor para el link y no deben mostrarse
        // hasta que el cliente las complete con items
        const ordersWithItems = ordersData.filter(order => 
          order.orderItems && order.orderItems.length > 0
        );
        
        // Ordenar por fecha de creación (más recientes primero)
        const sortedOrders = ordersWithItems.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (err: any) {
        console.error('Error al cargar pedidos:', err);
        setError(err.message || 'Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtrar pedidos
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = orders.filter(order => 
      order.id.toString().includes(searchLower) ||
      order.client?.name.toLowerCase().includes(searchLower) ||
      (order.client as any)?.email?.toLowerCase().includes(searchLower) ||
      (order.client as any)?.phone?.includes(searchLower)
    );
    
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Formatear número de pedido
  const formatOrderNumber = (orderId: number): string => {
    return orderId.toString().padStart(6, '0');
  };

  // Formatear estado
  const formatStatus = (status: OrderStatus): { text: string; color: string } => {
    const statusMap: Record<OrderStatus, { text: string; color: string }> = {
      [OrderStatus.PENDING]: { text: 'Pendiente', color: '#c99715ff' },
      [OrderStatus.VALIDATED]: { text: 'Validado', color: '#3c9234ff' },
      [OrderStatus.CANCELLED]: { text: 'Cancelado', color: '#8d2121ff' },
    };
    return statusMap[status] || { text: status, color: '#4D7099' };
  };

  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LiaToolsSolid fontSize={"1.75rem"}/>
      </Header>

      {/* Manage Title */}
      <SectionTitle>
        <h2>Historial de pedidos</h2>
      </SectionTitle>

      {/* Search Bar */}
      <SearchBar 
        placeholder="Buscar por cliente o nro de pedido" 
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          color: '#ef4444', 
          padding: '1rem', 
          borderRadius: '8px', 
          margin: '1rem' 
        }}>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          Cargando pedidos...
        </div>
      )}

      {/* Empty state - con búsqueda */}
      {!loading && filteredOrders.length === 0 && searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No se encontraron pedidos con "{searchTerm}"
        </div>
      )}

      {/* Empty state - sin pedidos */}
      {!loading && filteredOrders.length === 0 && !searchTerm && orders.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No hay pedidos disponibles
        </div>
      )}

      {/* Order History Header */}
      {!loading && filteredOrders.length > 0 && (
        <InfoRow className="row-header mobile-compact"
          columns={[
            <span key={'order'}>Pedido</span>,
            <span key={'client'}>Cliente / Estado</span>,
          ]}
        />
      )}

      {/* Orders List */}
      {filteredOrders.map((order) => {
        const statusInfo = formatStatus(order.status);
        return (
          <InfoRow
            key={order.id}
            className="mobile-compact"
            columns={[
              <div key={'order'} style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span style={{ fontWeight: 600 }}>{formatOrderNumber(order.id)}</span>
                <span style={{ fontSize: '0.85rem' }}>{formatDate(order.createdAt)}</span>
              </div>,
              <div key={'client'} style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span>{order.client?.name || 'Sin cliente'}</span>
                <span style={{ color: statusInfo.color, fontWeight: 700, fontSize: '0.85rem' }}>
                  {statusInfo.text}
                </span>
              </div>,
            ]}
            actionLabel="Ver más"
            actionIcon={<LuClipboardList />}
            onActionClick={() => navigate(`/HistoryOrderDetails/${order.id}`)}
          />
        );
      })}

      {/* Back Button - Vuelve a la página anterior (Orders, Manage o Reports) */}
      <BtnBlue 
        width="100%" 
        height="3rem" 
        isBackButton={true}
        onClick={() => navigate(-1)}
      >
        <span>Volver</span>
      </BtnBlue>
    </>
  )
}

export default OrderHistory