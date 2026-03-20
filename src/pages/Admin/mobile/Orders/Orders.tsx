import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../../../components/common/Header/Header";
import BtnBlue from "../../../../components/common/BtnBlue/BtnBlue"
import { LuClipboardList } from "react-icons/lu";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import InfoRow from '../../../../components/common/InfoRow/InfoRow';
import SearchBar from '../../../../components/common/SearchBar/SearchBar';
import { ordersService, Order, OrderStatus } from "../../../../services/ordersService";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search -> server-side
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch paginado server-side para pedidos pendientes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await ordersService.findPaged({
          page,
          limit,
          status: OrderStatus.PENDING,
          q: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
        });

        setTotalPages(result.totalPages || 1);

        if (page === 1) setOrders(result.data);
        else setOrders((prev) => [...prev, ...result.data]);
      } catch (err: any) {
        console.error('Error al cargar pedidos:', err);
        setError(err.message || 'Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, debouncedSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    setOrders([]);
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
      {!loading && orders.length === 0 && searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No se encontraron pedidos con "{searchTerm}"
        </div>
      )}

      {/* Empty state - sin pedidos */}
      {!loading && orders.length === 0 && !searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No hay pedidos sin validar
        </div>
      )}

      {/* Orders List */}
      {/* Espacio reservado para el botón "Volver" arriba del BottomNav */}
      <div style={{ paddingBottom: '120px' }}>
      {orders.map((order) => (
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

      {/* Cargar más (dentro del contenedor de padding para que no tape el BottomNav) */}
      {!loading && orders.length > 0 && page < totalPages && (
        <div style={{ padding: '0 1rem', marginTop: '1rem' }}>
          <BtnBlue
            width="100%"
            height="3rem"
            isBackButton={false}
            onClick={() => setPage((p) => p + 1)}
          >
            <span>Cargar más</span>
          </BtnBlue>
        </div>
      )}
      </div>


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