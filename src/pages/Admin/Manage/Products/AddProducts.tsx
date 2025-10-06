import Header from "../../../../components/Header/Header"
import { LiaToolsSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/BtnBlue/BtnBlue";
import FormField from "../../../../components/FormField/FormField";
import { useState } from "react";
import './AddProducts.css';

interface AddProductsProps {
  desktop?: boolean;
  onClose?: () => void;
}

const AddProducts: React.FC<AddProductsProps> = ({ desktop = false, onClose }) => {
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
  };

  const handleSubmit = () => {
    // Lógica para agregar producto
    console.log('Adding product:', productData);
    if (desktop && onClose) {
      onClose();
    }
  };

  const content = (
    <>
      {/* Desktop Header */}
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Nuevo Producto</h3>
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
          <h2>Nuevo producto</h2>
        </SectionTitle>
      )}

      {/* Form Fields */}
      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Código</h4>
        <FormField
          label="codigo"
          value={productData.code}
          placeholder="Ej: 900"
          editable={true}
          onChange={handleInputChange('code')}
        />

        <h4 className="field-label">Descripción</h4>
        <FormField
          label="descripcion"
          value={productData.description}
          placeholder="Ej: Producto de prueba"
          editable={true}
          onChange={handleInputChange('description')}
        />

        <h4 className="field-label">Precio</h4>
        <FormField
          label="precio"
          value={productData.price}
          placeholder="Ej: $100"
          editable={true}
          onChange={handleInputChange('price')}
        />

        <h4 className="field-label">Stock</h4>
        <FormField
          label="stock"
          value={productData.stock}
          placeholder="Ej: 50"
          editable={true}
          onChange={handleInputChange('stock')}
        />

        <div className="button-container">
          <BtnBlue width="100%" height="3rem" onClick={handleSubmit}>
            <span>Agregar producto</span>
          </BtnBlue>
        </div>

        {/* Back Button mobile */}
        {!desktop && (
          <Link to="/Manage/AdminProducts" style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default AddProducts;