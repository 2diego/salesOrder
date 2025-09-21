import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";
import FormField from "../../../../components/FormField/FormField";

const AddSellers = () => {
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
        <h2>Nuevo vendedor</h2>
      </SectionTitle>

      {/* Form Fields */}
      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Nombre</h4>
      <FormField label="nombre" value="Ej: Juan Perez" editable={false} />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Correo</h4>
      <FormField label="correo" value="Ej: juanperez@example.com" editable={false} />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Teléfono</h4>
      <FormField label="telefono" value="Ej: 1234-5678" editable={false} />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Dirección</h4>
      <FormField label="direccion" value="Ej: Calle Falsa 123" editable={false} />

      <div style={{ justifyItems: 'end' }}>
        <BtnBlue width="100%" height="3rem">
          <span>Agregar vendedor</span>
        </BtnBlue>
      </div>

      {/* Back Button */}
      <Link to="/Manage/AdminSellers" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
}

export default AddSellers