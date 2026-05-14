import Header from "../../../../components/common/Header/Header";
import { Link } from "react-router-dom";
import SectionTitle from "../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../components/common/FormField/FormField";
import { useState } from "react";
import { changeOwnPassword } from "../../../../services/usersPasswordService";
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
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setFeedback(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback('Las contraseñas nuevas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setFeedback('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSaving(true);
    try {
      await changeOwnPassword(passwordData.currentPassword, passwordData.newPassword);
      setFeedback('Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : 'No se pudo actualizar');
    } finally {
      setSaving(false);
    }
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
        <Header>
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

        {feedback && (
          <p style={{ marginBottom: 12, color: feedback.includes('correctamente') ? '#2e7d32' : '#c62828' }}>
            {feedback}
          </p>
        )}
        <div className="button-container">
          <BtnBlue width="100%" height="3rem" onClick={() => void handleSubmit()} disabled={saving}>
            <span>{saving ? 'Guardando…' : 'Cambiar contraseña'}</span>
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
