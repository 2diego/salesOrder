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
    sku?: string;
    imageUrl?: string | null;
  };
  order?: {
    id: number;
    status: string;
    totalAmount: number;
  };
}
