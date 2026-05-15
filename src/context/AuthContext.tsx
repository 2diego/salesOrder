import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCurrentUser, loginRequest, logout as authLogout, type LoginUser } from '../services/authService';
import { getStoredToken } from '../services/http';
import { fetchMyProfile } from '../services/profileService';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

type AuthContextValue = {
  user: LoginUser | null;
  /** Nombre para mostrar desde `/users/me`; null si aún no cargó o falló (no rompe la sesión). */
  displayName: string | null;
  status: AuthStatus;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  /** Vuelve a leer el nombre del perfil (p. ej. tras guardar en Editar perfil). */
  refreshDisplayProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refreshDisplayProfile = useCallback(async () => {
    if (!getStoredToken()) {
      setDisplayName(null);
      return;
    }
    try {
      const profile = await fetchMyProfile();
      const trimmed = profile.name?.trim();
      setDisplayName(trimmed || null);
    } catch {
      setDisplayName(null);
    }
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setDisplayName(null);
    setStatus('anonymous');
  }, []);

  const refreshSession = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      setDisplayName(null);
      setStatus('anonymous');
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus('authenticated');
      void refreshDisplayProfile();
    } catch {
      authLogout();
      setUser(null);
      setDisplayName(null);
      setStatus('anonymous');
    }
  }, [refreshDisplayProfile]);

  const login = useCallback(
    async (username: string, password: string) => {
      const { user: loggedInUser } = await loginRequest(username, password);
      setUser(loggedInUser);
      setStatus('authenticated');
      void refreshDisplayProfile();
    },
    [refreshDisplayProfile],
  );

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      displayName,
      status,
      login,
      logout,
      refreshSession,
      refreshDisplayProfile,
    }),
    [user, displayName, status, login, logout, refreshSession, refreshDisplayProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
