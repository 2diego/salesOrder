import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { OrdersValidationsService } from './orders-validations.service';
import { CreateOrderValidationDto } from './dto/create-order-validation-dto';
import { UpdateOrderValidationDto } from './dto/update-order-validation-dto';
import { OrderValidationResponseDto } from './dto/order-validation-response-dto';
import { OrderStatus } from '../../entities/order.entity';

@Controller('order-validations')
export class OrdersValidationsController {
  constructor(private readonly ordersValidationsService: OrdersValidationsService) {}

  @Post()
  create(@Body() createOrderValidationDto: CreateOrderValidationDto): Promise<OrderValidationResponseDto> {
    return this.ordersValidationsService.create(createOrderValidationDto);
  }

  @Get()
  findAll(
    @Query('orderId') orderId?: string,
    @Query('validatedById') validatedById?: string,
  ): Promise<OrderValidationResponseDto[]> {
    const filters: any = {};
    if (orderId) filters.orderId = parseInt(orderId);
    if (validatedById) filters.validatedById = parseInt(validatedById);

    return this.ordersValidationsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderValidationResponseDto> {
    return this.ordersValidationsService.findOne(id);
  }

  @Get('order/:orderId')
  findByOrderId(@Param('orderId', ParseIntPipe) orderId: number): Promise<OrderValidationResponseDto[]> {
    return this.ordersValidationsService.findByOrderId(orderId);
  }

  @Post('validate')
  validateOrder(
    @Body('orderId', ParseIntPipe) orderId: number,
    @Body('validatedById', ParseIntPipe) validatedById: number,
    @Body('status') status: OrderStatus,
    @Body('notes') notes?: string,
  ): Promise<OrderValidationResponseDto> {
    return this.ordersValidationsService.validateOrder(orderId, validatedById, status, notes);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderValidationDto: UpdateOrderValidationDto,
  ): Promise<OrderValidationResponseDto> {
    return this.ordersValidationsService.update(id, updateOrderValidationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersValidationsService.remove(id);
  }
}
