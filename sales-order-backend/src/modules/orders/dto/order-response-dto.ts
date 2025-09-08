import { OrderStatus } from '../../../entities/order.entity';

export class OrderResponseDto {
  id: number;
  clientId: number;
  createdById: number;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    id: number;
    name: string;
    email: string;
  };
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
  orderItems?: Array<{
    id: number;
    productId: number;
    quantity: number;
    notes?: string;
    product?: {
      id: number;
      name: string;
      price: number;
    };
  }>;
  orderLink?: {
    id: number;
    token: string;
    expiresAt: Date;
    isActive: boolean;
  };
  orderValidations?: Array<{
    id: number;
    validatedById: number;
    validatedAt: Date;
    notes?: string;
    validatedBy?: {
      id: number;
      name: string;
      email: string;
    };
  }>;
}
