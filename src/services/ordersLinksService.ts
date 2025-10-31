import { getApiUrl } from '../config/api.config';

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

export const ordersLinksService = {
  async create(linkData: CreateOrderLinkDTO): Promise<OrderLink> {
    try {
      const response = await fetch(getApiUrl('/orders-links'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error(errorData.message || 'Orden o usuario no encontrado');
        }
        
        if (response.status === 409) {
          throw new Error(errorData.message || 'Ya existe un enlace activo para esta orden');
        }

        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al crear el enlace');
      }

      const newLink: OrderLink = await response.json();
      return newLink;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  async findAll(filters?: { orderId?: number; createdById?: number; isActive?: boolean }): Promise<OrderLink[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.orderId) params.append('orderId', filters.orderId.toString());
      if (filters?.createdById) params.append('createdById', filters.createdById.toString());
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const url = `${getApiUrl('/orders-links')}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener los enlaces');
      }

      const links: OrderLink[] = await response.json();
      return links;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<OrderLink> {
    try {
      const response = await fetch(getApiUrl(`/orders-links/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Enlace no encontrado');
        }

        throw new Error(errorData.message || 'Error al obtener el enlace');
      }

      const link: OrderLink = await response.json();
      return link;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findByToken(token: string): Promise<OrderLink> {
    try {
      const response = await fetch(getApiUrl(`/orders-links/token/${token}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Enlace no encontrado o ha expirado');
        }

        throw new Error(errorData.message || 'Error al validar el enlace');
      }

      const link: OrderLink = await response.json();
      return link;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async update(id: number, updateData: UpdateOrderLinkDTO): Promise<OrderLink> {
    try {
      const response = await fetch(getApiUrl(`/orders-links/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Enlace no encontrado');
        }

        throw new Error(errorData.message || 'Error al actualizar el enlace');
      }

      const updatedLink: OrderLink = await response.json();
      return updatedLink;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async deactivate(id: number): Promise<OrderLink> {
    try {
      const response = await fetch(getApiUrl(`/orders-links/${id}/deactivate`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Enlace no encontrado');
        }

        throw new Error(errorData.message || 'Error al desactivar el enlace');
      }

      const deactivatedLink: OrderLink = await response.json();
      return deactivatedLink;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      const response = await fetch(getApiUrl(`/orders-links/${id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Enlace no encontrado');
        }

        throw new Error(errorData.message || 'Error al eliminar el enlace');
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
      const response = await fetch(getApiUrl(`/orders-links/token/${token}/validate`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const result: { valid: boolean } = await response.json();
      return result.valid;

    } catch (error) {
      return false;
    }
  }
};

