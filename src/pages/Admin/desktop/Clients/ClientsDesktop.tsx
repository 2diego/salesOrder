import { useState } from 'react';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import AddClients from "../../Manage/Clients/AddClients";

const ClientsDesktop = () => {
  const [showAddClientPopup, setShowAddClientPopup] = useState(false);

	const columns: TableColumn[] = [
		{ key: 'id', label: 'ID Cliente', sortable: true, width: '120px' },
		{ key: 'name', label: 'Cliente', sortable: true },
		{ key: 'phone', label: 'Teléfono', sortable: true, width: '120px' },
		{ key: 'address', label: 'Dirección', sortable: true},
		{ 
			key: 'edit', 
			label: '', 
			sortable: false, 
			width: '50px'
		}
	];

	const data = [
		{ id: '000001', name: 'Juan Perez', phone: '1234567890', address: 'Av. Principal 123', edit: 'Selecciona para editar' },
		{ id: '000002', name: 'Maria Gomez', phone: '1234567890', address: 'Calle Secundaria 456', edit: 'Selecciona para editar' },
		{ id: '000003', name: 'Pedro Rodriguez', phone: '1234567890', address: 'Plaza Central 789', edit: 'Selecciona para editar' },
		{ id: '000004', name: 'Ana Martinez', phone: '1234567890', address: 'Boulevard Norte 321', edit: 'Selecciona para editar' },
		{ id: '000005', name: 'Luis Garcia', phone: '1234567890', address: 'Avenida Sur 654', edit: 'Selecciona para editar' },
		{ id: '000006', name: 'Carmen Lopez', phone: '1234567890', address: 'Calle Este 987', edit: 'Selecciona para editar' },
	];

	const handleAddNew = () => {
		setShowAddClientPopup(true);
	};

	const handleCloseAddClientPopup = () => {
		setShowAddClientPopup(false);
	};

	const handleRowClick = (order: any) => {
		console.log('Editar fila', order);
	};

  return (
		<>
			<div style={{ 
				padding: '2rem', 
				backgroundColor: 'rgb(17, 24, 39)',
				fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
				color: 'var(--mainBlack)',
				marginTop: '4rem'
			}}>
				<Table
					title="Gestión de Clientes"
					subtitle="Crear, editar y eliminar clientes"
					columns={columns}
					data={data}
					onAddNew={handleAddNew}
					onRowClick={handleRowClick}
					searchPlaceholder="Buscar por cliente, ID o email..."
					addButtonText="Nuevo Cliente"
					emptyMessage="No hay clientes disponibles"
				/>
			</div>

			{/* Add Client Popup */}
			{showAddClientPopup && (
				<AddClients 
					desktop={true} 
					onClose={handleCloseAddClientPopup}
				/>
			)}
		</>
  );
}

export default ClientsDesktop;