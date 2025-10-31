import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import InfoRow from "../../../../components/InfoRow/InfoRow";
import { LuClipboardList, LuPlus } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { productsService, Product } from "../../../../services/productsService";
import { useNavigate } from 'react-router-dom';

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar productos al montar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await productsService.findAll();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err: any) {
        console.error('Error al cargar productos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.id.toString().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.category?.name && product.category.name.toLowerCase().includes(searchLower)) ||
      (product.sku && product.sku.toLowerCase().includes(searchLower))
    );
    
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LiaToolsSolid fontSize={"1.75rem"}/>
      </Header>

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionTitle>
          <h2>Productos</h2>
        </SectionTitle>
        <BtnBlue width="3rem" height="3rem" borderRadius="24px">
          <Link to="/Manage/AddProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span><LuPlus style={{ fontSize: "2rem" }} /></span>
          </Link>
        </BtnBlue>
      </div>


      { /* Error Message */ }
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          color: '#ef4444', 
          padding: '1rem', 
          borderRadius: '8px', 
          margin: '1rem' 
        }}>
          {error}
        </div>
      )}

      { /* Search Bar */ }
      <SearchBar 
        placeholder="Buscar productos" 
        value={searchTerm}
        onChange={handleSearch}
      />

      { /* Products List */ }
      <InfoRow className="row-header"
        columns={[
          <span key={'id'}>Código</span>,
          <span key={'name'}>Nombre</span>,
          <span key={'category'}>Categoría</span>
        ]}
        actionIcon={<LuClipboardList />}
      />
      
      {/* Loading state */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          Cargando productos...
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredProducts.length === 0 && searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No se encontraron productos con "{searchTerm}"
        </div>
      )}

      {!loading && filteredProducts.length === 0 && !searchTerm && products.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No hay productos disponibles
        </div>
      )}

      {/* Products list */}
      {filteredProducts.map((product) => (
        <InfoRow
          key={product.id}
          columns={[
            <span key={'id'}>{product.id}</span>,
            <span key={'name'}>{product.name}</span>,
            <span key={'category'}>{product.category?.name || 'Sin categoría'}</span>
          ]}
          actionLabel="Editar"
          actionIcon={<LuClipboardList />}
          onActionClick={() => navigate(`/Manage/EditProduct/${product.id}`)}
          onRowClick={() => navigate(`/Manage/EditProduct/${product.id}`)}
        />
      ))}

      {/* Back Button */}
      <Link to="/Manage/AdminProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
};

export default ProductsList;