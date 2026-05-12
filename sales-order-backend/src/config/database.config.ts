import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type DbDriver = 'postgres' | 'mysql';

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
};

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const driver = (process.env.DB_TYPE ?? 'postgres').toLowerCase() as DbDriver;
  const host = process.env.DB_HOST ?? 'localhost';
  const username = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASSWORD ?? '';
  const database = process.env.DB_NAME ?? 'sales_order';
  const synchronizeEnv = process.env.DB_SYNCHRONIZE === 'true';
  const logging = process.env.DB_LOGGING === 'true';
  const useSsl = parseBoolean(process.env.DB_SSL, driver === 'postgres');
  const rejectUnauthorized = parseBoolean(
    process.env.DB_SSL_REJECT_UNAUTHORIZED,
    false,
  );
  const sslConfig = useSsl
    ? {
        ssl: {
          rejectUnauthorized,
        },
      }
    : {};
  const migrations =
    driver === 'postgres'
      ? [join(__dirname, '..', 'migrations', '*{.ts,.js}')]
      : [];
  const migrationsRun =
    driver === 'postgres' && process.env.DB_MIGRATIONS_RUN === 'true';

  if (driver === 'mysql') {
    return {
      type: 'mysql',
      host,
      port: parsePort(process.env.DB_PORT, 3306),
      username,
      password,
      database,
      synchronize: synchronizeEnv,
      logging,
      migrations,
      migrationsRun,
      charset: 'utf8mb4',
      timezone: process.env.DB_TIMEZONE ?? 'Z',
    };
  }

  return {
    type: 'postgres',
    host,
    port: parsePort(process.env.DB_PORT, 5432),
    username,
    password,
    database,
    synchronize: synchronizeEnv,
    logging,
    migrations,
    migrationsRun,
    ...sslConfig,
  };
}
