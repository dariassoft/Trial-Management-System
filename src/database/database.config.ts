
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

// Carga síncrona de variables de entorno para la CLI
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Solo carga .env si el entorno no es Docker
if (process.env.DOCKERIZED !== 'true') {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (e) {
    console.warn('.env file not found, skipping...');
  }
}

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'nest_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // No usar en producción
  migrationsRun: true,
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return config;
  },
};

export default config;
