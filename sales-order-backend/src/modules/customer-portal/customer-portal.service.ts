import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersLinksService } from '../orders-links/orders-links.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersItemsService } from '../orders-items/orders-items.service';
import { ClientsService } from '../clients/clients.service';
import { CreateOrderItemDto } from '../orders-items/dto/create-order-item-dto';
import { UpdateOrderItemDto } from '../orders-items/dto/update-order-item-dto';
import { OrderResponseDto } from '../orders/dto/order-response-dto';
import { OrderItemResponseDto } from '../orders-items/dto/order-item-response-dto';
import { Client } from '../../entities/client.entity';
import { OrderStatus } from '../../entities/order.entity';

@Injectable()
export class CustomerPortalService {
  constructor(
    private readonly ordersLinksService: OrdersLinksService,
    private readonly ordersService: OrdersService,
    private readonly ordersItemsService: OrdersItemsService,
    private readonly clientsService: ClientsService,
  ) {}

  private requireLinkToken(linkToken?: string): string {
    const t = linkToken?.trim();
    if (!t) {
      throw new UnauthorizedException('linkToken es obligatorio');
    }
    return t;
  }

  /** El token debe pertenecer a un pedido del cliente indicado. */
  async assertLinkBelongsToClient(linkToken: string, clientId: number): Promise<void> {
    const link = await this.ordersLinksService.findByToken(linkToken);
    const tokenClientId = link.order?.clientId;
    if (tokenClientId !== clientId) {
      throw new ForbiddenException('El enlace no corresponde a este cliente');
    }
  }

  /** El cliente del pedido debe coincidir con el cliente autorizado por el token. */
  async assertLinkCanAccessOrder(linkToken: string, orderId: number): Promise<void> {
    const link = await this.ordersLinksService.findByToken(linkToken);
    const orderView = await this.ordersService.findOne(orderId);
    const tokenClientId = link.order?.clientId;
    if (tokenClientId !== orderView.clientId) {
      throw new ForbiddenException('No puede acceder a este pedido');
    }
  }

  async listOrders(clientId: number, linkToken?: string): Promise<OrderResponseDto[]> {
    const token = this.requireLinkToken(linkToken);
    await this.assertLinkBelongsToClient(token, clientId);
    return this.ordersService.findAll({ clientId });
  }

  async getOrder(orderId: number, linkToken?: string): Promise<OrderResponseDto> {
    const token = this.requireLinkToken(linkToken);
    await this.assertLinkCanAccessOrder(token, orderId);
    return this.ordersService.findOne(orderId);
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    linkToken?: string,
  ): Promise<OrderResponseDto> {
    const token = this.requireLinkToken(linkToken);
    await this.assertLinkCanAccessOrder(token, orderId);
    return this.ordersService.updateStatus(orderId, status);
  }

  async getClient(clientId: number, linkToken?: string): Promise<Client> {
    const token = this.requireLinkToken(linkToken);
    await this.assertLinkBelongsToClient(token, clientId);
    return this.clientsService.findOne(clientId);
  }

  async listOrderItems(orderId: number, linkToken?: string): Promise<OrderItemResponseDto[]> {
    const token = this.requireLinkToken(linkToken);
    await this.assertLinkCanAccessOrder(token, orderId);
    return this.ordersItemsService.findAll({ orderId });
  }

  async createOrderItem(
    dto: CreateOrderItemDto,
    linkToken?: string,
  ): Promise<OrderItemResponseDto> {
    const token = this.requireLinkToken(linkToken);
    await this.assertLinkCanAccessOrder(token, dto.orderId);
    return this.ordersItemsService.create(dto);
  }

  async updateOrderItem(
    id: number,
    dto: UpdateOrderItemDto,
    linkToken?: string,
  ): Promise<OrderItemResponseDto> {
    const token = this.requireLinkToken(linkToken);
    const existing = await this.ordersItemsService.findOne(id);
    await this.assertLinkCanAccessOrder(token, existing.orderId);
    return this.ordersItemsService.update(id, dto);
  }

  async removeOrderItem(id: number, linkToken?: string): Promise<void> {
    const token = this.requireLinkToken(linkToken);
    const existing = await this.ordersItemsService.findOne(id);
    await this.assertLinkCanAccessOrder(token, existing.orderId);
    return this.ordersItemsService.remove(id);
  }
}
