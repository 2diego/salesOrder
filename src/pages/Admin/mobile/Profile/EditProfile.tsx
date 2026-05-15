import Header from '../../../../components/common/Header/Header';
import { HeaderBackNavLink } from '../../../../components/mobile/header/HeaderBackNavLink';
import { LuUser } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import SectionTitle from '../../../../components/common/SectionTitle/SectionTitle';
import BtnBlue from '../../../../components/common/BtnBlue/BtnBlue';
import FormField from '../../../../components/common/FormField/FormField';
import { useCallback, useEffect, useState } from 'react';
import './Profile.css';
import { useAuth } from '../../../../context/AuthContext';
import { fetchMyProfile, updateMyProfile } from '../../../../services/profileService';

interface EditProfileProps {
  desktop?: boolean;
}

const EditProfile: React.FC<EditProfileProps> = ({ desktop = false }) => {
  const { status, refreshDisplayProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoadError(null);
      setLoading(true);
      try {
        const profile = await fetchMyProfile();
        if (!cancelled) {
          setProfileData({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'No se pudo cargar el perfil');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const handleInputChange = useCallback((field: 'name' | 'email' | 'phone') => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setProfileData((prev) => ({ ...prev, [field]: value }));
      setSaveSuccess(false);
    };
  }, []);

  const handleSubmit = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    const name = profileData.name.trim();
    const email = profileData.email.trim();
    const phone = profileData.phone.trim();

    if (!name || !email) {
      setSaveError('Nombre y correo son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile({ name, email, phone });
      setProfileData({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
      });
      await refreshDisplayProfile();
      setSaveSuccess(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const headerTitleOverride = profileData.name.trim() || undefined;

  const content = (
    <div className={`edit-profile-container ${desktop ? 'desktop-edit-profile' : ''}`}>
      {desktop && (
        <div className="desktop-section-header">
          <h3>Modificar Perfil</h3>
        </div>
      )}

      {!desktop && (
        <Header
          title={headerTitleOverride}
          leftSlot={<HeaderBackNavLink to="/Profile" ariaLabel="Volver al perfil" />}
          rightSlot={<LuUser />}
        />
      )}

      {!desktop && (
        <SectionTitle>
          <h2>Modificar perfil</h2>
        </SectionTitle>
      )}

      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        {loading ? (
          <p className="profile-feedback">Cargando datos del perfil…</p>
        ) : null}

        {loadError ? (
          <p className="profile-feedback profile-feedback--error" role="alert">
            {loadError}
          </p>
        ) : null}

        {!loading && !loadError ? (
          <>
            <h4 className="field-label">Nombre</h4>
            <FormField
              label="nombre"
              value={profileData.name}
              placeholder="Ej: Juan Pérez"
              editable={true}
              onChange={handleInputChange('name')}
            />

            <h4 className="field-label">Correo electrónico</h4>
            <FormField
              label="email"
              value={profileData.email}
              placeholder="Ej: juan@example.com"
              editable={true}
              onChange={handleInputChange('email')}
            />

            <h4 className="field-label">Teléfono</h4>
            <FormField
              label="teléfono"
              value={profileData.phone}
              placeholder="Ej: +54 11 1234-5678"
              editable={true}
              onChange={handleInputChange('phone')}
            />

            {saveError ? (
              <p className="profile-feedback profile-feedback--error" role="alert">
                {saveError}
              </p>
            ) : null}

            {saveSuccess ? (
              <p className="profile-feedback profile-feedback--success" role="status">
                Cambios guardados correctamente.
              </p>
            ) : null}

            <div className="button-container">
              <BtnBlue width="100%" height="3rem" onClick={() => void handleSubmit()} disabled={saving}>
                <span>{saving ? 'Guardando…' : 'Guardar cambios'}</span>
              </BtnBlue>
            </div>
          </>
        ) : null}

        {!desktop ? (
          <Link to="/Profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BtnBlue width="100%" height="3rem" isBackButton={true}>
              <span>Volver</span>
            </BtnBlue>
          </Link>
        ) : null}
      </div>
    </div>
  );

  return content;
};

export default EditProfile;
