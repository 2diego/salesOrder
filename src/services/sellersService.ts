import { apiFetch } from './http';

export interface CreateSellerDTO {
  username: string;
  email: string;
  password: string;
  role?: 'seller';
  name: string;
  phone: string;
  isActive?: boolean;
}

export interface UpdateSellerDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: 'seller';
  name?: string;
  phone?: string;
  isActive?: boolean;
}

export interface Seller {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const sellersService = {
  async create(sellerData: CreateSellerDTO): Promise<Seller> {
    try {
      // Establecer el rol como 'seller' por defecto si no viene especificado
      const userData = {
        ...sellerData,
        role: sellerData.role || 'seller',
        isActive: sellerData.isActive !== undefined ? sellerData.isActive : true
      };

      const response = await apiFetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409) {
          throw new Error('Ya existe un usuario con este nombre de usuario o correo electrónico');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al crear el vendedor');
      }

      const newSeller: Seller = await response.json();
      return newSeller;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  async findAll(): Promise<Seller[]> {
    try {
      const response = await apiFetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener la lista de vendedores');
      }

      const sellers: Seller[] = await response.json();
      return sellers;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async findOne(id: number): Promise<Seller> {
    try {
      const response = await apiFetch(`/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Vendedor no encontrado');
        }

        throw new Error(errorData.message || 'Error al obtener el vendedor');
      }

      const seller: Seller = await response.json();
      return seller;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async update(id: number, updateData: UpdateSellerDTO): Promise<Seller> {
    try {
      const response = await apiFetch(`/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Vendedor no encontrado');
        }
        
        if (response.status === 409) {
          throw new Error('Ya existe un usuario con este nombre de usuario o correo electrónico');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al actualizar el vendedor');
      }

      const updatedSeller: Seller = await response.json();
      return updatedSeller;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },

  async remove(id: number): Promise<{ message: string }> {
    try {
      const response = await apiFetch(`/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Vendedor no encontrado');
        }

        throw new Error(errorData.message || 'Error al eliminar el vendedor');
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

