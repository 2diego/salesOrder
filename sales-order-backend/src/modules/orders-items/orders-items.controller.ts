import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersItemsService } from './orders-items.service';
import { CreateOrderItemDto } from './dto/create-order-item-dto';
import { UpdateOrderItemDto } from './dto/update-order-item-dto';
import { OrderItemResponseDto } from './dto/order-item-response-dto';

@Controller('order-items')
export class OrdersItemsController {
  constructor(private readonly ordersItemsService: OrdersItemsService) {}

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    return this.ordersItemsService.create(createOrderItemDto);
  }

  @Get()
  findAll(
    @Query('orderId') orderId?: string,
    @Query('productId') productId?: string,
  ): Promise<OrderItemResponseDto[]> {
    const filters: { orderId?: number; productId?: number } = {};
    if (orderId) filters.orderId = parseInt(orderId, 10);
    if (productId) filters.productId = parseInt(productId, 10);

    return this.ordersItemsService.findAll(filters);
  }

  @Get('order/:orderId')
  findByOrderId(@Param('orderId', ParseIntPipe) orderId: number): Promise<OrderItemResponseDto[]> {
    return this.ordersItemsService.findByOrderId(orderId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderItemResponseDto> {
    return this.ordersItemsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    return this.ordersItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersItemsService.remove(id);
  }
}
