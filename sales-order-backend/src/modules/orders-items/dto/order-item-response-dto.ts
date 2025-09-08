export class OrderItemResponseDto {
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
  };
  order?: {
    id: number;
    status: string;
    totalAmount: number;
  };
}
