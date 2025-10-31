// En desarrollo usa localhost, en produccion usar la variable de entorno VITE_API_URL
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

// Helper para construir URLs de endpoints
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

