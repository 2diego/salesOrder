import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../components/BtnBlue/BtnBlue";
import InfoRow from "../../../components/InfoRow/InfoRow";
import { LuClipboardList } from 'react-icons/lu';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { ordersService, Order, OrderStatus } from "../../../services/ordersService";

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
      [OrderStatus.PENDING]: { text: 'Pendiente', color: '#8d2121ff' },
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
        <InfoRow className="row-header"
          columns={[
            <span key={'date'}>Fecha</span>,
            <span key={'id'}>Nro de pedido</span>,
            <span key={'client'}>Cliente</span>,
            <span key={'status'}>Estado</span>,
          ]}
          actionIcon={<LuClipboardList />}
        />
      )}

      {/* Orders List */}
      {filteredOrders.map((order) => {
        const statusInfo = formatStatus(order.status);
        return (
          <InfoRow
            key={order.id}
            columns={[
              <span key={'date'}>{formatDate(order.createdAt)}</span>,
              <span key={'id'}>{formatOrderNumber(order.id)}</span>,
              <span key={'client'}>{order.client?.name || 'Sin cliente'}</span>,
              <span key={'status'} style={{ color: statusInfo.color, fontWeight: 'bold' }}>
                {statusInfo.text}
              </span>,
            ]}
            actionLabel="Ver más"
            actionIcon={<LuClipboardList />}
            onActionClick={() => navigate(`/HistoryOrderDetails/${order.id}`)}
          />
        );
      })}

      {/* Back Button */}
      <Link to="/Manage" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
}

export default OrderHistory