export interface ProductItem {
  id: string;
  name: string;
  detail?: string;
  quantity: number;
  price?: number;
  /** URL de miniatura; si falta, ProductList usa el default de configuración. */
  imageUrl?: string;
}
