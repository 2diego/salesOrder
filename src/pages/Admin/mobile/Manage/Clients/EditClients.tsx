import Header from "../../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../../components/common/FormField/FormField";
import { useEffect, useMemo, useState } from "react";
import './AddClients.css';
import { clientsService, Client, UpdateClientDTO } from "../../../../../services/clientsService";

interface EditClientsProps {
  desktop?: boolean;
  onClose?: () => void;
  client?: Client;
  onClientUpdated?: (updated: Client) => void;
}

const EditClients: React.FC<EditClientsProps> = ({ desktop = false, onClose, client, onClientUpdated }) => {
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    if (formData.email !== currentClient.email) diff.email = formData.email;
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
    if (!formData.email.trim()) {
      setError('El correo es obligatorio');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El correo no tiene un formato válido');
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
        <Header title="Nombre usuario" subtitle="Admin">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <LiaToolsSolid fontSize={"1.75rem"}/>
        </Header>
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
          <span>¡Cliente actualizado!</span>
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

        <h4 className="field-label">Ciudad</h4>
        <FormField label="ciudad" value={formData.city} placeholder="Ciudad" editable={true} onChange={handleInputChange('city')} />

        <h4 className="field-label">Provincia</h4>
        <FormField label="provincia" value={formData.state} placeholder="Provincia" editable={true} onChange={handleInputChange('state')} />

        <BtnBlue width="100%" height="3rem" onClick={loading ? undefined : handleSubmit}>
          <span>{loading ? 'Guardando...' : hasChanges ? 'Guardar cambios' : 'Sin cambios'}</span>
        </BtnBlue>

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


