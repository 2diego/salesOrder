import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderValidation } from '../../entities/order-validation.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { CreateOrderValidationDto } from './dto/create-order-validation-dto';
import { UpdateOrderValidationDto } from './dto/update-order-validation-dto';
import { OrderValidationResponseDto } from './dto/order-validation-response-dto';

@Injectable()
export class OrdersValidationsService {
  constructor(
    @InjectRepository(OrderValidation)
    private orderValidationRepository: Repository<OrderValidation>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createOrderValidationDto: CreateOrderValidationDto): Promise<OrderValidationResponseDto> {
    // Verificar que la orden existe
    const order = await this.orderRepository.findOne({
      where: { id: createOrderValidationDto.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${createOrderValidationDto.orderId} not found`);
    }

    // Verificar que la orden no esté ya validada
    if (order.status === OrderStatus.VALIDATED) {
      throw new BadRequestException('Order is already validated');
    }

    // Verificar que la orden no esté cancelada
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot validate a cancelled order');
    }

    // Crear la validación
    const orderValidation = this.orderValidationRepository.create(createOrderValidationDto);
    const savedValidation = await this.orderValidationRepository.save(orderValidation);

    // Actualizar el estado de la orden
    await this.orderRepository.update(createOrderValidationDto.orderId, {
      status: createOrderValidationDto.status,
    });

    return this.formatOrderValidationResponse(savedValidation);
  }

  async findAll(filters?: {
    orderId?: number;
    validatedById?: number;
  }): Promise<OrderValidationResponseDto[]> {
    const query = this.orderValidationRepository
      .createQueryBuilder('orderValidation')
      .leftJoinAndSelect('orderValidation.order', 'order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('orderValidation.validatedBy', 'validatedBy');

    if (filters?.orderId) {
      query.andWhere('orderValidation.orderId = :orderId', { orderId: filters.orderId });
    }
    if (filters?.validatedById) {
      query.andWhere('orderValidation.validatedById = :validatedById', { validatedById: filters.validatedById });
    }

    const orderValidations = await query.getMany();
    return orderValidations.map(validation => this.formatOrderValidationResponse(validation));
  }

  async findOne(id: number): Promise<OrderValidationResponseDto> {
    const orderValidation = await this.orderValidationRepository.findOne({
      where: { id },
      relations: ['order', 'order.client', 'validatedBy'],
    });

    if (!orderValidation) {
      throw new NotFoundException(`Order validation with ID ${id} not found`);
    }

    return this.formatOrderValidationResponse(orderValidation);
  }

  async findByOrderId(orderId: number): Promise<OrderValidationResponseDto[]> {
    return this.findAll({ orderId });
  }

  async update(id: number, updateOrderValidationDto: UpdateOrderValidationDto): Promise<OrderValidationResponseDto> {
    // Las validaciones son inmutables una vez creadas
    throw new BadRequestException('Order validations cannot be updated once created');
  }

  async remove(id: number): Promise<void> {
    // Las validaciones no se pueden eliminar
    throw new BadRequestException('Order validations cannot be deleted');
  }

  async validateOrder(orderId: number, validatedById: number, status: OrderStatus, notes?: string): Promise<OrderValidationResponseDto> {
    const createDto: CreateOrderValidationDto = {
      orderId,
      validatedById,
      status,
      notes,
    };

    return this.create(createDto);
  }

  private formatOrderValidationResponse(orderValidation: OrderValidation): OrderValidationResponseDto {
    return {
      id: orderValidation.id,
      orderId: orderValidation.orderId,
      validatedById: orderValidation.validatedById,
      validatedAt: orderValidation.validatedAt,
      notes: orderValidation.notes,
      order: orderValidation.order ? {
        id: orderValidation.order.id,
        clientId: orderValidation.order.clientId,
        status: orderValidation.order.status,
        totalAmount: orderValidation.order.totalAmount,
        client: orderValidation.order.client ? {
          id: orderValidation.order.client.id,
          name: orderValidation.order.client.name,
          email: orderValidation.order.client.email,
        } : undefined,
      } : undefined,
      validatedBy: orderValidation.validatedBy ? {
        id: orderValidation.validatedBy.id,
        name: orderValidation.validatedBy.name,
        email: orderValidation.validatedBy.email,
      } : undefined,
    };
  }
}
