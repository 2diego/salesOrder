import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { CreateOrderItemDto } from './dto/create-order-item-dto';
import { UpdateOrderItemDto } from './dto/update-order-item-dto';
import { OrderItemResponseDto } from './dto/order-item-response-dto';

@Injectable()
export class OrdersItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    // Verificar que la orden existe y no está validada
    const order = await this.orderRepository.findOne({
      where: { id: createOrderItemDto.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${createOrderItemDto.orderId} no encontrado`);
    }

    if (order.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('No se pueden agregar items a un pedido validado');
    }

    // Verificar si ya existe un item para este producto en la orden
    const existingItem = await this.orderItemRepository.findOne({
      where: {
        orderId: createOrderItemDto.orderId,
        productId: createOrderItemDto.productId,
      },
    });

    if (existingItem) {
      // Si ya existe, actualizar la cantidad
      existingItem.quantity += createOrderItemDto.quantity;
      const updatedItem = await this.orderItemRepository.save(existingItem);
      return this.formatOrderItemResponse(updatedItem);
    }

    const orderItem = this.orderItemRepository.create(createOrderItemDto);
    const savedItem = await this.orderItemRepository.save(orderItem);
    
    // Recalcular el monto total de la orden
    await this.recalculateOrderTotal(createOrderItemDto.orderId);
    
    return this.formatOrderItemResponse(savedItem);
  }

  async findAll(filters?: {
    orderId?: number;
    productId?: number;
  }): Promise<OrderItemResponseDto[]> {
    const query = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('orderItem.order', 'order');

    if (filters?.orderId) {
      query.andWhere('orderItem.orderId = :orderId', { orderId: filters.orderId });
    }
    if (filters?.productId) {
      query.andWhere('orderItem.productId = :productId', { productId: filters.productId });
    }

    const orderItems = await query.getMany();
    return orderItems.map(item => this.formatOrderItemResponse(item));
  }

  async findOne(id: number): Promise<OrderItemResponseDto> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['product', 'order'],
    });

    if (!orderItem) {
      throw new NotFoundException(`Item de pedido con ID ${id} no encontrado`);
    }

    return this.formatOrderItemResponse(orderItem);
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItemResponseDto> {
    const orderItem = await this.findOne(id);
    
    // Verificar que la orden no esté validada
    if (orderItem.order?.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('No se pueden actualizar items en un pedido validado');
    }

    await this.orderItemRepository.update(id, updateOrderItemDto);
    
    // Recalcular el monto total de la orden
    await this.recalculateOrderTotal(orderItem.orderId);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    
    // Verificar que la orden no esté validada
    if (orderItem.order?.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('No se pueden eliminar items de un pedido validado');
    }

    await this.orderItemRepository.delete(id);
    
    // Recalcular el monto total de la orden
    await this.recalculateOrderTotal(orderItem.orderId);
  }

  async findByOrderId(orderId: number): Promise<OrderItemResponseDto[]> {
    return this.findAll({ orderId });
  }

  private async recalculateOrderTotal(orderId: number): Promise<void> {
    const orderItems = await this.orderItemRepository.find({
      where: { orderId },
      relations: ['product'],
    });

    const totalAmount = orderItems.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);

    await this.orderRepository.update(orderId, { totalAmount });
  }

  private formatOrderItemResponse(orderItem: OrderItem): OrderItemResponseDto {
    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      notes: orderItem.notes,
      product: orderItem.product ? {
        id: orderItem.product.id,
        name: orderItem.product.name,
        price: orderItem.product.price,
        description: orderItem.product.description,
        sku: orderItem.product.sku,
        imageUrl: orderItem.product.imageUrl,
      } : undefined,
      order: orderItem.order ? {
        id: orderItem.order.id,
        status: orderItem.order.status,
        totalAmount: orderItem.order.totalAmount,
      } : undefined,
    };
  }
}
