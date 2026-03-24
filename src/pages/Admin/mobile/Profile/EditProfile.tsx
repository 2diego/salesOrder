import Header from "../../../../components/common/Header/Header";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../components/common/FormField/FormField";
import { useState } from "react";
import './Profile.css';

interface EditProfileProps {
  desktop?: boolean;
}

const EditProfile: React.FC<EditProfileProps> = ({ desktop = false }) => {
  const [profileData, setProfileData] = useState({
    name: 'Nombre usuario',
    email: 'usuario@example.com'
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = () => {
    console.log('Updating profile:', profileData);
  };

  const content = (
    <div className={`edit-profile-container ${desktop ? 'desktop-edit-profile' : ''}`}>
      {/* Desktop Header */}
      {desktop && (
        <div className="desktop-section-header">
          <h3>Modificar Perfil</h3>
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
          <h2>Modificar perfil</h2>
        </SectionTitle>
      )}

      {/* Form Fields */}
      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Nombre</h4>
        <FormField
          label="nombre"
          value={profileData.name}
          placeholder="Ej: Juan Perez"
          editable={true}
          onChange={handleInputChange('name')}
        />

        <h4 className="field-label">Email</h4>
        <FormField
          label="email"
          value={profileData.email}
          placeholder="Ej: juanperez@example.com"
          editable={true}
          onChange={handleInputChange('email')}
        />

        <div className="button-container">
          <BtnBlue width="100%" height="3rem" onClick={handleSubmit}>
            <span>Guardar cambios</span>
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

export default EditProfile;
