import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/entities/client.entity';
import { CreateClientDTO } from './dto/create-client-dto';
import { UpdateClientDTO } from './dto/update-client-dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
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
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id }
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
    
    // Verificar si hay órdenes usando este cliente (solo pendientes?)
    const ordersCount = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoin('client.orders', 'order')
      .where('client.id = :id', { id })
      //.andWhere('order.status = :status', { status: 'PENDING' })
      .getCount();

    if (ordersCount > 0) {
      throw new ConflictException('No se puede eliminar un cliente que tiene pedidos asociados');
    }

    //Eliminar o desactivar? Si se elimina hay que eliminar ordenes asociadas?
    // await this.clientRepository.remove(client); ELIMINAR
    // desactivar:
    client.isActive = false;
    await this.clientRepository.save(client);

    return { message: `Cliente "${client.name}" ha sido eliminado` };
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: { email }
    });
  }
}
