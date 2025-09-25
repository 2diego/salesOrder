import Header from "../../../components/Header/Header";
import BtnBlue from "../../../components/BtnBlue/BtnBlue"
import { LuClipboardList } from "react-icons/lu";
import { Link } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import FormField from "../../../components/FormField/FormField";
import { useState } from "react";

const CreateLink = () => {
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

  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LuClipboardList />
      </Header>

      {/* Orders Title */}
      <SectionTitle>
        <h2>Generar link</h2>
      </SectionTitle>
      
      {/* Form Fields */}
      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Cliente</h4>
      <FormField 
        label="nombre" 
        value={clientData.name} 
        placeholder="Ej: Juan Perez"
        editable={true}
        onChange={handleInputChange('name')}
      />      

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Dirección de entrega</h4>
      <FormField 
        label="dirección"
        value={clientData.address}
        placeholder="Ej: Calle Falsa 123"
        editable={true}
        onChange={handleInputChange('address')}
      />

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <BtnBlue width="100%" height="3rem">
          <span>Crear y compartir</span>
        </BtnBlue>
      </div>

      {/* Back Button */}
      <Link to="/Orders" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
}

export default CreateLink;