import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogoutConfirmDialog,
  type LogoutConfirmVariant,
} from '../components/common/LogoutConfirmDialog/LogoutConfirmDialog';

export type UseLogoutConfirmOptions = {
  variant?: LogoutConfirmVariant;
  /** Tras cerrar sesión (p. ej. `navigate('/login', { replace: true })`). */
  onConfirmed?: () => void;
};

export function useLogoutConfirm(options?: UseLogoutConfirmOptions) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const variant = options?.variant ?? 'mobile';
  const onConfirmed = options?.onConfirmed;

  const requestLogout = useCallback(() => setOpen(true), []);

  const confirmLogout = useCallback(() => {
    logout();
    setOpen(false);
    onConfirmed?.();
  }, [logout, onConfirmed]);

  const cancelLogout = useCallback(() => setOpen(false), []);

  const logoutDialog = (
    <LogoutConfirmDialog
      open={open}
      variant={variant}
      onCancel={cancelLogout}
      onConfirm={confirmLogout}
    />
  );

  return { requestLogout, logoutDialog };
}
