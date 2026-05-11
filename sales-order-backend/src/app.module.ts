import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { entities } from './entities/entities-list';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ClientsModule } from './modules/clients/clients.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrdersItemsModule } from './modules/orders-items/orders-items.module';
import { OrdersLinksModule } from './modules/orders-links/orders-links.module';
import { OrdersValidationsModule } from './modules/orders-validations/orders-validations.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CustomerPortalModule } from './modules/customer-portal/customer-portal.module';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFilePath =
  nodeEnv === 'production'
    ? ['.env.production']
    : ['.env.development'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 200 }],
    }),
    TypeOrmModule.forRoot({
      ...getDatabaseConfig(),
      entities,
    }),
    AuthModule,
    CustomerPortalModule,
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
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
