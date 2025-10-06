import { useState } from 'react';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import AddSellers from "../../Manage/Sellers/AddSellers";

const SellersDesktop = () => {
  const [showAddSellerPopup, setShowAddSellerPopup] = useState(false);

	const columns: TableColumn[] = [
		{ key: 'id', label: 'ID Vendedor', sortable: true, width: '120px' },
		{ key: 'name', label: 'Vendedor', sortable: true },
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
		{ id: '000001', name: 'Vendedor 1', phone: '1234567890', address: 'Av. Principal 123', edit: 'Selecciona para editar' },
		{ id: '000002', name: 'Vendedor 2', phone: '1234567890', address: 'Calle Secundaria 456', edit: 'Selecciona para editar' },
		{ id: '000003', name: 'Vendedor 3', phone: '1234567890', address: 'Plaza Central 789', edit: 'Selecciona para editar' },
		{ id: '000004', name: 'Vendedor 4', phone: '1234567890', address: 'Boulevard Norte 321', edit: 'Selecciona para editar' },
		{ id: '000005', name: 'Vendedor 5', phone: '1234567890', address: 'Avenida Sur 654', edit: 'Selecciona para editar' },
	];

	const handleAddNew = () => {
		setShowAddSellerPopup(true);
	};

	const handleCloseAddSellerPopup = () => {
		setShowAddSellerPopup(false);
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
					title="Gestión de Vendedores"
					subtitle="Crear, editar y eliminar vendedores"
					columns={columns}
					data={data}
					onAddNew={handleAddNew}
					onRowClick={handleRowClick}
					searchPlaceholder="Buscar por vendedor, ID o email..."
					addButtonText="Nuevo Vendedor"
					emptyMessage="No hay vendedores disponibles"
				/>
			</div>

			{/* Add Seller Popup */}
			{showAddSellerPopup && (
				<AddSellers 
					desktop={true} 
					onClose={handleCloseAddSellerPopup}
				/>
			)}
		</>
  );
}

export default SellersDesktop;