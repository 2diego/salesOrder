import { useState, useEffect } from "react";
import Header from "../../../../components/common/Header/Header";
import BtnBlue from "../../../../components/common/BtnBlue/BtnBlue"
import { LuClipboardList } from "react-icons/lu";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import FormField from "../../../../components/common/FormField/FormField";
import { clientsService, Client } from "../../../../services/clientsService";
import { ordersService, OrderStatus } from "../../../../services/ordersService";
import { ordersLinksService, OrderLink } from "../../../../services/ordersLinksService";
import { sellersService } from "../../../../services/sellersService";
import './CreateLink.css';

interface CreateLinkProps {
  desktop?: boolean;
  onClose?: () => void;
}

const CreateLink: React.FC<CreateLinkProps> = ({ desktop = false, onClose }) => {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdLink, setCreatedLink] = useState<OrderLink | null>(null);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [copyAlert, setCopyAlert] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<number | null>(null);
  
  // Estados para el selector de clientes
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);

  // Cargar clientes y vendedor al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar vendedores
        const sellers = await sellersService.findAll();
        if (sellers.length > 0) {
          setSellerId(sellers[0].id);
        } else {
          setError('No hay vendedores disponibles. Por favor crea un vendedor primero.');
        }

        // Cargar clientes
        setLoadingClients(true);
        const clientsData = await clientsService.findAll();
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoadingClients(false);
      }
    };
    fetchData();
  }, []);

  // Ocultar alerta de copiado automáticamente
  useEffect(() => {
    if (!copyAlert) return;
    const t = setTimeout(() => setCopyAlert(null), 2200);
    return () => clearTimeout(t);
  }, [copyAlert]);

  // Filtrar clientes cuando cambia el termino de busqueda
  useEffect(() => {
    if (!clientSearchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const searchLower = clientSearchTerm.toLowerCase();
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(searchLower) ||
      (client.email ?? '').toLowerCase().includes(searchLower) ||
      (client.phone ?? '').includes(searchLower) ||
      (client.address ?? '').toLowerCase().includes(searchLower) ||
      (client.city ?? '').toLowerCase().includes(searchLower) ||
      (client.state ?? '').toLowerCase().includes(searchLower)
    );
    
    setFilteredClients(filtered);
  }, [clientSearchTerm, clients]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si hay un cliente seleccionado, no permitir cambios
    if (selectedClient) {
      return;
    }
    
    setClientData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleClientSearch = (value: string) => {
    setClientSearchTerm(value);
    setShowClientDropdown(value.length > 0);
    // Si se limpia la busqueda, deseleccionar cliente
    if (!value.trim() && selectedClient) {
      handleClearClient();
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showClientDropdown && !target.closest('.client-selector-wrapper')) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClientDropdown]);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setClientData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || ''
    });
    setClientSearchTerm(client.name);
    setShowClientDropdown(false);
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setClientData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: ''
    });
    setClientSearchTerm('');
    setShowClientDropdown(false);
  };

  const handleSubmit = async () => {
    if (!sellerId) {
      setError('No hay vendedor disponible');
      return;
    }

    // Validar que se haya seleccionado un cliente
    if (!selectedClient) {
      setError('Por favor selecciona un cliente de la lista');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedLink(null);
    setLinkUrl('');

    try {
      // Usar solo el cliente seleccionado - NO crear clientes nuevos
      const client = selectedClient;
      console.log('Usando cliente seleccionado:', client);

      // 1. Crear una orden vacía (draft) solo para asociar el link
      // El cliente completará esta orden cuando use el link
      const order = await ordersService.create({
        clientId: client.id,
        createdById: sellerId,
        status: OrderStatus.PENDING
      });
      console.log('Orden draft creada:', order);

      // 2. Crear link para la orden
      const link = await ordersLinksService.create({
        orderId: order.id,
        createdById: sellerId
      });
      console.log('Link creado:', link);

      // 4. Generar URL del link
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/NewOrder?token=${link.token}`;
      
      setCreatedLink(link);
      setLinkUrl(url);
      setSuccess(true);

      // Resetear formulario
      setClientData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: ''
      });
      setSelectedClient(null);
      setClientSearchTerm('');
      setShowClientDropdown(false);

    } catch (err: any) {
      console.error('Error al crear link:', err);
      setError(err.message || 'Error al crear el link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopyAlert('¡Link copiado al portapapeles!');
    } catch (err) {
      console.error('Error al copiar:', err);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = linkUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyAlert('¡Link copiado al portapapeles!');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Link de pedido',
          text: `Compartir link de pedido para ${clientData.name}`,
          url: linkUrl
        });
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    } else {
      // Fallback: copiar al portapapeles
      handleCopyLink();
    }
  };

  const content = (
    <>
      {/* Desktop Header */}
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Generar Link</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Header */}
      {!desktop && (
        <Header>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <LuClipboardList />
        </Header>
      )}

      {/* Mobile Title */}
      {!desktop && (
        <SectionTitle>
          <h2>Generar link</h2>
        </SectionTitle>
      )}
      
      {/* Form Fields */}
      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        {copyAlert && (
          <div className={`alert alert-success ${desktop ? 'desktop-alert' : ''}`} style={{ margin: '0 0 1rem 0' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8.3 14.1L4.6 10.4L5.7 9.3L8.3 11.9L14.3 5.9L15.4 7L8.3 14.1Z" fill="currentColor"/>
            </svg>
            <span>{copyAlert}</span>
          </div>
        )}
        {/* Client Selector */}
        <h4 className="field-label">Buscar Cliente {selectedClient ? '(✓ Seleccionado)' : ' *'}</h4>
        {!selectedClient && (
          <p style={{
            fontSize: '0.75rem',
            color: desktop ? 'rgba(255, 255, 255, 0.6)' : '#666',
            marginTop: '-0.5rem',
            marginBottom: '0.5rem',
            marginLeft: desktop ? '0' : '1rem',
            fontStyle: 'italic'
          }}>
            Debes seleccionar un cliente existente para generar el link
          </p>
        )}
        <div className="client-selector-wrapper" style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FormField
                label="buscar"
                value={clientSearchTerm}
                placeholder="Buscar por nombre, dirección, teléfono..."
                editable={true}
                onChange={(e) => handleClientSearch(e.target.value)}
              />
              
              {/* Dropdown de resultados */}
              {showClientDropdown && filteredClients.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  backgroundColor: desktop ? 'rgb(31, 41, 55)' : '#fff',
                  border: `1px solid ${desktop ? 'rgba(100, 100, 100, 0.3)' : '#ccc'}`,
                  borderRadius: '8px',
                  marginTop: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        borderBottom: `1px solid ${desktop ? 'rgba(100, 100, 100, 0.2)' : '#eee'}`,
                        transition: 'background-color 0.2s',
                        color: desktop ? '#fff' : '#000'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = desktop ? 'rgba(100, 100, 100, 0.3)' : '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        {client.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        {client.address} {client.city}, {client.state}
                      </div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        {client.email ? client.email : 'Sin email'} • Tel: {client.phone || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mensaje si no hay resultados */}
              {showClientDropdown && filteredClients.length === 0 && clientSearchTerm && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  backgroundColor: desktop ? 'rgb(31, 41, 55)' : '#fff',
                  border: `1px solid ${desktop ? 'rgba(100, 100, 100, 0.3)' : '#ccc'}`,
                  borderRadius: '8px',
                  marginTop: '4px',
                  padding: '1rem',
                  color: desktop ? '#fff' : '#666',
                  fontSize: '0.875rem'
                }}>
                  No se encontraron clientes. Por favor crea el cliente desde la sección de gestión de clientes.
                </div>
              )}
            </div>

            {selectedClient && (
              <button
                onClick={handleClearClient}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: `1px solid ${desktop ? 'rgba(100, 100, 100, 0.3)' : '#ccc'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: desktop ? '#fff' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2.5rem',
                  width: '2.5rem'
                }}
                title="Limpiar selección"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mostrar mensaje si está cargando clientes */}
        {loadingClients && (
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            color: desktop ? '#999' : '#666',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            Cargando clientes...
          </div>
        )}

        {/* Mostrar campos del formulario solo cuando hay un cliente seleccionado */}
        {selectedClient && (
          <>
            <h4 className="field-label">Nombre</h4>
            <FormField 
              label="nombre" 
              value={clientData.name} 
              placeholder="Ej: Juan Perez"
              editable={false}
              onChange={handleInputChange('name')}
            />      

            <h4 className="field-label">Email</h4>
            <FormField 
              label="email"
              value={clientData.email}
              placeholder="Ej: juan.perez@email.com"
              editable={false}
              onChange={handleInputChange('email')}
            />

            <h4 className="field-label">Teléfono</h4>
            <FormField 
              label="teléfono"
              value={clientData.phone}
              placeholder="Ej: 1234567890"
              editable={false}
              onChange={handleInputChange('phone')}
            />

            <h4 className="field-label">Dirección</h4>
            <FormField 
              label="dirección"
              value={clientData.address}
              placeholder="Ej: Calle Falsa 123"
              editable={false}
              onChange={handleInputChange('address')}
            />

            <h4 className="field-label">Ciudad</h4>
            <FormField 
              label="ciudad"
              value={clientData.city}
              placeholder="Ej: Buenos Aires"
              editable={false}
              onChange={handleInputChange('city')}
            />

            <h4 className="field-label">Provincia</h4>
            <FormField 
              label="provincia"
              value={clientData.state}
              placeholder="Ej: Buenos Aires"
              editable={false}
              onChange={handleInputChange('state')}
            />
          </>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* Success Message and Link */}
        {success && createdLink && linkUrl && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(34, 197, 94, 0.10)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              color: '#22c55e',
              boxSizing: 'border-box',
              overflowX: 'hidden',
            }}
          >
            <div style={{ marginBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>✅</span>
              <span>Link creado exitosamente</span>
            </div>

            <div
              style={
                desktop
                  ? {
                      marginBottom: '1rem',
                      padding: '0.8rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.18)',
                      borderRadius: '8px',
                      overflowX: 'hidden',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      color: 'rgba(233, 232, 232, 0.95)',
                      border: '1px solid rgba(100, 100, 100, 0.25)',
                    }
                  : {
                      marginBottom: '1rem',
                      padding: '0.8rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      overflowX: 'hidden',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      color: '#0D141C',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                    }
              }
            >
              {linkUrl}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: desktop ? 'row' : 'column', flexWrap: 'nowrap' }}>
              <BtnBlue 
                width="100%" 
                height="2.5rem" 
                onClick={handleCopyLink}
                borderRadius="6px"
              >
                <span>📋 Copiar link</span>
              </BtnBlue>
              
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <BtnBlue 
                  width="100%" 
                  height="2.5rem" 
                  onClick={handleShare}
                  borderRadius="6px"
                  background="linear-gradient(195deg, rgba(43, 118, 184, 0.699), rgba(15, 55, 107, 0.459))"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                    <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="start">
                      <g transform="scale(10.66667,10.66667)">
                        <path d="M18,2c-1.64501,0 -3,1.35499 -3,3c0,0.19095 0.02179,0.37712 0.05664,0.55859l-7.13477,4.16211c-0.52334,-0.44285 -1.1898,-0.7207 -1.92187,-0.7207c-1.64501,0 -3,1.35499 -3,3c0,1.64501 1.35499,3 3,3c0.73208,0 1.39854,-0.27785 1.92188,-0.7207l7.13477,4.16016c-0.03509,0.18206 -0.05664,0.36893 -0.05664,0.56055c0,1.64501 1.35499,3 3,3c1.64501,0 3,-1.35499 3,-3c0,-1.64501 -1.35499,-3 -3,-3c-0.73252,0 -1.39841,0.27933 -1.92187,0.72266l-7.13477,-4.16406c0.03485,-0.18147 0.05664,-0.36764 0.05664,-0.55859c0,-0.19095 -0.02179,-0.37712 -0.05664,-0.55859l7.13477,-4.16211c0.52333,0.44285 1.1898,0.7207 1.92188,0.7207c1.64501,0 3,-1.35499 3,-3c0,-1.64501 -1.35499,-3 -3,-3zM18,4c0.56413,0 1,0.43587 1,1c0,0.56413 -0.43587,1 -1,1c-0.56413,0 -1,-0.43587 -1,-1c0,-0.56413 0.43587,-1 1,-1zM6,11c0.56413,0 1,0.43587 1,1c0,0.56413 -0.43587,1 -1,1c-0.56413,0 -1,-0.43587 -1,-1c0,-0.56413 0.43587,-1 1,-1zM18,18c0.56413,0 1,0.43587 1,1c0,0.56413 -0.43587,1 -1,1c-0.56413,0 -1,-0.43587 -1,-1c0,-0.56413 0.43587,-1 1,-1z"></path>
                      </g>
                    </g>
                  </svg>
                  <span>Compartir</span>
                </BtnBlue>
              )}
            </div>

            <div
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: desktop ? 'rgba(255, 255, 255, 0.7)' : '#1a1a1a',
                fontStyle: 'italic',
              }}
            >
              ⏰ Este link caduca en 24 horas
            </div>
          </div>
        )}

        {/* Mostrar botón solo cuando hay un cliente seleccionado */}
        {selectedClient && (
          <div className="button-container">
            <BtnBlue 
              width="100%" 
              height="3rem" 
              onClick={loading ? undefined : handleSubmit}
            >
              <span>{loading ? 'Creando link...' : 'Crear y compartir'}</span>
            </BtnBlue>
          </div>
        )}
      </div>
    </>
  );

  if (desktop) {
    return (
      <div className="desktop-popup-overlay" onClick={onClose}>
        <div className="desktop-popup" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default CreateLink;