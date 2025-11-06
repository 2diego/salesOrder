import { useState, useEffect } from 'react';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import { ordersService, Order, OrderStatus } from "../../../../services/ordersService";

const OrdersDesktop = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				setError(null);
				const ordersData = await ordersService.findAll();
				setOrders(ordersData);
			} catch (err: any) {
				console.error('Error al cargar pedidos:', err);
				setError(err.message || 'Error al cargar los pedidos');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

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
		console.log('Pedido seleccionado:', row.order);
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
				title="Gestión de Pedidos"
				subtitle="Administra todos los pedidos del sistema"
				columns={columns}
				data={tableData}
				onAddNew={handleAddNew}
				onRowClick={handleRowClick}
				loading={loading}
				searchPlaceholder="Buscar por cliente, ID o teléfono..."
				addButtonText="Nuevo Pedido"
				emptyMessage="No hay pedidos disponibles"
			/>
		</div>
  );
}

export default OrdersDesktop;