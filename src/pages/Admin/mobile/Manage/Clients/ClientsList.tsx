import Header from "../../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import SearchBar from "../../../../../components/common/SearchBar/SearchBar";
import InfoRow from "../../../../../components/common/InfoRow/InfoRow";
import { LuClipboardList, LuPlus } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { clientsService, Client } from "../../../../../services/clientsService";
import { useNavigate } from 'react-router-dom';

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar clientes al montar
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const clientsData = await clientsService.findAll();
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (err: any) {
        console.error('Error al cargar clientes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(searchLower) ||
      client.id.toString().padStart(6, '0').includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchLower) ||
      client.city.toLowerCase().includes(searchLower) ||
      client.address.toLowerCase().includes(searchLower)
    );
    
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

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
          <h2>Clientes</h2>
        </SectionTitle>
        <BtnBlue width="3rem" height="3rem" borderRadius="24px">
          <Link to="/Manage/AddClients" style={{ textDecoration: 'none', color: 'inherit' }}>
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
        placeholder="Buscar clientes" 
        value={searchTerm}
        onChange={handleSearch}
      />

      { /* Clients List */ }
      <InfoRow className="row-header mobile-compact hide-header-action"
        columns={[
          <span key={'client'}>Cliente</span>,
          <span key={'location'}>Ciudad / Dirección</span>,
        ]}
        actionIcon={<LuClipboardList />}
      />
      
      {/* Loading state */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          Cargando clientes...
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredClients.length === 0 && searchTerm && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No se encontraron clientes con "{searchTerm}"
        </div>
      )}

      {!loading && filteredClients.length === 0 && !searchTerm && clients.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mainGray)' }}>
          No hay clientes disponibles
        </div>
      )}

      {/* Clients list */}
      {filteredClients.map((client) => (
        <InfoRow
          key={client.id}
          className="mobile-compact"
          columns={[
            <div key={'client'} style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              <span style={{ fontWeight: 600 }}>{client.name}</span>
              <span style={{ fontSize: '0.85rem' }}>
                {client.id.toString().padStart(6, '0')}
              </span>
            </div>,
            <div key={'location'} style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              <span>{client.city}</span>
              <span style={{ fontSize: '0.85rem' }}>{client.address}</span>
            </div>,
          ]}
          actionLabel="Editar"
          actionIcon={<LuClipboardList />}
          onActionClick={() => navigate(`/Manage/EditClient/${client.id}`)}
          onRowClick={() => navigate(`/Manage/EditClient/${client.id}`)}
        />
      ))} 

      {/* Back Button */}
      <Link to="/Manage/AdminClients" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
};

export default ClientsList;