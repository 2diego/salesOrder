import { apiFetch } from './http';

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  sku?: string;
  /** URL HTTPS directa a la imagen (no página tipo ibb.co/...). */
  imageUrl?: string | null;
  stock: number;
  isActive?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  sku?: string;
  imageUrl?: string | null;
  stock?: number;
  isActive?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  sku: string;
  /** Null si no hay imagen asignada en BD. */
  imageUrl?: string | null;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export const productsService = {
  
  async create(productData: CreateProductDTO): Promise<Product> {
    try {
      const response = await apiFetch('/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409) {
          throw new Error(errorData.message || 'Ya existe un producto con este código o SKU');
        }
        
        if (response.status === 404) {
          throw new Error('La categoría especificada no existe');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al crear el producto');
      }

      const newProduct: Product = await response.json();
      return newProduct;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  async findAll(): Promise<Product[]> {
    try {
      const response = await apiFetch('/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener la lista de productos');
      }

      const products: Product[] = await response.json();
      return products;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<Product> {
    try {
      const response = await apiFetch(`/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Producto no encontrado');
        }

        throw new Error(errorData.message || 'Error al obtener el producto');
      }

      const product: Product = await response.json();
      return product;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findByCategory(categoryId: number): Promise<Product[]> {
    try {
      const response = await apiFetch(`/products/category/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener productos de la categoría');
      }

      const products: Product[] = await response.json();
      return products;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async update(id: number, updateData: UpdateProductDTO): Promise<Product> {
    try {
      const response = await apiFetch(`/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Producto no encontrado');
        }
        
        if (response.status === 409) {
          throw new Error(errorData.message || 'Ya existe un producto con este código o SKU');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al actualizar el producto');
      }

      const updatedProduct: Product = await response.json();
      return updatedProduct;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async remove(id: number): Promise<{ message: string }> {
    try {
      const response = await apiFetch(`/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Producto no encontrado');
        }
        
        throw new Error(errorData.message || 'Error al eliminar el producto');
      }

      const result: { message: string } = await response.json();
      return result;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  }
};
