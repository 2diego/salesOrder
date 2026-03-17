import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/entities/client.entity';
import { Order, OrderStatus } from 'src/entities/order.entity';
import { CreateClientDTO } from './dto/create-client-dto';
import { UpdateClientDTO } from './dto/update-client-dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createClientDto: CreateClientDTO): Promise<Client> {
    // Verificar si ya existe un cliente con el mismo email
    const existingClient = await this.clientRepository.findOne({
      where: { email: createClientDto.email }
    });

    if (existingClient) {
      throw new ConflictException('Ya existe un cliente con este correo electrónico');
    }

    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id, isActive: true }
    });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDTO): Promise<Client> {
    const client = await this.findOne(id);

    // Si se va a actualizar el email, verificar que no exista
    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existingClient = await this.clientRepository.findOne({
        where: { email: updateClientDto.email }
      });

      if (existingClient) {
        throw new ConflictException('Ya existe un cliente con este correo electrónico');
      }
    }

    await this.clientRepository.update(id, updateClientDto);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const client = await this.findOne(id);

    // Soft delete (desactivar) para no romper historial de pedidos
    client.isActive = false;
    await this.clientRepository.save(client);

    // Autocancelar pedidos pendientes del cliente
    const pendingOrders = await this.orderRepository.find({
      where: { clientId: id, status: OrderStatus.PENDING },
    });

    for (const order of pendingOrders) {
      // FUTURO (auditoría): registrar un evento de negocio o una "validación de cancelación"
      // (por ejemplo, crear un registro en una tabla order_events/order_validations) para guardar:
      // - quién desactivó el cliente, cuándo, y el motivo
      // - el cambio de estado (pending -> cancelled) y cualquier nota asociada
      const previousNotes = (order.notes || '').trim();
      const cancelNote = 'Pedido cancelado automáticamente: cliente desactivado.';
      const nextNotes = previousNotes ? `${previousNotes}\n${cancelNote}` : cancelNote;

      await this.orderRepository.update(order.id, {
        status: OrderStatus.CANCELLED,
        notes: nextNotes,
      });
    }

    return { message: `Cliente "${client.name}" ha sido desactivado` };
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: { email }
    });
  }
}
