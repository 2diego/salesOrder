import { API_BASE_URL } from '../config/api.config';
import { apiFetch, setStoredToken } from './http';

export type LoginUser = {
  userId: number;
  username: string;
  role: string;
};

export async function loginRequest(username: string, password: string): Promise<{ access_token: string; user: LoginUser }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((payload as { message?: string }).message ?? 'No se pudo iniciar sesión');
  }

  const data = payload as { access_token: string; user: LoginUser };
  setStoredToken(data.access_token);
  return data;
}

export async function getCurrentUser(): Promise<LoginUser> {
  const response = await apiFetch('/auth/me');
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((payload as { message?: string }).message ?? 'No se pudo recuperar la sesión');
  }

  return payload as LoginUser;
}

export function logout(): void {
  setStoredToken(null);
}
