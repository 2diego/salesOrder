import { useState, useEffect } from 'react';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import AddClients from "../../Manage/Clients/AddClients";
import EditClients from "../../Manage/Clients/EditClients";
import { clientsService, Client } from "../../../../services/clientsService";

const ClientsDesktop = () => {
  const [showAddClientPopup, setShowAddClientPopup] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const clientsData = await clientsService.findAll();
      setClients(clientsData);
    } catch (err: any) {
      console.error('Error al cargar clientes:', err);
      setError(err.message || 'Error al cargar la lista de clientes');
    } finally {
      setLoading(false);
    }
  };

	const columns: TableColumn[] = [
		{ key: 'id', label: 'ID Cliente', sortable: true, width: '120px' },
		{ key: 'name', label: 'Cliente', sortable: true },
		{ key: 'phone', label: 'Teléfono', sortable: true, width: '120px' },
		{ key: 'address', label: 'Dirección', sortable: true},
		{ key: 'city', label: 'Ciudad', sortable: true},
		{ 
			key: 'edit', 
			label: '', 
			sortable: false, 
			width: '50px'
		}
	];

	// Transformar datos de clientes para la tabla
	const tableData = clients.map(client => ({
		id: client.id.toString().padStart(6, '0'), // Formatear ID con ceros a la izquierda
		name: client.name,
		phone: client.phone,
		address: client.address,
		city: client.city,
		edit: 'Selecciona para editar'
	}));

	const handleAddNew = () => {
		setShowAddClientPopup(true);
	};

  const handleCloseAddClientPopup = () => {
		setShowAddClientPopup(false);
	};

  const handleCloseEditClientPopup = () => {
    setEditingClient(null);
  };

	// Callback que se ejecuta cuando se agrega un cliente exitosamente
	const handleClientAdded = () => {
		fetchClients(); // Recargar la lista de clientes
		console.log('Cliente agregado, lista actualizada');
	};

  const handleRowClick = (row: any) => {
    const found = clients.find(c => c.id.toString().padStart(6, '0') === row.id);
    if (found) setEditingClient(found);
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
					title="Gestión de Clientes"
					subtitle="Crear, editar y eliminar clientes"
					columns={columns}
					data={tableData}
					onAddNew={handleAddNew}
					onRowClick={handleRowClick}
					loading={loading}
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
				onClientAdded={handleClientAdded}
			/>
		)}

        {/* Edit Client Popup */}
        {editingClient && (
          <EditClients
            desktop={true}
            onClose={handleCloseEditClientPopup}
            client={editingClient}
            onClientUpdated={() => {
              fetchClients();
              handleCloseEditClientPopup();
            }}
          />
        )}
		</>
  );
}

export default ClientsDesktop;