import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { OrdersLinksService } from './orders-links.service';
import { CreateOrderLinkDto } from './dto/create-order-link-dto';
import { UpdateOrderLinkDto } from './dto/update-order-link-dto';
import { OrderLinkResponseDto } from './dto/order-link-response-dto';

@Controller('order-links')
export class OrdersLinksController {
  constructor(private readonly ordersLinksService: OrdersLinksService) {}

  @Post()
  create(@Body() createOrderLinkDto: CreateOrderLinkDto): Promise<OrderLinkResponseDto> {
    return this.ordersLinksService.create(createOrderLinkDto);
  }

  @Get()
  findAll(
    @Query('orderId') orderId?: string,
    @Query('createdById') createdById?: string,
    @Query('isActive') isActive?: string,
  ): Promise<OrderLinkResponseDto[]> {
    const filters: any = {};
    if (orderId) filters.orderId = parseInt(orderId);
    if (createdById) filters.createdById = parseInt(createdById);
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return this.ordersLinksService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderLinkResponseDto> {
    return this.ordersLinksService.findOne(id);
  }

  @Get('token/:token')
  findByToken(@Param('token') token: string): Promise<OrderLinkResponseDto> {
    return this.ordersLinksService.findByToken(token);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderLinkDto: UpdateOrderLinkDto,
  ): Promise<OrderLinkResponseDto> {
    return this.ordersLinksService.update(id, updateOrderLinkDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number): Promise<OrderLinkResponseDto> {
    return this.ordersLinksService.deactivate(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersLinksService.remove(id);
  }

  @Get('validate/:token')
  validateToken(@Param('token') token: string): Promise<{ valid: boolean }> {
    return this.ordersLinksService.validateToken(token).then(valid => ({ valid }));
  }
}
