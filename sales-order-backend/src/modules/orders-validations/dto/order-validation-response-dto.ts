import { OrderStatus } from '../../../entities/order.entity';

export class OrderValidationResponseDto {
  id: number;
  orderId: number;
  validatedById: number;
  validatedAt: Date;
  notes?: string;
  order?: {
    id: number;
    clientId: number;
    status: OrderStatus;
    totalAmount: number;
    client?: {
      id: number;
      name: string;
      email: string;
    };
  };
  validatedBy?: {
    id: number;
    name: string;
    email: string;
  };
}
