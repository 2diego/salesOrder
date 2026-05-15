import Header from "../../../../../components/common/Header/Header"
import { HeaderBackNavLink } from "../../../../../components/mobile/header/HeaderBackNavLink";
import { LiaToolsSolid } from "react-icons/lia";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionTitle from "../../../../../components/common/SectionTitle/SectionTitle";
import BtnBlue from "../../../../../components/common/BtnBlue/BtnBlue";
import FormField from "../../../../../components/common/FormField/FormField";
import { useEffect, useMemo, useState } from "react";
import './AddSellers.css';
import { sellersService, Seller, UpdateSellerDTO } from "../../../../../services/sellersService";

interface EditSellersProps {
  desktop?: boolean;
  onClose?: () => void;
  seller?: Seller;
  onSellerUpdated?: (updated: Seller) => void;
  onSellerDeleted?: () => void;
}

const EditSellers: React.FC<EditSellersProps> = ({ desktop = false, onClose, seller, onSellerUpdated, onSellerDeleted }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(seller || null);
  const [formData, setFormData] = useState({
    username: seller?.username || '',
    name: seller?.name || '',
    email: seller?.email || '',
    password: '',
    phone: seller?.phone || ''
  });
  // Cargar vía ruta
  useEffect(() => {
    const load = async () => {
      if (!currentSeller && params.id) {
        try {
          const data = await sellersService.findOne(parseInt(params.id));
          setCurrentSeller(data);
          setFormData({
            username: data.username || '',
            name: data.name || '',
            email: data.email || '',
            password: '',
            phone: data.phone || ''
          });
        } catch (e: any) {
          setError(e.message || 'No se pudo cargar el vendedor');
        }
      }
    };
    load();
  }, [currentSeller, params.id]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null);
  };

  const hasChanges = useMemo(() => {
    if (!currentSeller) return false;
    return (
      formData.username !== currentSeller.username ||
      formData.name !== currentSeller.name ||
      formData.email !== currentSeller.email ||
      formData.phone !== currentSeller.phone ||
      (formData.password && formData.password.length >= 6)
    );
  }, [formData, currentSeller]);

  const buildDiff = (): UpdateSellerDTO => {
    const diff: UpdateSellerDTO = {};
    if (!currentSeller) return diff;
    if (formData.username !== currentSeller.username) diff.username = formData.username;
    if (formData.name !== currentSeller.name) diff.name = formData.name;
    if (formData.email !== currentSeller.email) diff.email = formData.email;
    if (formData.phone !== currentSeller.phone) diff.phone = formData.phone;
    if (formData.password && formData.password.length >= 6) diff.password = formData.password;
    // role=seller; isActive por defecto
    return diff;
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) { setError('El nombre de usuario es obligatorio'); return false; }
    if (!formData.name.trim()) { setError('El nombre es obligatorio'); return false; }
    if (!formData.email.trim()) { setError('El correo es obligatorio'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { setError('El correo no tiene un formato válido'); return false; }
    if (formData.password && formData.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return false; }
    if (!formData.phone.trim()) { setError('El teléfono es obligatorio'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const diff = buildDiff();
    if (Object.keys(diff).length === 0) { setError('No hay cambios para guardar'); return; }

    setLoading(true);
    setError(null);
    try {
      if (!currentSeller) return;
      const updated = await sellersService.update(currentSeller.id, diff);
      setSuccess(true);
      setSuccessMessage('¡Vendedor actualizado!');
      onSellerUpdated && onSellerUpdated(updated);
      setTimeout(() => {
        if (desktop && onClose) onClose(); else navigate('/Manage/AdminSellers');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el vendedor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentSeller) return;

    setDeleting(true);
    setError(null);
    try {
      await sellersService.remove(currentSeller.id);
      setSuccess(true);
      setSuccessMessage('Vendedor desactivado correctamente');
      onSellerDeleted && onSellerDeleted();
      setTimeout(() => {
        if (desktop && onClose) onClose(); else navigate('/Manage/AdminSellers');
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el vendedor');
    } finally {
      setDeleting(false);
      setShowDeactivateConfirm(false);
    }
  };

  const content = (
    <>
      {desktop && (
        <div className="desktop-popup-header">
          <h3>Editar Vendedor</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {!desktop && (
        <Header
          leftSlot={<HeaderBackNavLink to="/Manage/SellersList" ariaLabel="Volver a la lista de vendedores" />}
          rightSlot={<LiaToolsSolid fontSize={"1.75rem"} />}
        />
      )}

      {!desktop && (
        <SectionTitle>
          <h2>Editar vendedor</h2>
        </SectionTitle>
      )}

      {error && (
        <div className={`alert alert-error ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={`alert alert-success ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
          </svg>
          <span>{successMessage || '¡Vendedor actualizado!'}</span>
        </div>
      )}

      {showDeactivateConfirm && !success && (
        <div className={`alert alert-error ${desktop ? 'desktop-alert' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
          </svg>
          <span>
            ¿Seguro que quieres desactivar este vendedor? No podrá ingresar ni crear pedidos, pero el historial se mantiene.
          </span>
        </div>
      )}

      <div className={`form-container ${desktop ? 'desktop-form' : ''}`}>
        <h4 className="field-label">Nombre de usuario</h4>
        <FormField label="username" value={formData.username} placeholder="Nombre de usuario" editable={true} onChange={handleInputChange('username')} />

        <h4 className="field-label">Nombre completo</h4>
        <FormField label="nombre" value={formData.name} placeholder="Nombre completo" editable={true} onChange={handleInputChange('name')} />

        <h4 className="field-label">Correo</h4>
        <FormField label="correo" value={formData.email} placeholder="Correo" editable={true} onChange={handleInputChange('email')} />

        <h4 className="field-label">Contraseña (opcional)</h4>
        <FormField label="password" value={formData.password} placeholder="Mínimo 6 caracteres" editable={true} onChange={handleInputChange('password')} />

        <h4 className="field-label">Teléfono</h4>
        <FormField label="telefono" value={formData.phone} placeholder="Teléfono" editable={true} onChange={handleInputChange('phone')} />

        <BtnBlue width="100%" height="3rem" onClick={(loading || deleting) ? undefined : handleSubmit} disabled={loading || deleting}>
          <span>{loading ? 'Guardando...' : hasChanges ? 'Guardar cambios' : 'Sin cambios'}</span>
        </BtnBlue>

        {showDeactivateConfirm ? (
          <>
            <BtnBlue
              width="100%"
              height="3rem"
              background="rgba(239, 68, 68, 0.9)"
              onClick={(loading || deleting) ? undefined : handleDelete}
              disabled={loading || deleting}
            >
              <span>{deleting ? 'Desactivando...' : 'Confirmar desactivación'}</span>
            </BtnBlue>
            <BtnBlue
              width="100%"
              height="3rem"
              background="#6b7280"
              onClick={deleting ? undefined : () => setShowDeactivateConfirm(false)}
              disabled={deleting}
            >
              <span>Cancelar</span>
            </BtnBlue>
          </>
        ) : (
          <BtnBlue
            width="100%"
            height="3rem"
            background="rgba(239, 68, 68, 0.9)"
            onClick={(loading || deleting) ? undefined : () => setShowDeactivateConfirm(true)}
            disabled={loading || deleting}
          >
            <span>Desactivar vendedor</span>
          </BtnBlue>
        )}

        {!desktop && (
          <Link to="/Manage/AdminSellers" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BtnBlue width="100%" height="3rem">
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

export default EditSellers;


