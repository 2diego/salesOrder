import Header from "../../../../../components/common/Header/Header"
import { HeaderBackNavLink } from "../../../../../components/mobile/header/HeaderBackNavLink";
import { LiaToolsSolid } from "react-icons/lia";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../../components/common/FormField/FormField";
import { useEffect, useMemo, useState } from "react";
import './AddClients.css';
import { clientsService, Client, UpdateClientDTO } from "../../../../../services/clientsService";
import { CLIENT_VALIDATION_MESSAGES } from "../../../../../constants/clientValidationMessages";

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

const NEW_CITY_OPTION = '__NEW_CITY__';

interface EditClientsProps {
  desktop?: boolean;
  onClose?: () => void;
  client?: Client;
  onClientUpdated?: (updated: Client) => void;
  onClientDeleted?: () => void;
}

const EditClients: React.FC<EditClientsProps> = ({ desktop = false, onClose, client, onClientUpdated, onClientDeleted }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [currentClient, setCurrentClient] = useState<Client | null>(client || null);
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    city: client?.city || '',
    state: client?.state || ''
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [isAddingNewCity, setIsAddingNewCity] = useState(false);

  // Cargar cliente vía ruta
  useEffect(() => {
    const load = async () => {
      if (!currentClient && params.id) {
        try {
          const data = await clientsService.findOne(parseInt(params.id));
          setCurrentClient(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || ''
          });
        } catch (e: any) {
          setError(e.message || 'No se pudo cargar el cliente');
        }
      }
    };
    load();
  }, [currentClient, params.id]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError(null);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, state: value, city: '' }));
    setCitySuggestions([]);
    setIsAddingNewCity(false);
    if (error) setError(null);
  };

  const selectedProvince = formData.state;

  const selectStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: 'transparent',
    border: 'none',
    fontSize: '1rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
  };

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedProvince) {
        setCitySuggestions([]);
        return;
      }
      setCitiesLoading(true);
      try {
        const cities = await clientsService.findCitiesByProvince(selectedProvince);
        setCitySuggestions(cities);
      } catch {
        setCitySuggestions([]);
      } finally {
        setCitiesLoading(false);
      }
    };
    loadCities();
  }, [selectedProvince]);

  /** Si la ciudad guardada no está en la lista del backend, mostrar modo "nueva ciudad" */
  useEffect(() => {
    if (!selectedProvince || citiesLoading) return;
    const c = formData.city.trim();
    // Ciudad vacía: puede ser modo "nueva ciudad" (usuario aún no escribió); no resetear aquí
    if (!c) return;
    if (citySuggestions.length === 0) {
      setIsAddingNewCity(true);
      return;
    }
    if (!citySuggestions.includes(c)) {
      setIsAddingNewCity(true);
    } else {
      setIsAddingNewCity(false);
    }
  }, [citySuggestions, selectedProvince, formData.city, citiesLoading]);

  const handleCitySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === NEW_CITY_OPTION) {
      setIsAddingNewCity(true);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setIsAddingNewCity(false);
      setFormData(prev => ({ ...prev, city: value }));
    }
    if (error) setError(null);
  };

  const citySelectValue = useMemo(() => {
    if (!selectedProvince) return '';
    if (isAddingNewCity) return NEW_CITY_OPTION;
    return formData.city;
  }, [selectedProvince, isAddingNewCity, formData.city]);

  const hasChanges = useMemo(() => {
    if (!currentClient) return false;
    return (
      formData.name !== currentClient.name ||
      formData.email !== currentClient.email ||
      formData.phone !== currentClient.phone ||
      formData.address !== currentClient.address ||
      formData.city !== currentClient.city ||
      formData.state !== currentClient.state
    );
  }, [formData, currentClient]);

  const buildDiff = (): UpdateClientDTO => {
    const diff: UpdateClientDTO = {};
    if (!currentClient) return diff;
    if (formData.name !== currentClient.name) diff.name = formData.name;
    if (formData.email !== currentClient.email) {
      diff.email = formData.email?.trim() ? formData.email.trim() : undefined;
    }
    if (formData.phone !== currentClient.phone) diff.phone = formData.phone;
    if (formData.address !== currentClient.address) diff.address = formData.address;
    if (formData.city !== currentClient.city) diff.city = formData.city;
    if (formData.state !== currentClient.state) diff.state = formData.state;
    return diff;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    // Correo opcional: si se ingresa, validar formato
    const emailTrimmed = formData.email?.trim() || '';
    if (emailTrimmed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setError('El correo no tiene un formato válido');
        return false;
      }
    }
    if (!formData.state.trim()) {
      setError(CLIENT_VALIDATION_MESSAGES.PROVINCE_REQUIRED);
      return false;
    }
    if (!formData.city.trim()) {
      setError(CLIENT_VALIDATION_MESSAGES.CITY_REQUIRED);
      return false;
    }
    const cityRaw = formData.city.trim();
    if (cityRaw.includes('.') || /\b(bs|baires|caba)\b/i.test(cityRaw)) {
      setError(CLIENT_VALIDATION_MESSAGES.CITY_NO_ABBREVIATIONS);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const diff = buildDiff();
    if (Object.keys(diff).length === 0) {
      setError('No hay cambios para guardar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!currentClient) return;
      const updated = await clientsService.update(currentClient.id, diff);
      setSuccess(true);
      setSuccessMessage('¡Cliente actualizado!');
      onClientUpdated && onClientUpdated(updated);
      setTimeout(() => {
        if (desktop && onClose) {
          onClose();
        } else {
          navigate('/Manage/AdminClients');
        }
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentClient) return;

    setDeleting(true);
    setError(null);
    try {
      await clientsService.remove(currentClient.id);
      setSuccess(true);
      setSuccessMessage('Cliente desactivado correctamente');
      onClientDeleted && onClientDeleted();
      setTimeout(() => {
        if (desktop && onClose) onClose(); else navigate('/Manage/AdminClients');
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el cliente');
    } finally {
      setDeleting(false);
      setShowDeactivateConfirm(false);
    }
  };

  const content = (
    <>
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Editar Cliente</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {!desktop && (
        <Header
          leftSlot={<HeaderBackNavLink to="/Manage/ClientsList" ariaLabel="Volver a la lista de clientes" />}
          rightSlot={<LiaToolsSolid fontSize={"1.75rem"} />}
        />
      )}

      {!desktop && (
        <SectionTitle>
          <h2>Editar cliente</h2>
        </SectionTitle>
      )}

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
          <span>{successMessage || '¡Cliente actualizado!'}</span>
        </div>
      )}

      {showDeactivateConfirm && !success && (
        <div className={`alert alert-error ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
          </svg>
          <span>
            ¿Seguro que quieres desactivar este cliente? No se podrá usar en nuevos pedidos, pero el historial se mantiene.
          </span>
        </div>
      )}

      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Nombre</h4>
        <FormField label="nombre" value={formData.name} placeholder="Nombre" editable={true} onChange={handleInputChange('name')} />

        <h4 className="field-label">Correo</h4>
        <FormField label="correo" value={formData.email} placeholder="Correo" editable={true} onChange={handleInputChange('email')} />

        <h4 className="field-label">Teléfono</h4>
        <FormField label="telefono" value={formData.phone} placeholder="Teléfono" editable={true} onChange={handleInputChange('phone')} />

        <h4 className="field-label">Dirección</h4>
        <FormField label="direccion" value={formData.address} placeholder="Dirección" editable={true} onChange={handleInputChange('address')} />

        <h4 className="field-label">Provincia</h4>
        <div className="form-field">
          <div className="field-input">
            <select
              value={formData.state}
              onChange={handleProvinceChange}
              style={selectStyle}
            >
              <option value="">Seleccione una provincia</option>
              {ARG_PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <h4 className="field-label">Ciudad<span style={{ fontSize: '0.75rem', color: 'rgb(102, 102, 102)' }}> - Sin abreviaturas</span></h4>
        <div className="form-field">
          <div className="field-input">
            <select
              value={citySelectValue}
              onChange={handleCitySelectChange}
              disabled={!selectedProvince || citiesLoading}
              style={{
                ...selectStyle,
                opacity: !selectedProvince || citiesLoading ? 0.6 : 1,
              }}
            >
              <option value="">
                {!selectedProvince
                  ? 'Seleccione primero una provincia'
                  : citiesLoading
                    ? 'Cargando ciudades...'
                    : 'Seleccione una ciudad'}
              </option>
              {citySuggestions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              <option value={NEW_CITY_OPTION}>+ Agregar nueva ciudad…</option>
            </select>
          </div>
        </div>
        {selectedProvince && isAddingNewCity && (
          <>
            <h4 className="field-label" style={{ marginTop: '0.5rem' }}>
              Nombre de la ciudad
            </h4>
            <FormField
              label="ciudad_nueva"
              value={formData.city}
              placeholder="Nombre completo, sin abreviaturas (ej: Benito Juárez)"
              editable={true}
              onChange={handleInputChange('city')}
            />
          </>
        )}
        {!isAddingNewCity && (
          <div style={{ marginTop: '0.25rem', color: 'var(--mainGray)', fontSize: '0.85rem', paddingLeft: '1rem' }}>
            Elegí una ciudad de la lista o usá &quot;Agregar nueva ciudad&quot;.
          </div>
        )}

        <BtnBlue width="100%" height="3rem" onClick={(loading || deleting) ? undefined : handleSubmit} disabled={loading || deleting}>
          <span>{loading ? 'Guardando...' : hasChanges ? 'Guardar cambios' : 'Sin cambios'}</span>
        </BtnBlue>

        {showDeactivateConfirm ? (
          <>
            <BtnBlue
              width="100%"
              height="3rem"
              background="rgba(239, 68, 68, 0.9)"
              onClick={(loading || deleting) ? undefined : handleDelete}
              disabled={loading || deleting}
            >
              <span>{deleting ? 'Desactivando...' : 'Confirmar desactivación'}</span>
            </BtnBlue>
            <BtnBlue
              width="100%"
              height="3rem"
              background="#6b7280"
              onClick={deleting ? undefined : () => setShowDeactivateConfirm(false)}
              disabled={deleting}
            >
              <span>Cancelar</span>
            </BtnBlue>
          </>
        ) : (
          <BtnBlue
            width="100%"
            height="3rem"
            background="rgba(239, 68, 68, 0.9)"
            onClick={(loading || deleting) ? undefined : () => setShowDeactivateConfirm(true)}
            disabled={loading || deleting}
          >
            <span>Desactivar cliente</span>
          </BtnBlue>
        )}

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

export default EditClients;


