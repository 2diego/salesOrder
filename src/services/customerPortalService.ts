import { API_BASE_URL } from '../config/api.config';
import type { Client } from './clientsService';
import type { Order } from './ordersService';
import { OrderStatus } from './ordersService';

export type OrderItemPortal = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  notes?: string;
  product?: {
    id: number;
    name: string;
    price: number;
    description?: string;
    sku?: string;
    imageUrl?: string | null;
  };
};

function qp(linkToken: string, params: Record<string, string> = {}): string {
  return new URLSearchParams({ linkToken, ...params }).toString();
}

async function parseJson<T>(response: Response): Promise<T> {
  const errorData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((errorData as { message?: string }).message ?? 'Error en la solicitud');
  }
  return errorData as T;
}

export const customerPortalService = {
  async findOrdersByClient(clientId: number, linkToken: string): Promise<Order[]> {
    const url = `${API_BASE_URL}/customer-portal/orders?${qp(linkToken, {
      clientId: String(clientId),
    })}`;
    const response = await fetch(url);
    return parseJson<Order[]>(response);
  },

  async findOrder(orderId: number, linkToken: string): Promise<Order> {
    const url = `${API_BASE_URL}/customer-portal/orders/${orderId}?${qp(linkToken)}`;
    const response = await fetch(url);
    return parseJson<Order>(response);
  },

  async updateOrderStatus(orderId: number, status: OrderStatus, linkToken: string): Promise<Order> {
    const url = `${API_BASE_URL}/customer-portal/orders/${orderId}/status?${qp(linkToken)}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return parseJson<Order>(response);
  },

  async findClient(clientId: number, linkToken: string): Promise<Client> {
    const url = `${API_BASE_URL}/customer-portal/clients/${clientId}?${qp(linkToken)}`;
    const response = await fetch(url);
    return parseJson<Client>(response);
  },

  async findOrderItems(orderId: number, linkToken: string): Promise<OrderItemPortal[]> {
    const url = `${API_BASE_URL}/customer-portal/order-items?${qp(linkToken, {
      orderId: String(orderId),
    })}`;
    const response = await fetch(url);
    return parseJson<OrderItemPortal[]>(response);
  },

  async createOrderItem(
    body: { orderId: number; productId: number; quantity: number; notes?: string },
    linkToken: string,
  ): Promise<OrderItemPortal> {
    const url = `${API_BASE_URL}/customer-portal/order-items?${qp(linkToken)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return parseJson<OrderItemPortal>(response);
  },

  async updateOrderItem(
    id: number,
    body: { quantity?: number; notes?: string },
    linkToken: string,
  ): Promise<OrderItemPortal> {
    const url = `${API_BASE_URL}/customer-portal/order-items/${id}?${qp(linkToken)}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return parseJson<OrderItemPortal>(response);
  },

  async removeOrderItem(id: number, linkToken: string): Promise<void> {
    const url = `${API_BASE_URL}/customer-portal/order-items/${id}?${qp(linkToken)}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as { message?: string }).message ?? 'Error al eliminar ítem');
    }
  },
};
