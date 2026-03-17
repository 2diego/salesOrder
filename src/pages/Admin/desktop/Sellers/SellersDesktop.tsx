import { useEffect, useState } from 'react';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import AddSellers from "../../mobile/Manage/Sellers/AddSellers";
import EditSellers from "../../mobile/Manage/Sellers/EditSellers";
import { Seller, sellersService } from '../../../../services/sellersService';

const SellersDesktop = () => {
  const [showAddSellerPopup, setShowAddSellerPopup] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
	const [sellers, setSellers] = useState<Seller[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Cargar vendedores al montar el componente
	useEffect(() => {
		fetchSellers();
	}, []);

	const fetchSellers = async () => {
		try {
			setLoading(true);
			setError(null);
			const sellersData = await sellersService.findAll();
			setSellers(sellersData);
		} catch (err: any) {
			console.error('Error al cargar vendedores:', err);
			setError(err.message || 'Error al cargar la lista de vendedores');
		} finally {
			setLoading(false);
		}
	};

	const columns: TableColumn[] = [
		{ key: 'id', label: 'ID Vendedor', sortable: true, width: '12%' },
		{ key: 'username', label: 'Nombre de usuario', sortable: true, width: '20%' },
		{ key: 'name', label: 'Vendedor', sortable: true, width: '23%' },
		{ key: 'phone', label: 'Teléfono', sortable: true, width: '15%' },
		{ key: 'email', label: 'Correo electrónico', sortable: true, width: '30%' }
	];

	// Transformar datos de vendedores para la tabla
	const tableData = sellers.map(seller => ({
		id: seller.id.toString().padStart(6, '0'), // Formatear ID con ceros a la izquierda
		username: seller.username,
		name: seller.name,
		email: seller.email,
		phone: seller.phone
	}));

	const handleAddNew = () => {
		setShowAddSellerPopup(true);
	};

  const handleCloseAddSellerPopup = () => {
		setShowAddSellerPopup(false);
	};

  const handleCloseEditSellerPopup = () => {
    setEditingSeller(null);
  };

	// Callback que se ejecuta cuando se agrega un vendedor exitosamente
	const handleSellerAdded = () => {
		fetchSellers(); // Recargar la lista de vendedores
		console.log('Vendedor agregado, lista actualizada');
	};

  const handleRowClick = (row: any) => {
    const found = sellers.find(s => s.id.toString().padStart(6, '0') === row.id);
    if (found) setEditingSeller(found);
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
				{/* Mostrar error si hay */}
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
					title="Gestión de Vendedores"
					subtitle="Crear, editar y eliminar vendedores"
					columns={columns}
					data={tableData}
					onAddNew={handleAddNew}
					onRowClick={handleRowClick}
					loading={loading}
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
					onSellerAdded={handleSellerAdded}
				/>
			)}

          {editingSeller && (
            <EditSellers
              desktop={true}
              onClose={handleCloseEditSellerPopup}
              seller={editingSeller}
              onSellerUpdated={() => {
                fetchSellers();
                handleCloseEditSellerPopup();
              }}
            />
          )}
		</>
  );
}

export default SellersDesktop;