import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno desde el archivo .env
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  connectorPackage: 'mysql2',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'nest_db',
  synchronize: false, // Nunca usar synchronize en producción
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Ruta a tus entidades
  migrations: [__dirname + '/../migrations/*{.ts,.js}'], // Ruta a tus migraciones
  migrationsTableName: 'migrations', // Nombre de la tabla de migraciones
});
