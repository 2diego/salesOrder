import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import { ordersService, Order, OrderStatus } from "../../../../services/ordersService";
import { clientsService } from "../../../../services/clientsService";

const OrdersDesktop = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const statusFilter = searchParams.get('status');
	const showOnlyPending = statusFilter === 'pending';

	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				setError(null);
				const filters = showOnlyPending ? { status: OrderStatus.PENDING } : undefined;
				const ordersData = await ordersService.findAll(filters);
				
				// Cargar datos completos del cliente para las órdenes donde los datos del cliente están incompletos o faltan
				const ordersWithFullClientData: Order[] = await Promise.all(
					ordersData.map(async (order): Promise<Order> => {
						// Verificar si los datos del cliente están incompletos o faltan
						const needsFullClient = order.client && (
							!order.client.phone || (typeof order.client.phone === 'string' && order.client.phone.trim() === '') ||
							!order.client.address || (typeof order.client.address === 'string' && order.client.address.trim() === '')
						);
						
						if (needsFullClient && order.client) {
							try {
								const fullClient = await clientsService.findOne(order.clientId);
								return {
									...order,
									client: {
										...order.client,
										phone: fullClient.phone || order.client.phone || '',
										address: fullClient.address || order.client.address || '',
										city: fullClient.city || order.client.city || '',
									}
								} as Order;
							} catch (err: any) {
								console.warn(`Error loading client data for order ${order.id}:`, err);
								return order;
							}
						} else if (!order.client && order.clientId) {
							// Si el cliente no está cargado, intentar cargarlo
							try {
								const fullClient = await clientsService.findOne(order.clientId);
								return {
									...order,
									client: {
										id: fullClient.id,
										name: fullClient.name,
										email: fullClient.email,
										phone: fullClient.phone || '',
										address: fullClient.address || '',
										city: fullClient.city || '',
									}
								} as Order;
							} catch (err: any) {
								console.warn(`Error loading client data for order ${order.id}:`, err);
								return order;
							}
						}
						
						return order;
					})
				);
				
				setOrders(ordersWithFullClientData);
			} catch (err: any) {
				console.error('Error al cargar pedidos:', err);
				setError(err.message || 'Error al cargar los pedidos');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [showOnlyPending]);

	// Formatear el estado a español
	const formatStatus = (status: OrderStatus): string => {
		const statusMap: Record<OrderStatus, string> = {
			[OrderStatus.PENDING]: 'Pendiente',
			[OrderStatus.VALIDATED]: 'Validado',
			[OrderStatus.CANCELLED]: 'Cancelado',
		};
		return statusMap[status] || status;
	};

	// Filtrar órdenes vacías (sin items) que son solo para generar links
	// Estas órdenes se crean solo como contenedor para el link y no deben mostrarse
	// hasta que el cliente las complete con items
	const ordersWithItems = orders.filter(order => 
		order.orderItems && order.orderItems.length > 0
	);

	// Mapear los datos de Order a formato de tabla
	const tableData = ordersWithItems.map(order => ({
		id: order.id,
		name: order.client?.name || 'Sin cliente',
		phone: order.client?.phone || 'N/A',
		address: order.client?.address || 'N/A',
		status: formatStatus(order.status),
		rawStatus: order.status, // Para mantener el estado original para el render
		order: order // Mantener referencia completa del pedido
	}));

	const columns: TableColumn[] = [
		{ key: 'id', label: 'ID Pedido', sortable: true, width: '120px' },
		{ key: 'name', label: 'Cliente', sortable: true },
		{ key: 'phone', label: 'Teléfono', sortable: true, width: '120px' },
		{ key: 'address', label: 'Dirección', sortable: true },
		{ 
			key: 'status', 
			label: 'Estado', 
			sortable: true, 
			width: '120px',
			render: (value: string, row: any) => (
				<span className={`status-badge ${row.rawStatus?.toLowerCase() || ''}`}>
					{value}
				</span>
			)
		}
	];

	const handleAddNew = () => {
		console.log('Crear nuevo pedido');
	};

	const handleRowClick = (row: any) => {
		if (row.rawStatus === OrderStatus.PENDING) {
			navigate(`/ValidateOrder/${row.order.id}`);
		}
	};

  return (
		<div style={{ 
			padding: '2rem', 
			backgroundColor: 'rgb(17, 24, 39)',
			fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
			color: 'var(--mainBlack)',
			marginTop: '4rem'
		}}>
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
			<Table
				title={showOnlyPending ? 'Pedidos sin validar' : 'Gestión de Pedidos'}
				subtitle={showOnlyPending ? 'Pedidos con estado pendiente de validación' : 'Administra todos los pedidos del sistema'}
				columns={columns}
				data={tableData}
				onAddNew={handleAddNew}
				onRowClick={handleRowClick}
				loading={loading}
				searchPlaceholder="Buscar por cliente, ID o teléfono..."
				addButtonText="Nuevo Pedido"
				emptyMessage={showOnlyPending ? 'No hay pedidos sin validar' : 'No hay pedidos disponibles'}
			/>
		</div>
  );
}

export default OrdersDesktop;