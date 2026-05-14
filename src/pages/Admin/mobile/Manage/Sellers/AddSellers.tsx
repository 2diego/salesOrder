import Header from "../../../../../components/common/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../../components/common/FormField/FormField";
import { useState } from "react";
import './AddSellers.css';
import { CreateSellerDTO, sellersService } from "../../../../../services/sellersService";

interface AddSellersProps {
  desktop?: boolean;
  onClose?: () => void;
  onSellerAdded?: () => void; // Callback para refrescar la lista de vendedores
}

const AddSellers: React.FC<AddSellersProps> = ({ desktop = false, onClose, onSellerAdded }) => {
  const [sellerData, setSellerData] = useState<CreateSellerDTO>({
    username: '',
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellerData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!sellerData.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!sellerData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return false;
    }
    if (!sellerData.email.trim()) {
      setError('El correo es obligatorio');
      return false;
    }
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sellerData.email)) {
      setError('El correo no tiene un formato válido');
      return false;
    }
    if (!sellerData.password || sellerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (!sellerData.phone.trim()) {
      setError('El teléfono es obligatorio');
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
      // Llamar al servicio para crear el vendedor
      const newSeller = await sellersService.create(sellerData);
      console.log('Vendedor creado exitosamente:', newSeller);
      
      setSuccess(true);

      // Llamar al callback para refrescar la lista (si existe)
      if (onSellerAdded) {
        onSellerAdded();
      }

      // Mostrar mensaje de éxito por 1.5 segundos y luego cerrar/navegar
      setTimeout(() => {
        if (desktop && onClose) {
          onClose();
        } else {
          navigate('/Manage/AdminSellers');
        }
      }, 1500);
    } catch (err: any) {
      console.error('Error al crear vendedor:', err);
      setError(err.message || 'Error al crear el vendedor. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <>
      {/* Desktop Header */}
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Nuevo Vendedor</h3>
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
          <LiaToolsSolid fontSize={"1.75rem"}/>
        </Header>
      )}

      {/* Mobile Title */}
      {!desktop && (
        <SectionTitle>
          <h2>Nuevo vendedor</h2>
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
          <span>¡Vendedor creado exitosamente!</span>
        </div>
      )}

      {/* Form Fields */}
      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Nombre de usuario</h4>
        <FormField
          label="username"
          value={sellerData.username}
          placeholder="Ej: juanperez"
          editable={true}
          onChange={handleInputChange('username')}
        />

        <h4 className="field-label">Nombre completo</h4>
        <FormField
          label="nombre"
          value={sellerData.name}
          placeholder="Ej: Juan Perez"
          editable={true}
          onChange={handleInputChange('name')}
        />

        <h4 className="field-label">Correo</h4>
        <FormField
          label="correo"
          value={sellerData.email}
          placeholder="Ej: juanperez@example.com"
          editable={true}
          onChange={handleInputChange('email')}
        />

        <h4 className="field-label">Contraseña</h4>
        <FormField
          label="password"
          value={sellerData.password}
          placeholder="Mínimo 6 caracteres"
          editable={true}
          onChange={handleInputChange('password')}
        />

        <h4 className="field-label">Teléfono</h4>
        <FormField
          label="telefono"
          value={sellerData.phone}
          placeholder="Ej: 1234-5678"
          editable={true}
          onChange={handleInputChange('phone')}
        />

        <BtnBlue width="100%" height="3rem" onClick={loading ? undefined : handleSubmit}>
          <span>{loading ? 'Guardando...' : 'Agregar vendedor'}</span>
        </BtnBlue>

        {/* Back Button mobile */}
        {!desktop && (
          <Link to="/Manage/AdminSellers" style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default AddSellers