import { getApiUrl } from '../config/api.config';

//findOne, update y remove se usarian en el edit

// Interface del back
export interface CreateClientDTO {
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  company?: string;
  notes?: string;
  isActive?: boolean;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  company?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  company?: string;
  notes?: string;
  isActive?: boolean;
}


export const clientsService = {
  
  async create(clientData: CreateClientDTO): Promise<Client> {
    try {
      const response = await fetch(getApiUrl('/clients'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      // Si la respuesta no es exitosa, lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Manejar errores específicos del backend
        if (response.status === 409) {
          throw new Error(errorData.message || 'Ya existe un cliente con este correo electrónico');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al crear el cliente');
      }

      // Parsear y retornar el cliente creado
      const newClient: Client = await response.json();
      return newClient;

    } catch (error) {
      // Si es un error de red o fetch
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      // Re-lanzar el error para que lo maneje el componente
      throw error;
    }
  },
  
  async findAll(): Promise<Client[]> {
    try {
      const response = await fetch(getApiUrl('/clients'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener la lista de clientes');
      }

      const clients: Client[] = await response.json();
      return clients;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },
  
  async findOne(id: number): Promise<Client> {
    try {
      const response = await fetch(getApiUrl(`/clients/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Cliente no encontrado');
        }

        throw new Error(errorData.message || 'Error al obtener el cliente');
      }

      const client: Client = await response.json();
      return client;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },
  
  async update(id: number, updateData: UpdateClientDTO): Promise<Client> {
    try {
      const response = await fetch(getApiUrl(`/clients/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Cliente no encontrado');
        }
        
        if (response.status === 409) {
          throw new Error('Ya existe un cliente con este correo electrónico');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.message || 'Datos inválidos. Por favor verifica los campos');
        }

        throw new Error(errorData.message || 'Error al actualizar el cliente');
      }

      const updatedClient: Client = await response.json();
      return updatedClient;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con el servidor.');
      }
      throw error;
    }
  },
  
  async remove(id: number): Promise<{ message: string }> {
    try {
      const response = await fetch(getApiUrl(`/clients/${id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Cliente no encontrado');
        }
        
        throw new Error(errorData.message || 'Error al eliminar el cliente');
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

