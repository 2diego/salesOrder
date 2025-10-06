import { useState } from 'react';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import AddProducts from "../../Manage/Products/AddProducts";

const ProductsDesktop = () => {
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);

	const columns: TableColumn[] = [
		{ key: 'id', label: 'ID Producto', sortable: true, width: '120px' },
		{ key: 'name', label: 'Producto', sortable: true },
		{ key: 'category', label: 'Categoría', sortable: true },
		{ key: 'price', label: 'Precio', sortable: true, width: '120px' },
		{ key: 'stock', label: 'Stock', sortable: true, width: '120px' },
		{ 
			key: 'edit', 
			label: '', 
			sortable: false, 
			width: '50px'
		}
	];

	const data = [
		{ id: '000001', name: 'Producto 1', category: 'Categoría 1', price: 100, stock: 50, edit: 'Selecciona para editar' },
		{ id: '000002', name: 'Producto 2', category: 'Categoría 2', price: 200, stock: 30, edit: 'Selecciona para editar' },
		{ id: '000003', name: 'Producto 3', category: 'Categoría 3', price: 300, stock: 20, edit: 'Selecciona para editar' },
		{ id: '000004', name: 'Producto 4', category: 'Categoría 4', price: 400, stock: 10, edit: 'Selecciona para editar' },
		{ id: '000005', name: 'Producto 5', category: 'Categoría 5', price: 500, stock: 5, edit: 'Selecciona para editar' },
		{ id: '000006', name: 'Producto 6', category: 'Categoría 6', price: 600, stock: 0, edit: 'Selecciona para editar' },
	];

	const handleAddNew = () => {
		setShowAddProductPopup(true);
	};

	const handleCloseAddProductPopup = () => {
		setShowAddProductPopup(false);
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
					title="Gestión de Productos"
					subtitle="Crear, editar y eliminar productos"
					columns={columns}
					data={data}
					onAddNew={handleAddNew}
					onRowClick={handleRowClick}
					searchPlaceholder="Buscar por producto, ID o categoría..."
					addButtonText="Nuevo Producto"
					emptyMessage="No hay productos disponibles"
				/>
			</div>

			{/* Add Product Popup */}
			{showAddProductPopup && (
				<AddProducts 
					desktop={true} 
					onClose={handleCloseAddProductPopup}
				/>
			)}
		</>
  );
}

export default ProductsDesktop;