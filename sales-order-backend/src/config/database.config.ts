import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Diego35415036',
  database: 'app-pedidos',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Solo en desarrollo, en produccion hay que usar migraciones
  logging: true,
  charset: 'utf8mb4',
  timezone: 'local',
};
