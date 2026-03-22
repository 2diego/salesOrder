import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/entities/client.entity';
import { Order, OrderStatus } from 'src/entities/order.entity';
import { CreateClientDTO, ARG_PROVINCES } from './dto/create-client-dto';
import { UpdateClientDTO } from './dto/update-client-dto';
import { CLIENT_VALIDATION_MESSAGES } from './client-validation.messages';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  private normalizeTitle(text: string): string {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    const lower = cleaned.toLocaleLowerCase('es-AR');
    const smallWords = new Set(['de', 'del', 'la', 'las', 'los', 'y']);
    return lower
      .split(' ')
      .map((w, idx) => {
        if (idx !== 0 && smallWords.has(w)) return w;
        return w.charAt(0).toLocaleUpperCase('es-AR') + w.slice(1);
      })
      .join(' ');
  }

  /** Mismas reglas que el front (AddClients / EditClients): sin puntos ni abreviaturas típicas */
  private assertCityNoAbbreviations(city: string) {
    const raw = city.trim();
    if (raw.includes('.')) {
      throw new BadRequestException(CLIENT_VALIDATION_MESSAGES.CITY_NO_ABBREVIATIONS);
    }
    if (/\b(bs|baires|caba)\b/i.test(raw)) {
      throw new BadRequestException(CLIENT_VALIDATION_MESSAGES.CITY_NO_ABBREVIATIONS);
    }
  }

  private normalizeCity(city: string): string {
    this.assertCityNoAbbreviations(city);
    return this.normalizeTitle(city);
  }

  /** Para listar ciudades existentes: solo título, sin assert (evita romper GET si hubiera datos legacy) */
  private normalizeCityLabel(city: string): string {
    return this.normalizeTitle(city);
  }

  private normalizeProvince(state: string): string {
    const normalized = this.normalizeTitle(state);
    // Si llega un valor fuera de catálogo, preferimos fallar con mensaje claro
    if (!ARG_PROVINCES.includes(normalized as any)) {
      throw new BadRequestException(CLIENT_VALIDATION_MESSAGES.PROVINCE_FROM_LIST);
    }
    return normalized;
  }

  async create(createClientDto: CreateClientDTO): Promise<Client> {
    // Verificar si ya existe un cliente con el mismo email (solo si se envía email)
    const emailTrimmed = createClientDto.email?.trim();
    if (emailTrimmed) {
      const existingClient = await this.clientRepository.findOne({
        where: { email: emailTrimmed }
      });

      if (existingClient) {
        throw new ConflictException('Ya existe un cliente con este correo electrónico');
      }
    }

    const client = this.clientRepository.create({
      ...createClientDto,
      city: this.normalizeCity(createClientDto.city),
      state: this.normalizeProvince(createClientDto.state),
      // Si no hay email, se omite y la columna queda NULL
      ...(emailTrimmed ? { email: emailTrimmed } : {}),
    });
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
    const emailTrimmed = updateClientDto.email?.trim();
    if (emailTrimmed && emailTrimmed !== client.email) {
      const existingClient = await this.clientRepository.findOne({
        where: { email: emailTrimmed }
      });

      if (existingClient) {
        throw new ConflictException('Ya existe un cliente con este correo electrónico');
      }
    }

    const updatePayload: any = {
      ...updateClientDto,
      ...(emailTrimmed ? { email: emailTrimmed } : {}),
    };

    if (updateClientDto.city !== undefined) {
      updatePayload.city = this.normalizeCity(updateClientDto.city);
    }
    if (updateClientDto.state !== undefined) {
      updatePayload.state = this.normalizeProvince(updateClientDto.state);
    }

    await this.clientRepository.update(id, updatePayload);
    
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

  async findCitiesByProvince(state: string): Promise<string[]> {
    const normalizedState = this.normalizeProvince(state);
    const rows = await this.clientRepository
      .createQueryBuilder('client')
      .select('DISTINCT client.city', 'city')
      .where('client.isActive = :isActive', { isActive: true })
      .andWhere('client.state = :state', { state: normalizedState })
      .andWhere('client.city IS NOT NULL')
      .andWhere("TRIM(client.city) <> ''")
      .orderBy('client.city', 'ASC')
      .getRawMany<{ city: string }>();

    const normalized = rows
      .map(r => r.city)
      .filter(Boolean)
      .map(c => this.normalizeCityLabel(c));

    return Array.from(new Set(normalized)).sort((a, b) => a.localeCompare(b, 'es-AR'));
  }
}
