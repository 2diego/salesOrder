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
import SegmentedTabs, { SegmentedTab } from '../../../../components/mobile/SegmentedTabs/SegmentedTabs';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'validated' | 'processed' | 'cancelled' | 'pending' | 'all'>('validated');

  const tabs: SegmentedTab[] = [
    { key: 'validated', label: 'Validado' },
    { key: 'processed', label: 'Cargado' },
    { key: 'cancelled', label: 'Cancelado' },
    { key: 'pending', label: 'Pendiente' },
    { key: 'all', label: 'Todos' },
  ];

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const getStatusParam = (): OrderStatus | undefined => {
    switch (statusFilter) {
      case 'pending':
        return OrderStatus.PENDING;
      case 'validated':
        return OrderStatus.VALIDATED;
      case 'processed':
        return OrderStatus.PROCESSED;
      case 'cancelled':
        return OrderStatus.CANCELLED;
      default:
        return undefined;
    }
  };

  // Debounce search -> server-side
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch paginado server-side
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await ordersService.findPaged({
          page,
          limit,
          status: getStatusParam(),
          q: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
        });

        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);

        if (page === 1) setOrders(result.data);
        else setOrders(prev => [...prev, ...result.data]);
      } catch (err: any) {
        console.error('Error al cargar pedidos:', err);
        setError(err.message || 'Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, statusFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusChange = (value: typeof statusFilter) => {
    if (value === statusFilter) {
      // Si toca la misma tab activa, no vaciar listado.
      // Solo reiniciar a página 1 si estaba paginado.
      if (page !== 1) setPage(1);
      return;
    }

    setStatusFilter(value);
    setPage(1);
    setOrders([]);
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
      [OrderStatus.PROCESSED]: { text: 'Cargado', color: '#6d4aff' },
      [OrderStatus.CANCELLED]: { text: 'Cancelado', color: '#8d2121ff' },
    };
    return statusMap[status] || { text: status, color: '#4D7099' };
  };

  return (
    <>
      {/* Header */}  
      <Header>
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

      {/* Status Filter */}
      <div style={{ marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
        <SegmentedTabs
          tabs={tabs}
          activeKey={statusFilter}
          onChange={(key) => handleStatusChange(key as typeof statusFilter)}
          stretch={true}
        />
      </div>

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
      {!loading && orders.length === 0 && searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No se encontraron pedidos con "{searchTerm}"
        </div>
      )}

      {/* Empty state - sin pedidos */}
      {!loading && orders.length === 0 && !searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No hay pedidos disponibles para el filtro seleccionado
        </div>
      )}

      {/* Order History Header */}
      {!loading && orders.length > 0 && (
        <InfoRow className="row-header mobile-compact"
          columns={[
            <span key={'order'}>Pedido</span>,
            <span key={'client'}>Cliente / Estado</span>,
          ]}
        />
      )}

      {/* Orders List */}
      {/* Espacio reservado para el botón "Volver" arriba del BottomNav */}
      <div style={{ paddingBottom: '120px' }}>
        {orders.map((order) => {
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
              onActionClick={() =>
                order.status === OrderStatus.PENDING
                  ? navigate(`/ValidateOrder/${order.id}`)
                  : navigate(`/HistoryOrderDetails/${order.id}`)
              }
            />
          );
        })}

        {!loading && !error && (
          <div
            style={{
              padding: '0.5rem 1rem 0.25rem',
              color: '#4D7099',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Total pedidos: {totalCount}
          </div>
        )}

        {/* Cargar más (dentro del contenedor de padding para que no tape el BottomNav) */}
        {!loading && orders.length > 0 && page < totalPages && (
          <div style={{ padding: '1.25rem 1rem' }}>
            <BtnBlue
              width="100%"
              height="3rem"
              onClick={() => setPage((p) => p + 1)}
              isBackButton={false}
            >
              <span>Cargar más</span>
            </BtnBlue>
          </div>
        )}
      </div>

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