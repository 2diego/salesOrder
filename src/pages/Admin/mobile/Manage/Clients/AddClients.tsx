import Header from "../../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../../components/common/FormField/FormField";
import { useEffect, useMemo, useState } from "react";
import './AddClients.css';
import { clientsService, CreateClientDTO } from "../../../../../services/clientsService";

const ARG_PROVINCES = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Ciudad Autónoma de Buenos Aires',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const;

interface AddClientsProps {
  desktop?: boolean;
  onClose?: () => void;
  onClientAdded?: () => void; // Callback para refrescar la lista de clientes
}

const AddClients: React.FC<AddClientsProps> = ({ desktop = false, onClose, onClientAdded }) => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<CreateClientDTO>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setClientData(prev => ({
      ...prev,
      state: value,
      city: '' // reset para evitar inconsistencias
    }));
    setCitySuggestions([]);
    if (error) setError(null);
  };

  const selectedProvince = clientData.state;
  const cityDatalistId = useMemo(() => `cities-${selectedProvince || 'none'}`, [selectedProvince]);

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedProvince) return;
      try {
        const cities = await clientsService.findCitiesByProvince(selectedProvince);
        setCitySuggestions(cities);
      } catch {
        setCitySuggestions([]);
      }
    };
    loadCities();
  }, [selectedProvince]);

  const validateForm = (): boolean => {
    if (!clientData.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    // Correo opcional: si se ingresa, validar formato
    const emailTrimmed = clientData.email?.trim() || '';
    if (emailTrimmed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setError('El correo no tiene un formato válido');
        return false;
      }
    }
    if (!clientData.phone.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    if (!clientData.address.trim()) {
      setError('La dirección es obligatoria');
      return false;
    }
    if (!clientData.city.trim()) {
      setError('La ciudad es obligatoria');
      return false;
    }
    // Ciudad sin abreviaturas
    const cityRaw = clientData.city.trim();
    if (cityRaw.includes('.') || /\b(bs|baires|caba)\b/i.test(cityRaw)) {
      setError('La ciudad debe escribirse sin abreviaturas');
      return false;
    }
    if (!clientData.state.trim()) {
      setError('La provincia es obligatoria');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar al servicio para crear el cliente
      const payload: CreateClientDTO = {
        ...clientData,
        email: clientData.email?.trim() ? clientData.email.trim() : undefined,
      };

      const newClient = await clientsService.create(payload);
      console.log('Cliente creado exitosamente:', newClient);
      
      setSuccess(true);

      // Llamar al callback para refrescar la lista (si existe)
      if (onClientAdded) {
        onClientAdded();
      }

      // Mostrar mensaje de éxito por 1.5 segundos y luego cerrar/navegar
      setTimeout(() => {
        if (desktop && onClose) {
          onClose();
        } else {
          navigate('/Manage/AdminClients');
        }
      }, 1500);

    } catch (err: any) {
      console.error('Error al crear cliente:', err);
      setError(err.message || 'Error al crear el cliente. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <>
      {/* Desktop Header */}
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Nuevo Cliente</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Header */}
      {!desktop && (
        <Header title="Nombre usuario" subtitle="Admin">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <LiaToolsSolid fontSize={"1.75rem"}/>
        </Header>
      )}

      {/* Mobile Title */}
      {!desktop && (
        <SectionTitle>
          <h2>Nuevo cliente</h2>
        </SectionTitle>
      )}

      {/* Mensajes de Error y Éxito */}
      {error && (
        <div className={`alert alert-error ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={`alert alert-success ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
          </svg>
          <span>¡Cliente creado exitosamente!</span>
        </div>
      )}

      {/* Form Fields */}
      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Nombre</h4>
        <FormField 
          label="nombre" 
          value={clientData.name} 
          placeholder="Ej: Juan Perez"
          editable={true}
          onChange={handleInputChange('name')}
        />

        <h4 className="field-label">Correo</h4>
        <FormField 
          label="correo" 
          value={clientData.email || 'N/A'} 
          placeholder="Ej: juanperez@example.com"
          editable={true}
          onChange={handleInputChange('email')}
        />

        <h4 className="field-label">Teléfono</h4>
        <FormField 
          label="telefono" 
          value={clientData.phone} 
          placeholder="Ej: 1234-5678"
          editable={true}
          onChange={handleInputChange('phone')}
        />

        <h4 className="field-label">Dirección</h4>
        <FormField 
          label="direccion" 
          value={clientData.address} 
          placeholder="Ej: Calle Falsa 123"
          editable={true}
          onChange={handleInputChange('address')}
        />

        <h4 className="field-label">Provincia</h4>
        <div className="form-field">
          <div className="field-input">
            <select
              value={clientData.state}
              onChange={handleProvinceChange}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none'
              }}
            >
              <option value="">Seleccione una provincia</option>
              {ARG_PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <h4 className="field-label">Ciudad<span style={{ fontSize: '0.75rem'}}> (Sin abreviaturas)</span></h4>
        <div className="form-field">
          <div className="field-input">
            <input
              type="text"
              value={clientData.city}
              onChange={handleInputChange('city')}
              placeholder="Ej: Benito Juárez"
              list={cityDatalistId}
              autoComplete="off"
            />
            <datalist id={cityDatalistId}>
              {citySuggestions.map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
        </div>
        
        <BtnBlue 
          width="100%" 
          height="3rem" 
          onClick={loading ? undefined : handleSubmit}
        >
          <span>{loading ? 'Guardando...' : 'Agregar cliente'}</span>
        </BtnBlue>

        {/* Back Button mobile */}
        {!desktop && (
          <Link to="/Manage/AdminClients" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BtnBlue width="100%" height="3rem">
              <span>Volver</span>
            </BtnBlue>
          </Link>
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

export default AddClients