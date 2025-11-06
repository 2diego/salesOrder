import { getApiUrl } from '../config/api.config';

export interface CreateOrderItemDTO {
  orderId: number;
  productId: number;
  quantity: number;
  notes?: string;
}

export interface UpdateOrderItemDTO {
  quantity?: number;
  notes?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  notes?: string;
  order?: {
    id: number;
    status: string;
    totalAmount: number;
  };
  product?: {
    id: number;
    name: string;
    price: number;
    sku?: string;
    description?: string;
  };
}

export const ordersItemsService = {
  
  async create(itemData: CreateOrderItemDTO): Promise<OrderItem> {
    try {
      const response = await fetch(getApiUrl('/order-items'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error(errorData.message || 'Orden o producto no encontrado');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'La orden ya ha sido validada y no se puede modificar');
        }

        throw new Error(errorData.message || 'Error al agregar el item a la orden');
      }

      const newItem: OrderItem = await response.json();
      return newItem;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  async findAll(filters?: { orderId?: number; productId?: number }): Promise<OrderItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.orderId) params.append('orderId', filters.orderId.toString());
      if (filters?.productId) params.append('productId', filters.productId.toString());

      const url = `${getApiUrl('/order-items')}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener los items de la orden');
      }

      const items: OrderItem[] = await response.json();
      return items;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<OrderItem> {
    try {
      const response = await fetch(getApiUrl(`/order-items/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Item no encontrado');
        }

        throw new Error(errorData.message || 'Error al obtener el item');
      }

      const item: OrderItem = await response.json();
      return item;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async update(id: number, updateData: UpdateOrderItemDTO): Promise<OrderItem> {
    try {
      const response = await fetch(getApiUrl(`/order-items/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Item no encontrado');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'La orden ya ha sido validada y no se puede modificar');
        }

        throw new Error(errorData.message || 'Error al actualizar el item');
      }

      const updatedItem: OrderItem = await response.json();
      return updatedItem;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      const response = await fetch(getApiUrl(`/order-items/${id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Item no encontrado');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'La orden ya ha sido validada y no se puede modificar');
        }

        throw new Error(errorData.message || 'Error al eliminar el item');
      }

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findByOrderId(orderId: number): Promise<OrderItem[]> {
    try {
      const response = await fetch(getApiUrl(`/order-items/order/${orderId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener los items de la orden');
      }

      const items: OrderItem[] = await response.json();
      return items;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  }
};

