import Header from "../../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import SearchBar from "../../../../../components/common/SearchBar/SearchBar";
import InfoRow from "../../../../../components/common/InfoRow/InfoRow";
import { LuClipboardList, LuPlus } from 'react-icons/lu';
import { useEffect, useState } from "react";
import { Seller, sellersService } from "../../../../../services/sellersService";
import { useNavigate } from "react-router-dom";

const SellersList = () => {
  const PAGE_SIZE = 10;

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar vendedores al montar el componente
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const sellersData = await sellersService.findAll();
      setSellers(sellersData);
      setFilteredSellers(sellersData);
      setVisibleCount(PAGE_SIZE);
    } catch (err: any) {
      console.error('Error al cargar vendedores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar vendedores cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSellers(sellers);
      setVisibleCount(PAGE_SIZE);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = sellers.filter(seller => 
      seller.username.toLowerCase().includes(searchLower) ||
      seller.name.toLowerCase().includes(searchLower) ||
      seller.email.toLowerCase().includes(searchLower) ||
      seller.phone.includes(searchLower)
    );

    setFilteredSellers(filtered);
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, sellers]);
  
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
          <h2>Vendedores</h2>
        </SectionTitle>
        <BtnBlue width="3rem" height="3rem" borderRadius="24px">
          <Link to="/Manage/AddSellers" style={{ textDecoration: 'none', color: 'inherit' }}>
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
        <SearchBar placeholder="Buscar vendedores"
          value={searchTerm}
          onChange={handleSearch} />

      { /* Sellers List */ }
      <InfoRow className="row-header hide-header-action"
        columns={[
          <span key={'name'}>Nombre</span>,
          <span key={'phone'}>Teléfono</span>,
        ]}
        actionIcon={<LuClipboardList />}
      />
      
      { /* Loading state */ }
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          Cargando vendedores...
        </div>
      )}
      
      { /* Empty state */ }
      {!loading && filteredSellers.length === 0 && searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No se encontraron vendedores con "{searchTerm}"
        </div>
      )}
      
      { /* Sellers list */ }
      {/* Espacio reservado para el botón "Volver" arriba del BottomNav */}
      <div style={{ paddingBottom: '120px' }}>
        {filteredSellers.slice(0, visibleCount).map((seller) => (
          <InfoRow
            key={seller.id}
            columns={[
              <span key={'name'}>{seller.name}</span>,
              <span key={'phone'}>{seller.phone}</span>,
            ]}
            actionLabel="Editar"
            actionIcon={<LuClipboardList />}
            onActionClick={() => navigate(`/Manage/EditSeller/${seller.id}`)}
            onRowClick={() => navigate(`/Manage/EditSeller/${seller.id}`)}
          />
        ))}
        
        {/* Cargar más (dentro del contenedor de padding para que no tape el BottomNav) */}
        {!loading && filteredSellers.length > visibleCount && (
          <div style={{ padding: '0 1rem', marginTop: '0.5rem' }}>
            <BtnBlue
              width="100%"
              height="3rem"
              isBackButton={false}
              onClick={() =>
                setVisibleCount((c) =>
                  Math.min(filteredSellers.length, c + PAGE_SIZE)
                )
              }
            >
              <span>Cargar más</span>
            </BtnBlue>
          </div>
        )}
      </div>

      { /* Empty state */ }
      {!loading && filteredSellers.length === 0 && !searchTerm && sellers.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No hay vendedores disponibles
        </div>
      )}

      {/* Back Button */}
      <Link to="/Manage/AdminSellers" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
};

export default SellersList;