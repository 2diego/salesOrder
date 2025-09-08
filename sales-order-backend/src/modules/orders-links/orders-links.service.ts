import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderLink } from '../../entities/order-link.entity';
import { Order } from '../../entities/order.entity';
import { CreateOrderLinkDto } from './dto/create-order-link-dto';
import { UpdateOrderLinkDto } from './dto/update-order-link-dto';
import { OrderLinkResponseDto } from './dto/order-link-response-dto';
import { randomBytes } from 'crypto';

@Injectable()
export class OrdersLinksService {
  constructor(
    @InjectRepository(OrderLink)
    private orderLinkRepository: Repository<OrderLink>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createOrderLinkDto: CreateOrderLinkDto): Promise<OrderLinkResponseDto> {
    // Verificar que la orden existe
    const order = await this.orderRepository.findOne({
      where: { id: createOrderLinkDto.orderId },
      relations: ['client'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${createOrderLinkDto.orderId} not found`);
    }

    // Verificar que no existe ya un link activo para esta orden
    const existingLink = await this.orderLinkRepository.findOne({
      where: { 
        orderId: createOrderLinkDto.orderId,
        isActive: true,
      },
    });

    if (existingLink) {
      throw new BadRequestException('An active link already exists for this order');
    }

    // Generar token único
    const token = this.generateUniqueToken();
    
    // Calcular fecha de expiración (24 horas por defecto)
    const expiresAt = createOrderLinkDto.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000);

    const orderLink = this.orderLinkRepository.create({
      ...createOrderLinkDto,
      token,
      expiresAt,
    });

    const savedLink = await this.orderLinkRepository.save(orderLink);
    return this.formatOrderLinkResponse(savedLink);
  }

  async findAll(filters?: {
    orderId?: number;
    createdById?: number;
    isActive?: boolean;
  }): Promise<OrderLinkResponseDto[]> {
    const query = this.orderLinkRepository
      .createQueryBuilder('orderLink')
      .leftJoinAndSelect('orderLink.order', 'order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('orderLink.createdBy', 'createdBy');

    if (filters?.orderId) {
      query.andWhere('orderLink.orderId = :orderId', { orderId: filters.orderId });
    }
    if (filters?.createdById) {
      query.andWhere('orderLink.createdById = :createdById', { createdById: filters.createdById });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('orderLink.isActive = :isActive', { isActive: filters.isActive });
    }

    const orderLinks = await query.getMany();
    return orderLinks.map(link => this.formatOrderLinkResponse(link));
  }

  async findOne(id: number): Promise<OrderLinkResponseDto> {
    const orderLink = await this.orderLinkRepository.findOne({
      where: { id },
      relations: ['order', 'order.client', 'createdBy'],
    });

    if (!orderLink) {
      throw new NotFoundException(`Order link with ID ${id} not found`);
    }

    return this.formatOrderLinkResponse(orderLink);
  }

  async findByToken(token: string): Promise<OrderLinkResponseDto> {
    const orderLink = await this.orderLinkRepository.findOne({
      where: { token },
      relations: ['order', 'order.client', 'createdBy'],
    });

    if (!orderLink) {
      throw new NotFoundException(`Order link with token ${token} not found`);
    }

    // Verificar si el link está activo y no ha expirado
    if (!orderLink.isActive) {
      throw new BadRequestException('Order link is not active');
    }

    if (new Date() > orderLink.expiresAt) {
      throw new BadRequestException('Order link has expired');
    }

    return this.formatOrderLinkResponse(orderLink);
  }

  async update(id: number, updateOrderLinkDto: UpdateOrderLinkDto): Promise<OrderLinkResponseDto> {
    await this.orderLinkRepository.update(id, updateOrderLinkDto);
    return this.findOne(id);
  }

  async deactivate(id: number): Promise<OrderLinkResponseDto> {
    await this.orderLinkRepository.update(id, { isActive: false });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.orderLinkRepository.delete(id);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.findByToken(token);
      return true;
    } catch {
      return false;
    }
  }

  private generateUniqueToken(): string {
    return randomBytes(32).toString('hex');
  }

  private formatOrderLinkResponse(orderLink: OrderLink): OrderLinkResponseDto {
    return {
      id: orderLink.id,
      orderId: orderLink.orderId,
      token: orderLink.token,
      expiresAt: orderLink.expiresAt,
      isActive: orderLink.isActive,
      createdAt: orderLink.createdAt,
      createdById: orderLink.createdById,
      order: orderLink.order ? {
        id: orderLink.order.id,
        clientId: orderLink.order.clientId,
        status: orderLink.order.status,
        totalAmount: orderLink.order.totalAmount,
        client: orderLink.order.client ? {
          id: orderLink.order.client.id,
          name: orderLink.order.client.name,
          email: orderLink.order.client.email,
        } : undefined,
      } : undefined,
      createdBy: orderLink.createdBy ? {
        id: orderLink.createdBy.id,
        name: orderLink.createdBy.name,
        email: orderLink.createdBy.email,
      } : undefined,
    };
  }
}
