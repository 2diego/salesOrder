import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { entities } from './entities/entities-list';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ClientsModule } from './modules/clients/clients.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrdersItemsModule } from './modules/orders-items/orders-items.module';
import { OrdersLinksModule } from './modules/orders-links/orders-links.module';
import { OrdersValidationsModule } from './modules/orders-validations/orders-validations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: entities,
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ClientsModule,
    OrdersModule,
    OrdersItemsModule,
    OrdersLinksModule,
    OrdersValidationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
