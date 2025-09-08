import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { CreateOrderDto } from './dto/create-order-dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { OrderResponseDto } from './dto/order-response-dto';

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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.formatOrderResponse(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.findOne(id);
    
    if (order.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('Cannot update a validated order');
    }

    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    
    if (order.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('Cannot delete a validated order');
    }

    await this.orderRepository.delete(id);
  }

  async calculateTotalAmount(orderId: number): Promise<number> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
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
