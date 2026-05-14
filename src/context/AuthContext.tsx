import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCurrentUser, loginRequest, logout as authLogout, type LoginUser } from '../services/authService';
import { getStoredToken } from '../services/http';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

type AuthContextValue = {
  user: LoginUser | null;
  status: AuthStatus;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setStatus('anonymous');
  }, []);

  const refreshSession = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      setStatus('anonymous');
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus('authenticated');
    } catch {
      authLogout();
      setUser(null);
      setStatus('anonymous');
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { user: loggedInUser } = await loginRequest(username, password);
    setUser(loggedInUser);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      logout,
      refreshSession,
    }),
    [user, status, login, logout, refreshSession],
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
