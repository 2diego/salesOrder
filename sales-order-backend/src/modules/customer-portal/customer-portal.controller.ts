import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../../auth/public.decorator';
import { CustomerPortalService } from './customer-portal.service';
import { CreateOrderItemDto } from '../orders-items/dto/create-order-item-dto';
import { UpdateOrderItemDto } from '../orders-items/dto/update-order-item-dto';
import { OrderStatus } from '../../entities/order.entity';

@SkipThrottle()
@Controller('customer-portal')
export class CustomerPortalController {
  constructor(private readonly customerPortalService: CustomerPortalService) {}

  @Public()
  @Get('orders')
  listOrders(
    @Query('clientId', ParseIntPipe) clientId: number,
    @Query('linkToken') linkToken: string,
  ) {
    return this.customerPortalService.listOrders(clientId, linkToken);
  }

  @Public()
  @Get('orders/:id')
  getOrder(
    @Param('id', ParseIntPipe) id: number,
    @Query('linkToken') linkToken: string,
  ) {
    return this.customerPortalService.getOrder(id, linkToken);
  }

  @Public()
  @Patch('orders/:id/status')
  patchOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('linkToken') linkToken: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.customerPortalService.updateOrderStatus(id, status, linkToken);
  }

  @Public()
  @Get('clients/:id')
  getClient(
    @Param('id', ParseIntPipe) id: number,
    @Query('linkToken') linkToken: string,
  ) {
    return this.customerPortalService.getClient(id, linkToken);
  }

  @Public()
  @Get('order-items')
  listItems(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Query('linkToken') linkToken: string,
  ) {
    return this.customerPortalService.listOrderItems(orderId, linkToken);
  }

  @Public()
  @Post('order-items')
  createItem(
    @Query('linkToken') linkToken: string,
    @Body() dto: CreateOrderItemDto,
  ) {
    return this.customerPortalService.createOrderItem(dto, linkToken);
  }

  @Public()
  @Patch('order-items/:id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Query('linkToken') linkToken: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.customerPortalService.updateOrderItem(id, dto, linkToken);
  }

  @Public()
  @Delete('order-items/:id')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Query('linkToken') linkToken: string,
  ) {
    return this.customerPortalService.removeOrderItem(id, linkToken);
  }
}
