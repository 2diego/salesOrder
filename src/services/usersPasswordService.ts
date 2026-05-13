import { apiFetch } from './http';

export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await apiFetch('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'No se pudo cambiar la contraseña');
  }
}
