import { useEffect, useState } from 'react';
import Table, { TableColumn } from "../../../../components/desktop/Table/Table";
import AddProducts from "../../Manage/Products/AddProducts";
import EditProducts from "../../Manage/Products/EditProducts";
import { Product } from '@/services/productsService';
import { productsService } from '../../../../services/productsService';

const ProductsDesktop = () => {
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Cargar productos al montar el componente
	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			setError(null);
			const productsData = await productsService.findAll();
			setProducts(productsData);
		} catch (err: any) {
			console.error('Error al cargar productos:', err);
			setError(err.message || 'Error al cargar la lista de productos');
		} finally {
			setLoading(false);
		}
	};

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

	// Transformar datos de productos para la tabla
	const tableData = products.map(product => ({
		id: product.id.toString().padStart(6, '0'),
		name: product.name,
		category: product.category?.name || '',
		price: product.price,
		stock: product.stock,
		edit: 'Selecciona para editar'
	}));

	const handleAddNew = () => {
		setShowAddProductPopup(true);
	};

  const handleCloseAddProductPopup = () => {
		setShowAddProductPopup(false);
	};

  const handleCloseEditProductPopup = () => {
    setEditingProduct(null);
  };

	// Callback que se ejecuta cuando se agrega un producto exitosamente
	const handleProductAdded = () => {
		fetchProducts();
		console.log('Producto agregado, lista actualizada');
	};

  const handleRowClick = (row: any) => {
    const found = products.find(p => p.id.toString().padStart(6, '0') === row.id);
    if (found) setEditingProduct(found);
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
					title="Gestión de Productos"
					subtitle="Crear, editar y eliminar productos"
					columns={columns}
					data={tableData}
					onAddNew={handleAddNew}
					onRowClick={handleRowClick}
					loading={loading}
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
					onProductAdded={handleProductAdded}
				/>
			)}

          {editingProduct && (
            <EditProducts
              desktop={true}
              onClose={handleCloseEditProductPopup}
              product={editingProduct}
              onProductUpdated={() => {
                fetchProducts();
                handleCloseEditProductPopup();
              }}
            />
          )}
		</>
  );
}

export default ProductsDesktop;