export class OrderLinkResponseDto {
  id: number;
  orderId: number;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  createdById: number;
  order?: {
    id: number;
    clientId: number;
    status: string;
    totalAmount: number;
    client?: {
      id: number;
      name: string;
      email: string | null;
    };
  };
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}
