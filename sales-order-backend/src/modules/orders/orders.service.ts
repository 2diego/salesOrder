import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { CreateOrderDto } from './dto/create-order-dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { OrderResponseDto } from './dto/order-response-dto';

export type OrderListItemDto = {
  id: number;
  clientId: number;
  createdById: number;
  status: OrderStatus;
  createdAt: Date;
  client?: {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    address: string;
    city: string;
  };
};

export type PagedResultDto<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      totalAmount: 0, // Se calcula cuando se agreguen items
    });

    const savedOrder = await this.orderRepository.save(order);
    return this.formatOrderResponse(savedOrder);
  }

  async findAll(filters?: {
    clientId?: number;
    createdById?: number;
    status?: OrderStatus;
  }): Promise<OrderResponseDto[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.createdBy', 'createdBy')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoinAndSelect('order.orderLink', 'orderLink')
      .leftJoinAndSelect('order.orderValidations', 'orderValidations')
      .leftJoinAndSelect('orderValidations.validatedBy', 'validatedBy');

    if (filters?.clientId) {
      query.andWhere('order.clientId = :clientId', { clientId: filters.clientId });
    }
    if (filters?.createdById) {
      query.andWhere('order.createdById = :createdById', { createdById: filters.createdById });
    }
    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    const orders = await query.getMany();
    return orders.map(order => this.formatOrderResponse(order));
  }

  async findPaged(params: {
    page: number;
    limit: number;
    status?: OrderStatus;
    q?: string;
  }): Promise<PagedResultDto<OrderListItemDto>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const offset = (page - 1) * limit;

    const q = (params.q || '').trim();

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .where('1=1')
      // Excluir órdenes vacías (sin items)
      .andWhere('EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = order.id)')
      .orderBy('order.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    if (params.status) {
      query.andWhere('order.status = :status', { status: params.status });
    }

    if (q) {
      const qLike = `%${q}%`;
      const qNum = Number(q);
      query.andWhere(
        qNum && Number.isFinite(qNum)
          ? '(order.id = :qNum OR client.name LIKE :qLike OR client.email LIKE :qLike OR client.phone LIKE :qLike)'
          : '(client.name LIKE :qLike OR client.email LIKE :qLike OR client.phone LIKE :qLike)',
        { qLike, qNum },
      );
    }

    // Count (distinct orders) with same filters
    const countQuery = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.client', 'client')
      .select('order.id')
      .distinct(true)
      .where('1=1')
      .andWhere('EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = order.id)');

    if (params.status) {
      countQuery.andWhere('order.status = :status', { status: params.status });
    }

    if (q) {
      const qLike = `%${q}%`;
      const qNum = Number(q);
      countQuery.andWhere(
        qNum && Number.isFinite(qNum)
          ? '(order.id = :qNum OR client.name LIKE :qLike OR client.email LIKE :qLike OR client.phone LIKE :qLike)'
          : '(client.name LIKE :qLike OR client.email LIKE :qLike OR client.phone LIKE :qLike)',
        { qLike, qNum },
      );
    }

    const [orders, total] = await Promise.all([query.getMany(), countQuery.getCount()]);

    const data: OrderListItemDto[] = orders.map(order => ({
      id: order.id,
      clientId: order.clientId,
      createdById: order.createdById,
      status: order.status,
      createdAt: order.createdAt,
      client: order.client ? {
        id: order.client.id,
        name: order.client.name,
        email: order.client.email,
        phone: order.client.phone,
        address: order.client.address,
        city: order.client.city,
      } : undefined,
    }));

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'client',
        'createdBy',
        'orderItems',
        'orderItems.product',
        'orderLink',
        'orderValidations',
        'orderValidations.validatedBy',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return this.formatOrderResponse(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.findOne(id);
    
    if (order.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('No se puede actualizar un pedido validado');
    }

    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    
    if (order.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('No se puede eliminar un pedido validado');
    }

    await this.orderRepository.delete(id);
  }

  async calculateTotalAmount(orderId: number): Promise<number> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${orderId} no encontrado`);
    }

    const totalAmount = order.orderItems.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);

    await this.orderRepository.update(orderId, { totalAmount });
    return totalAmount;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<OrderResponseDto> {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }

  private formatOrderResponse(order: Order): OrderResponseDto {
    return {
      id: order.id,
      clientId: order.clientId,
      createdById: order.createdById,
      status: order.status,
      totalAmount: order.totalAmount,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      client: order.client ? {
        id: order.client.id,
        name: order.client.name,
        email: order.client.email,
        phone: order.client.phone,
        address: order.client.address,
        city: order.client.city,
      } : undefined,
      createdBy: order.createdBy ? {
        id: order.createdBy.id,
        name: order.createdBy.name,
        email: order.createdBy.email,
      } : undefined,
      orderItems: order.orderItems?.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        } : undefined,
      })),
      orderLink: order.orderLink ? {
        id: order.orderLink.id,
        token: order.orderLink.token,
        expiresAt: order.orderLink.expiresAt,
        isActive: order.orderLink.isActive,
      } : undefined,
      orderValidations: order.orderValidations?.map(validation => ({
        id: validation.id,
        validatedById: validation.validatedById,
        validatedAt: validation.validatedAt,
        notes: validation.notes,
        validatedBy: validation.validatedBy ? {
          id: validation.validatedBy.id,
          name: validation.validatedBy.name,
          email: validation.validatedBy.email,
        } : undefined,
      })),
    };
  }
}
