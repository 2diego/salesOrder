import Header from "../../../components/Header/Header";
import BtnBlue from "../../../components/BtnBlue/BtnBlue"
import { LuClipboardList } from "react-icons/lu";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import FormField from "../../../components/FormField/FormField";
import { useState } from "react";
import './CreateLink.css';

interface CreateLinkProps {
  desktop?: boolean;
  onClose?: () => void;
}

const CreateLink: React.FC<CreateLinkProps> = ({ desktop = false, onClose }) => {
  const [clientData, setClientData] = useState({
    name: '',
    address: ''
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = () => {
    // Lógica para crear y compartir link
    console.log('Creating link for:', clientData);
    if (desktop && onClose) {
      onClose();
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
        <Header title="Nombre usuario" subtitle="Admin">
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
        <h4 className="field-label">Cliente</h4>
        <FormField 
          label="nombre" 
          value={clientData.name} 
          placeholder="Ej: Juan Perez"
          editable={true}
          onChange={handleInputChange('name')}
        />      

        <h4 className="field-label">Dirección de entrega</h4>
        <FormField 
          label="dirección"
          value={clientData.address}
          placeholder="Ej: Calle Falsa 123"
          editable={true}
          onChange={handleInputChange('address')}
        />

        <div className="button-container">
          <BtnBlue width="100%" height="3rem" onClick={handleSubmit}>
            <span>Crear y compartir</span>
          </BtnBlue>
        </div>
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