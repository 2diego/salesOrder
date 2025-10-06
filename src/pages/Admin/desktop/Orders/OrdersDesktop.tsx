import Table, { TableColumn } from "../../../../components/desktop/Table/Table";

const OrdersDesktop = () => {

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
			render: (value: string) => (
				<span className={`status-badge ${value.toLowerCase()}`}>
					{value}
				</span>
			)
		}
	];

	const data = [
		{ id: 'ORD-001', name: 'Juan Perez', phone: '1234567890', address: 'Av. Principal 123', status: 'Completado' },
		{ id: 'ORD-002', name: 'Maria Gomez', phone: '1234567890', address: 'Calle Secundaria 456', status: 'Pendiente' },
		{ id: 'ORD-003', name: 'Pedro Rodriguez', phone: '1234567890', address: 'Plaza Central 789', status: 'En Progreso' },
		{ id: 'ORD-004', name: 'Ana Martinez', phone: '1234567890', address: 'Boulevard Norte 321', status: 'Cancelado' },
		{ id: 'ORD-005', name: 'Luis Garcia', phone: '1234567890', address: 'Avenida Sur 654', status: 'Completado' },
		{ id: 'ORD-006', name: 'Carmen Lopez', phone: '1234567890', address: 'Calle Este 987', status: 'Pendiente' },
	];

	const handleAddNew = () => {
		console.log('Crear nuevo pedido');
	};

	const handleRowClick = (order: any) => {
		console.log('Pedido seleccionado:', order);
	};

  return (
		<div style={{ 
			padding: '2rem', 
			backgroundColor: 'rgb(17, 24, 39)',
			fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
			color: 'var(--mainBlack)',
			marginTop: '4rem'
		}}>
			<Table
				title="Gestión de Pedidos"
				subtitle="Administra todos los pedidos del sistema"
				columns={columns}
				data={data}
				onAddNew={handleAddNew}
				onRowClick={handleRowClick}
				searchPlaceholder="Buscar por cliente, ID o email..."
				addButtonText="Nuevo Pedido"
				emptyMessage="No hay pedidos disponibles"
			/>
		</div>
  );
}

export default OrdersDesktop;