import { getApiUrl } from '../config/api.config';
import { OrderStatus } from './ordersService';

export interface CreateOrderValidationDTO {
  orderId: number;
  validatedById: number;
  status: OrderStatus;
  notes?: string;
}

export interface OrderValidation {
  id: number;
  orderId: number;
  validatedById: number;
  validatedAt: string;
  notes?: string;
  order?: {
    id: number;
    status: string;
    totalAmount: number;
    clientId: number;
  };
  validatedBy?: {
    id: number;
    name: string;
    username: string;
  };
}

export const ordersValidationsService = {
  
  async create(validationData: CreateOrderValidationDTO): Promise<OrderValidation> {
    try {
      const response = await fetch(getApiUrl('/orders-validations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error(errorData.message || 'Orden o usuario no encontrado');
        }
        
        if (response.status === 409) {
          throw new Error(errorData.message || 'La orden ya ha sido validada');
        }

        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al crear la validación');
      }

      const newValidation: OrderValidation = await response.json();
      return newValidation;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  async findAll(filters?: { orderId?: number; validatedById?: number }): Promise<OrderValidation[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.orderId) params.append('orderId', filters.orderId.toString());
      if (filters?.validatedById) params.append('validatedById', filters.validatedById.toString());

      const url = `${getApiUrl('/orders-validations')}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener las validaciones');
      }

      const validations: OrderValidation[] = await response.json();
      return validations;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<OrderValidation> {
    try {
      const response = await fetch(getApiUrl(`/orders-validations/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Validación no encontrada');
        }

        throw new Error(errorData.message || 'Error al obtener la validación');
      }

      const validation: OrderValidation = await response.json();
      return validation;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findByOrderId(orderId: number): Promise<OrderValidation[]> {
    try {
      const response = await fetch(getApiUrl(`/orders-validations/order/${orderId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener las validaciones de la orden');
      }

      const validations: OrderValidation[] = await response.json();
      return validations;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async validateOrder(orderId: number, validatedById: number, status: OrderStatus, notes?: string): Promise<OrderValidation> {
    try {
      const response = await fetch(getApiUrl(`/orders-validations/validate`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          validatedById,
          status,
          notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error(errorData.message || 'Orden o usuario no encontrado');
        }
        
        if (response.status === 409) {
          throw new Error(errorData.message || 'La orden ya ha sido validada');
        }

        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al validar la orden');
      }

      const validation: OrderValidation = await response.json();
      return validation;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  }
};

