import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";
import FormField from "../../../../components/FormField/FormField";
import { useState } from "react";

const AddClients = () => {
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
  
  return (
    <>
      {/* Header */}  
      <Header title="Nombre usuario" subtitle="Admin">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <LiaToolsSolid fontSize={"1.75rem"}/>
      </Header>

      {/* Manage Title */}
      <SectionTitle>
        <h2>Nuevo cliente</h2>
      </SectionTitle>

      {/* Form Fields */}
      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Nombre</h4>
      <FormField 
        label="nombre" 
        value={clientData.name} 
        placeholder="Ej: Juan Perez"
        editable={true}
        onChange={handleInputChange('name')}
      />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Correo</h4>
      <FormField 
        label="correo" 
        value={clientData.email} 
        placeholder="Ej: juanperez@example.com"
        editable={true}
        onChange={handleInputChange('email')}
      />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Teléfono</h4>
      <FormField 
        label="telefono" 
        value={clientData.phone} 
        placeholder="Ej: 1234-5678"
        editable={true}
        onChange={handleInputChange('phone')}
      />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Dirección</h4>
      <FormField 
        label="direccion" 
        value={clientData.address} 
        placeholder="Ej: Calle Falsa 123"
        editable={true}
        onChange={handleInputChange('address')}
      />

      <div style={{ justifyItems: 'end' }}>
        <BtnBlue width="100%" height="3rem">
          <span>Agregar cliente</span>
        </BtnBlue>
      </div>

      {/* Back Button */}
      <Link to="/Manage/AdminClients" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
}

export default AddClients