import { apiFetch } from './http';

export interface CreateOrderLinkDTO {
  orderId: number;
  createdById: number;
  expiresAt?: Date;
}

export interface UpdateOrderLinkDTO {
  isActive?: boolean;
  expiresAt?: Date;
}

export interface OrderLink {
  id: number;
  orderId: number;
  token: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  createdById: number;
  order?: {
    id: number;
    clientId: number;
    status: string;
    totalAmount: number;
    client?: {
      id: number;
      name: string;
    };
  };
  createdBy?: {
    id: number;
    name: string;
    username: string;
  };
}

async function handle<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as { message?: string }).message ?? fallback);
  }
  return response.json() as Promise<T>;
}

export const ordersLinksService = {
  async create(linkData: CreateOrderLinkDTO): Promise<OrderLink> {
    try {
      const response = await apiFetch('/order-links', {
        method: 'POST',
        body: JSON.stringify(linkData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = (errorData as { message?: string }).message;
        if (response.status === 404) throw new Error(msg || 'Orden o usuario no encontrado');
        if (response.status === 409)
          throw new Error(msg || 'Ya existe un enlace activo para esta orden');
        if (response.status === 400)
          throw new Error(msg || 'Datos inválidos. Por favor verifica los campos');
        throw new Error(msg || 'Error al crear el enlace');
      }

      return response.json() as Promise<OrderLink>;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findAll(filters?: {
    orderId?: number;
    createdById?: number;
    isActive?: boolean;
  }): Promise<OrderLink[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.orderId) params.append('orderId', filters.orderId.toString());
      if (filters?.createdById) params.append('createdById', filters.createdById.toString());
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const qs = params.toString();
      const response = await apiFetch(`/order-links${qs ? `?${qs}` : ''}`, { method: 'GET' });

      return handle<OrderLink[]>(response, 'Error al obtener los enlaces');
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<OrderLink> {
    try {
      const response = await apiFetch(`/order-links/${id}`, { method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) throw new Error('Enlace no encontrado');
        throw new Error((errorData as { message?: string }).message || 'Error al obtener el enlace');
      }
      return response.json() as Promise<OrderLink>;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findByToken(token: string): Promise<OrderLink> {
    try {
      const encoded = encodeURIComponent(token);
      const response = await apiFetch(`/order-links/token/${encoded}`, { method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) throw new Error('Enlace no encontrado o ha expirado');
        throw new Error((errorData as { message?: string }).message || 'Error al validar el enlace');
      }
      return response.json() as Promise<OrderLink>;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async update(id: number, updateData: UpdateOrderLinkDTO): Promise<OrderLink> {
    try {
      const response = await apiFetch(`/order-links/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) throw new Error('Enlace no encontrado');
        throw new Error((errorData as { message?: string }).message || 'Error al actualizar el enlace');
      }
      return response.json() as Promise<OrderLink>;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async deactivate(id: number): Promise<OrderLink> {
    try {
      const response = await apiFetch(`/order-links/${id}/deactivate`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) throw new Error('Enlace no encontrado');
        throw new Error((errorData as { message?: string }).message || 'Error al desactivar el enlace');
      }
      return response.json() as Promise<OrderLink>;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      const response = await apiFetch(`/order-links/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) throw new Error('Enlace no encontrado');
        throw new Error((errorData as { message?: string }).message || 'Error al eliminar el enlace');
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      const encoded = encodeURIComponent(token);
      const response = await apiFetch(`/order-links/validate/${encoded}`, { method: 'GET' });
      if (!response.ok) return false;
      const result: { valid: boolean } = await response.json();
      return result.valid;
    } catch {
      return false;
    }
  },
};
