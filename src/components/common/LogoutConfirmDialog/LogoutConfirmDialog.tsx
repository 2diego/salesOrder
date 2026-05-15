import BtnBlue from '../BtnBlue/BtnBlue';
import './LogoutConfirmDialog.css';

export type LogoutConfirmVariant = 'mobile' | 'desktop';

export type LogoutConfirmDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  /** `desktop`: panel oscuro acorde al admin desktop. Por defecto `mobile`. */
  variant?: LogoutConfirmVariant;
};

export function LogoutConfirmDialog({
  open,
  onCancel,
  onConfirm,
  variant = 'mobile',
}: LogoutConfirmDialogProps) {
  if (!open) return null;

  const isDesktop = variant === 'desktop';

  return (
    <div
      className={`logout-confirm-overlay${isDesktop ? ' logout-confirm-overlay--desktop' : ''}`}
      role="presentation"
      onClick={onCancel}
    >
      <div
        className={`logout-confirm-panel${isDesktop ? ' logout-confirm-panel--desktop' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="logout-confirm-title"
          className={`logout-confirm-title${isDesktop ? ' logout-confirm-title--desktop' : ''}`}
        >
          Cerrar sesión
        </h3>
        <p className={`logout-confirm-message${isDesktop ? ' logout-confirm-message--desktop' : ''}`}>
          ¿Desea cerrar sesión? Deberá volver a iniciar sesión para acceder al panel de administración.
        </p>
        <div className="logout-confirm-actions">
          <button
            type="button"
            className={`logout-confirm-cancel${isDesktop ? ' logout-confirm-cancel--desktop' : ''}`}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <div className="logout-confirm-primary-wrap">
            <BtnBlue width="100%" height="3rem" onClick={onConfirm}>
              Cerrar sesión
            </BtnBlue>
          </div>
        </div>
      </div>
    </div>
  );
}
