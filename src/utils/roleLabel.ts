/** Etiqueta legible para el rol; no expone datos sensibles. */
export function formatRoleSubtitle(role: string | undefined | null): string {
  if (!role) return 'Usuario';
  const r = role.toLowerCase();
  if (r === 'admin') return 'Admin';
  if (r === 'seller') return 'Vendedor';
  if (r === 'customer' || r === 'client' || r === 'cliente') return 'Cliente';
  return 'Usuario';
}
