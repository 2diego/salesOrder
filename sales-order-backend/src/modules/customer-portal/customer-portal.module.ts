import { Module } from '@nestjs/common';
import { OrdersLinksModule } from '../orders-links/orders-links.module';
import { OrdersModule } from '../orders/orders.module';
import { OrdersItemsModule } from '../orders-items/orders-items.module';
import { ClientsModule } from '../clients/clients.module';
import { CustomerPortalController } from './customer-portal.controller';
import { CustomerPortalService } from './customer-portal.service';

@Module({
  imports: [OrdersLinksModule, OrdersModule, OrdersItemsModule, ClientsModule],
  controllers: [CustomerPortalController],
  providers: [CustomerPortalService],
})
export class CustomerPortalModule {}
