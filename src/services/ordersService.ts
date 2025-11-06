import { getApiUrl } from '../config/api.config';

export enum OrderStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  CANCELLED = 'cancelled',
}

export interface CreateOrderDTO {
  clientId: number;
  createdById: number;
  status?: OrderStatus;
  notes?: string;
}

export interface UpdateOrderDTO {
  status?: OrderStatus;
  notes?: string;
  clientId?: number;
}

export interface Order {
  id: number;
  clientId: number;
  createdById: number;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  createdBy?: {
    id: number;
    name: string;
    username: string;
  };
  orderItems?: any[];
  orderLink?: any;
  orderValidations?: any[];
}

export const ordersService = {
  async create(orderData: CreateOrderDTO): Promise<Order> {
    try {
      const response = await fetch(getApiUrl('/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al crear la orden');
      }

      const newOrder: Order = await response.json();
      return newOrder;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  async findAll(filters?: { clientId?: number; createdById?: number; status?: OrderStatus }): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.clientId) params.append('clientId', filters.clientId.toString());
      if (filters?.createdById) params.append('createdById', filters.createdById.toString());
      if (filters?.status) params.append('status', filters.status);

      const url = `${getApiUrl('/orders')}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener la lista de órdenes');
      }

      const orders: Order[] = await response.json();
      return orders;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<Order> {
    try {
      const response = await fetch(getApiUrl(`/orders/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Orden no encontrada');
        }

        throw new Error(errorData.message || 'Error al obtener la orden');
      }

      const order: Order = await response.json();
      return order;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async update(id: number, updateData: UpdateOrderDTO): Promise<Order> {
    try {
      const response = await fetch(getApiUrl(`/orders/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Orden no encontrada');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'La orden ya ha sido validada y no se puede modificar');
        }

        throw new Error(errorData.message || 'Error al actualizar la orden');
      }

      const updatedOrder: Order = await response.json();
      return updatedOrder;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      const response = await fetch(getApiUrl(`/orders/${id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Orden no encontrada');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'La orden ya ha sido validada y no se puede eliminar');
        }

        throw new Error(errorData.message || 'Error al eliminar la orden');
      }

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    try {
      const response = await fetch(getApiUrl(`/orders/${id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Orden no encontrada');
        }

        throw new Error(errorData.message || 'Error al actualizar el estado de la orden');
      }

      const updatedOrder: Order = await response.json();
      return updatedOrder;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  }
};

