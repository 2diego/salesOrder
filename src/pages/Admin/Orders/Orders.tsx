import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../../components/Header/Header";
import BtnBlue from "../../../components/BtnBlue/BtnBlue"
import { LuClipboardList } from "react-icons/lu";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import InfoRow from '../../../components/InfoRow/InfoRow';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { ordersService, Order, OrderStatus } from "../../../services/ordersService";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Cargar pedidos sin validar (PENDING) al montar
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const ordersData = await ordersService.findAll({ status: OrderStatus.PENDING });
        
        // Filtrar órdenes vacías (sin items) que son solo para generar links
        // Estas órdenes se crean solo como contenedor para el link y no deben mostrarse
        // hasta que el cliente las complete con items
        const ordersWithItems = ordersData.filter(order => 
          order.orderItems && order.orderItems.length > 0
        );
        
        setOrders(ordersWithItems);
        setFilteredOrders(ordersWithItems);
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
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuClipboardList />
      </Header>

      {/* Orders Title */}
      <SectionTitle>
        <h2>Pedidos sin validar</h2>
      </SectionTitle>

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

      {/* Search Bar */}
      <SearchBar 
        placeholder="Buscar por cliente, ID o teléfono..." 
        value={searchTerm}
        onChange={handleSearch}
      />
      
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
          No hay pedidos sin validar
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.map((order) => (
        <InfoRow
          key={order.id}
          columns={[
            <span key={'date'}>{formatDate(order.createdAt)}</span>,
            <span key={'client-name'}>{order.client?.name || 'Sin cliente'}</span>,
          ]}
          actionLabel="Ver pedido"
          actionIcon={<LuClipboardList />}
          onActionClick={() => navigate(`/ValidateOrder/${order.id}`)}
        />
      ))}


      {/* Bottom Actions Block */}
      <div className="bottom-actions-block" style={{
        position: 'fixed',
        bottom: 84,
        left: 0,
        right: 0,
      }}>

        {/* Generate Link Button */}
        <Link to="/OrderHistory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <BtnBlue width="100%" height="3rem">
            <span>Historial de pedidos</span>
          </BtnBlue>
        </Link>
        
      </div>
    </>
  )
}

export default Orders