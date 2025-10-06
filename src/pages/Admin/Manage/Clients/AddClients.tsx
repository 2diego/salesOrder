import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";
import FormField from "../../../../components/FormField/FormField";
import { useState } from "react";
import './AddClients.css';

interface AddClientsProps {
  desktop?: boolean;
  onClose?: () => void;
}

const AddClients: React.FC<AddClientsProps> = ({ desktop = false, onClose }) => {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = () => {
    // Lógica para agregar cliente
    console.log('Adding client:', clientData);
    if (desktop && onClose) {
      onClose();
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
          value={clientData.email} 
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

        <div className="button-container">
          <BtnBlue width="100%" height="3rem" onClick={handleSubmit}>
            <span>Agregar cliente</span>
          </BtnBlue>
        </div>

        {/* Back Button mobile */}
        {!desktop && (
          <Link to="/Manage/AdminClients" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BtnBlue width="100%" height="3rem" isBackButton={true}>
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