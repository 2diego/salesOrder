import Header from "../../../../components/common/Header/Header";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../components/common/FormField/FormField";
import { useState } from "react";
import './Profile.css';

interface EditPasswordProps {
  desktop?: boolean;
}

const EditPassword: React.FC<EditPasswordProps> = ({ desktop = false }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = () => {
    console.log('Updating password:', passwordData);
  };

  const content = (
    <div className={`edit-password-container ${desktop ? 'desktop-edit-password' : ''}`}>
      {/* Desktop Header */}
      {desktop && (
        <div className="desktop-section-header">
          <h3>Modificar Contraseña</h3>
        </div>
      )}

      {/* Mobile Header */}
      {!desktop && (
        <Header title="Nombre usuario" subtitle="Admin">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L13 13M13 3L3 13" stroke="#0D141C" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </Header>
      )}

      {/* Mobile Title */}
      {!desktop && (
        <SectionTitle>
          <h2>Modificar contraseña</h2>
        </SectionTitle>
      )}

      {/* Form Fields */}
      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Contraseña actual</h4>
        <FormField
          label="contraseña_actual"
          value={passwordData.currentPassword}
          placeholder="Ingresa tu contraseña actual"
          editable={true}
          onChange={handleInputChange('currentPassword')}
        />

        <h4 className="field-label">Nueva contraseña</h4>
        <FormField
          label="nueva_contraseña"
          value={passwordData.newPassword}
          placeholder="Ingresa tu nueva contraseña"
          editable={true}
          onChange={handleInputChange('newPassword')}
        />

        <h4 className="field-label">Confirmar contraseña</h4>
        <FormField
          label="confirmar_contraseña"
          value={passwordData.confirmPassword}
          placeholder="Confirma tu nueva contraseña"
          editable={true}
          onChange={handleInputChange('confirmPassword')}
        />

        <div className="button-container">
          <BtnBlue width="100%" height="3rem" onClick={handleSubmit}>
            <span>Cambiar contraseña</span>
          </BtnBlue>
        </div>

        {/* Back Button mobile */}
        {!desktop && (
          <Link to="/Profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BtnBlue width="100%" height="3rem" isBackButton={true}>
              <span>Volver</span>
            </BtnBlue>
          </Link>
        )}
      </div>
    </div>
  );

  return content;
};

export default EditPassword;
