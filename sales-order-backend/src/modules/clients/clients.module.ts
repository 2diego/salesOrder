import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from 'src/entities/client.entity';
import { Order } from 'src/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Order])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService], // Exportar para usar en otros módulos
})
export class ClientsModule {}
