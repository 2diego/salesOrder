import { apiFetch } from './http';

/** Coincide con UserResponseDTO del backend (sin secretos). */
export type UserProfile = {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateOwnProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
};

function readErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
    if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'string') {
      return message[0];
    }
  }
  return fallback;
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const response = await apiFetch('/users/me');
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(readErrorMessage(payload, 'No se pudo cargar el perfil'));
  }

  return payload as UserProfile;
}

export async function updateMyProfile(body: UpdateOwnProfilePayload): Promise<UserProfile> {
  const response = await apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(readErrorMessage(payload, 'No se pudo guardar el perfil'));
  }

  return payload as UserProfile;
}
