import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";
import FormField from "../../../../components/FormField/FormField";
import { useState } from "react";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    code: '',
    description: '',
    price: '',
    stock: ''
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }

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
        <h2>Nuevo producto</h2>
      </SectionTitle>

      {/* Form Fields */}
      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Código</h4>
      <FormField
        label="codigo"
        value={productData.code}
        placeholder="Ej: 900"
        editable={true}
        onChange={handleInputChange('code')}
      />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Descripción</h4>
      <FormField
        label="descripcion"
        value={productData.description}
        placeholder="Ej: Producto de prueba"
        editable={true}
        onChange={handleInputChange('description')}
      />

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Precio</h4>
      <FormField
        label="precio"
        value={productData.price}
        placeholder="Ej: $100"
        editable={true}
        onChange={handleInputChange('price')}
      /> {/* cambiar de string a int */}

      <h4 style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>Stock</h4>
      <FormField
        label="stock"
        value={productData.stock}
        placeholder="Ej: 50"
        editable={true}
        onChange={handleInputChange('stock')}
      /> {/* cambiar de string a int */}

      <div style={{ justifyItems: 'end' }}>
        <BtnBlue width="100%" height="3rem">
          <span>Agregar producto</span>
        </BtnBlue>
      </div>

      {/* Back Button */}
      <Link to="/Manage/AdminProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <BtnBlue width="100%" height="3rem" isBackButton={true}>
          <span>Volver</span>
        </BtnBlue>
      </Link>
    </>
  )
}

export default AddProducts;