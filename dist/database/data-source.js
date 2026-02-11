"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
// Cargar variables de entorno desde el archivo .env
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'mysql',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'myuser',
    password: process.env.DB_PASSWORD || 'mypassword',
    database: process.env.DB_NAME || 'nest_db',
    synchronize: false, // Nunca usar synchronize en producción
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Ruta a tus entidades
    migrations: [__dirname + '/../migrations/*{.ts,.js}'], // Ruta a tus migraciones
    migrationsTableName: 'migrations', // Nombre de la tabla de migraciones
});
