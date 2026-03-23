import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import { ordersService, Order, OrderStatus } from "../../../../services/ordersService";
import OrderDetailsDesktopPopup from './OrderDetailsDesktopPopup';
import OrderStatusTabs, { OrderDesktopFilter } from './OrderStatusTabs';

const OrdersDesktop = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const statusFilter = searchParams.get('status');
  const mapQueryStatusToFilter = (queryStatus: string | null): OrderDesktopFilter =>
    queryStatus === 'pending'
      ? 'pending'
      : queryStatus === 'validated'
      ? 'validated'
      : queryStatus === 'processed'
      ? 'processed'
      : queryStatus === 'cancelled'
      ? 'cancelled'
      : 'all';

  const initialDesktopFilter: OrderDesktopFilter =
    statusFilter === 'pending'
      ? 'pending'
      : statusFilter === 'validated'
      ? 'validated'
      : statusFilter === 'processed'
      ? 'processed'
      : statusFilter === 'cancelled'
      ? 'cancelled'
      : 'all';

	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedReadOnlyOrderId, setSelectedReadOnlyOrderId] = useState<number | null>(null);
  const [desktopStatusFilter, setDesktopStatusFilter] = useState<OrderDesktopFilter>(initialDesktopFilter);

  const handleDesktopFilterChange = (nextFilter: OrderDesktopFilter) => {
    setPage(1);
    setDesktopStatusFilter(nextFilter);
    navigate(nextFilter === 'all' ? '/Orders' : `/Orders?status=${nextFilter}`);
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const nextFilter = mapQueryStatusToFilter(statusFilter);
    setDesktopStatusFilter(nextFilter);
    setPage(1);
  }, [statusFilter]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				setError(null);
				const result = await ordersService.findPaged({
          page,
          limit,
          status:
            desktopStatusFilter === 'pending'
              ? OrderStatus.PENDING
              : desktopStatusFilter === 'validated'
              ? OrderStatus.VALIDATED
              : desktopStatusFilter === 'processed'
              ? OrderStatus.PROCESSED
              : desktopStatusFilter === 'cancelled'
              ? OrderStatus.CANCELLED
              : undefined,
          q: debouncedSearch.trim() ? debouncedSearch.trim() : undefined
        });
				const ordersData = result.data;
        setTotalPages(result.totalPages || 1);
        setTotal(result.total || 0);

				setOrders(ordersData);
			} catch (err: any) {
				console.error('Error al cargar pedidos:', err);
				setError(err.message || 'Error al cargar los pedidos');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [desktopStatusFilter, page, limit, debouncedSearch]);

	// Formatear el estado a español
	const formatStatus = (status: OrderStatus): string => {
		const statusMap: Record<OrderStatus, string> = {
			[OrderStatus.PENDING]: 'Pendiente',
			[OrderStatus.VALIDATED]: 'Validado',
			[OrderStatus.PROCESSED]: 'Cargado',
			[OrderStatus.CANCELLED]: 'Cancelado',
		};
		return statusMap[status] || status;
	};

	// Mapear los datos de Order a formato de tabla
	const tableData = orders.map(order => ({
		id: order.id,
		name: order.client?.name || 'Sin cliente',
		phone: order.client?.phone || 'N/A',
		address: order.client?.address || 'N/A',
		status: formatStatus(order.status),
		rawStatus: order.status, // Para mantener el estado original para el render
		order: order // Mantener referencia completa del pedido
	}));

	const columns: TableColumn[] = [
		{ key: 'id', label: 'ID Pedido', sortable: true, width: '12%' },
		{ key: 'name', label: 'Cliente', sortable: true, width: '28%' },
		{ key: 'phone', label: 'Teléfono', sortable: true, width: '16%' },
		{ key: 'address', label: 'Dirección', sortable: true, width: '26%' },
		{ 
			key: 'status', 
			label: 'Estado', 
			sortable: true, 
			width: '18%',
			render: (value: string, row: any) => (
				<span className={`status-badge ${row.rawStatus?.toLowerCase() || ''}`}>
					{value}
				</span>
			)
		}
	];

	const handleRowClick = (row: any) => {
		if (row.rawStatus === OrderStatus.PENDING) {
			navigate(`/ValidateOrder/${row.order.id}`);
      return;
		}
    setSelectedReadOnlyOrderId(row.order.id);
	};

  return (
		<div
      className="orders-desktop-page"
      style={{ 
			padding: '2rem', 
			backgroundColor: 'rgb(17, 24, 39)',
			fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
			color: 'var(--mainBlack)',
			marginTop: '4rem'
		}}
    >
			{error && (
				<div style={{ 
					background: 'rgba(239, 68, 68, 0.1)', 
					border: '1px solid rgba(239, 68, 68, 0.3)', 
					color: '#ef4444', 
					padding: '1rem', 
					borderRadius: '8px', 
					marginBottom: '1rem' 
				}}>
					{error}
				</div>
			)}
      <div className="orders-table">
        <Table
				  title={desktopStatusFilter === 'pending' ? 'Pedidos sin validar' : 'Gestión de Pedidos'}
				  subtitle={
          desktopStatusFilter === 'pending'
            ? `Pedidos con estado pendiente de validación (${total})`
            : `Administra todos los pedidos del sistema (${total})`
          }
				  columns={columns}
				  data={tableData}
				  onRowClick={handleRowClick}
				  loading={loading}
				  searchPlaceholder="Buscar por cliente, ID o teléfono..."
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setPage(1);
          setSearchTerm(value);
        }}
          headerActions={
            <OrderStatusTabs
              activeFilter={desktopStatusFilter}
              onChange={handleDesktopFilterChange}
            />
          }
				  emptyMessage={desktopStatusFilter === 'pending' ? 'No hay pedidos sin validar' : 'No hay pedidos disponibles'}
        stickyHeader={true}
			  />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'rgb(233, 232, 232)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Total: {total}</span>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Filas:</span>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(parseInt(e.target.value));
            }}
            style={{
              background: 'rgb(31, 41, 55)',
              border: '1px solid rgba(100,100,100,0.4)',
              color: 'rgb(233, 232, 232)',
              borderRadius: '8px',
              padding: '0.35rem 0.5rem',
              outline: 'none'
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{
              background: 'rgb(31, 41, 55)',
              border: '1px solid rgba(100,100,100,0.4)',
              color: 'rgb(233, 232, 232)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              opacity: loading || page <= 1 ? 0.5 : 1,
              cursor: loading || page <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Anterior
          </button>
          <span style={{ color: 'rgb(233, 232, 232)', fontSize: '0.875rem', opacity: 0.9 }}>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            disabled={loading || page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            style={{
              background: 'rgb(31, 41, 55)',
              border: '1px solid rgba(100,100,100,0.4)',
              color: 'rgb(233, 232, 232)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              opacity: loading || page >= totalPages ? 0.5 : 1,
              cursor: loading || page >= totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Siguiente
          </button>
        </div>
      </div>

      {selectedReadOnlyOrderId && (
        <OrderDetailsDesktopPopup
          orderId={selectedReadOnlyOrderId}
          onClose={() => setSelectedReadOnlyOrderId(null)}
          onStatusUpdated={(orderId, newStatus) => {
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
          }}
        />
      )}
		</div>
  );
}

export default OrdersDesktop;