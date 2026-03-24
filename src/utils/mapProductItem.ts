import type { Product } from '../services/productsService';
import type { ProductItem } from '../components/desktop/CustomerPanels/types';
import type { OrderItem } from '../services/ordersItemsService';

export function mapApiProductToItem(product: Product, quantity: number): ProductItem {
  return {
    id: product.id.toString(),
    name: product.name,
    detail: product.description || '',
    quantity,
    price: product.price,
    imageUrl: product.imageUrl ?? undefined,
  };
}

export function mapOrderItemToProductItem(item: OrderItem): ProductItem {
  return {
    id: item.productId.toString(),
    name: item.product?.name || 'Producto',
    detail: item.product?.description || item.product?.sku || '',
    quantity: item.quantity,
    price: item.product?.price,
    imageUrl: item.product?.imageUrl ?? undefined,
  };
}

/**
 * Completa `imageUrl` (y detalle vacío) desde el catálogo cuando el ítem vino de
 * localStorage antiguo o sin `imageUrl`.
 */
export function mergeProductItemsWithCatalog(
  items: ProductItem[],
  catalog: Product[],
): ProductItem[] {
  const byId = new Map(catalog.map((p) => [String(p.id), p]));
  return items.map((item) => {
    const api = byId.get(item.id);
    return {
      ...item,
      imageUrl: item.imageUrl ?? api?.imageUrl ?? undefined,
      detail: item.detail?.trim() ? item.detail : api?.description || item.detail,
    };
  });
}
