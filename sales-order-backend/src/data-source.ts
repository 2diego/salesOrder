import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { entities } from './entities/entities-list';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFileName =
  nodeEnv === 'production' ? '.env.production' : '.env.development';

config({ path: join(__dirname, '..', envFileName) });

const driver = (process.env.DB_TYPE ?? 'postgres').toLowerCase();

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

const isPostgres = driver !== 'mysql';
const useSsl = parseBoolean(process.env.DB_SSL, isPostgres);
const rejectUnauthorized = parseBoolean(
  process.env.DB_SSL_REJECT_UNAUTHORIZED,
  false,
);

export default new DataSource({
  type: isPostgres ? 'postgres' : 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parsePort(process.env.DB_PORT, isPostgres ? 5432 : 3306),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'sales_order',
  entities,
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  ...(isPostgres
    ? useSsl
      ? {
          ssl: {
            rejectUnauthorized,
          },
        }
      : {}
    : { charset: 'utf8mb4', timezone: process.env.DB_TIMEZONE ?? 'Z' }),
});
