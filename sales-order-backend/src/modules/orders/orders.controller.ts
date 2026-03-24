import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { OrderResponseDto } from './dto/order-response-dto';
import { OrderStatus } from '../../entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('clientId') clientId?: string,
    @Query('createdById') createdById?: string,
    @Query('status') status?: OrderStatus,
  ): Promise<OrderResponseDto[]> {
    const filters: any = {};
    if (clientId) filters.clientId = parseInt(clientId);
    if (createdById) filters.createdById = parseInt(createdById);
    if (status) filters.status = status;

    return this.ordersService.findAll(filters);
  }

  @Get('paged')
  findPaged(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: OrderStatus,
    @Query('q') q?: string,
  ) {
    return this.ordersService.findPaged({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      status,
      q,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderResponseDto> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateStatus(id, status);
  }

  @Post(':id/calculate-total')
  calculateTotalAmount(@Param('id', ParseIntPipe) id: number): Promise<{ totalAmount: number }> {
    return this.ordersService.calculateTotalAmount(id).then(totalAmount => ({ totalAmount }));
  }
}
