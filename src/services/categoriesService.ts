import { getApiUrl } from '../config/api.config';

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export const categoriesService = {
  async create(categoryData: CreateCategoryDTO): Promise<Category> {
    try {
      const response = await fetch(getApiUrl('/categories'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409) {
          throw new Error('Ya existe una categoría con este nombre');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al crear la categoría');
      }

      const newCategory: Category = await response.json();
      return newCategory;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  async findAll(): Promise<Category[]> {
    try {
      const response = await fetch(getApiUrl('/categories'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener la lista de categorías');
      }

      const categories: Category[] = await response.json();
      return categories;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<Category> {
    try {
      const response = await fetch(getApiUrl(`/categories/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Categoría no encontrada');
        }

        throw new Error(errorData.message || 'Error al obtener la categoría');
      }

      const category: Category = await response.json();
      return category;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  }
};

