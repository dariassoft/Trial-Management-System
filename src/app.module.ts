// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnsayosModule } from './ensayos/ensayos.module';
import { LaboratoriosModule } from './laboratorios/laboratorios.module';
import { ProductosModule } from './productos/productos.module';
import { TratamientosModule } from './tratamientos/tratamientos.module';
import { BloquesModule } from './bloques/bloques.module';
import { ParcelasModule } from './parcelas/parcelas.module';
import { AplicacionesModule } from './aplicaciones/aplicaciones.module';
import { MomentosModule } from './momentos/momentos.module';
import { DatosCampoModule } from './datos-campo/datos-campo.module';
import { DatosCosechaModule } from './datos-cosecha/datos-cosecha.module';
import { DatosSiembraModule } from './datos-siembra/datos-siembra.module';
import { TratamientosProductoModule } from './tratamientos-producto/tratamientos-producto.module';
import { ProtocoloVariablesModule } from './protocolo-variables/protocolo-variables.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FotosModule } from './fotos/fotos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CultivosModule } from './catalogos/cultivos/cultivos.module';
import { CultivoVariedadesModule } from './catalogos/cultivo-variedades/cultivo-variedades.module';
import { TiposEnsayoModule } from './catalogos/tipos-ensayo/tipos-ensayo.module';
import { LocationsModule } from './locations/locations.module';
import { TiposSiembraModule } from './catalogos/tipos-siembra/tipos-siembra.module';
import { ProtocolosModule } from './protocolos/protocolos.module'; // Importar ProtocolosModule
import { StatusEnsayoModule } from './status-ensayo/status-ensayo.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { ReportesModule } from './reportes/reportes.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { TareasProgramadasModule } from './tareas-programadas/tareas-programadas.module';
import { AsistenteFlujoModule } from './asistente-flujo/asistente-flujo.module';

const ormModules = (process.env.GENERATE_OPENAPI === 'true')
  ? []
  : [TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        connectorPackage: 'mysql2',
        host: config.get('DB_HOST', 'mysql'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get('DB_USER', 'myuser'),
        password: config.get('DB_PASSWORD', 'mypassword'),
        database: config.get('DB_NAME', 'nest_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to your TypeORM entities
        synchronize: false, // Desactivado para producción y control manual
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: true, // Ejecutar migraciones automáticamente
      }),
    })];

@Module({
  imports: [
    // 1. Módulo de Configuración para leer .env
    ConfigModule.forRoot({
      isGlobal: true, // Hace que .env esté disponible en toda la app
      envFilePath: '.env',
      // Si corremos en Docker, honramos las variables de entorno del contenedor y NO cargamos .env
      ignoreEnvFile: process.env.DOCKERIZED === 'true',
    }),

    // 2. Módulo de TypeORM (opcional durante generación de OpenAPI)
    ...ormModules,

    // Servir archivos estáticos (fotos y videos)
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(process.cwd(), 'uploads'),
    }),

    EnsayosModule,
    LaboratoriosModule,
    ProductosModule,
    TratamientosModule,
    BloquesModule,
    ParcelasModule,
    AplicacionesModule,
    MomentosModule,
    DatosCampoModule,
    DatosCosechaModule,
    DatosSiembraModule,
    TratamientosProductoModule,
    ProtocoloVariablesModule,
    AuthModule,
    UsersModule,
    CultivosModule,
    CultivoVariedadesModule,
    TiposEnsayoModule,
    LocationsModule,
    TiposSiembraModule,
    ProtocolosModule, // Añadido
    StatusEnsayoModule, // Nuevo
    RolesModule, // Nuevo - ABM de Roles
    PermisosModule, // Nuevo - ABM de Permisos
    ReportesModule, // Nuevo - Generación de reportes
    FotosModule, // Para subir/servir fotos y videos
    NotificacionesModule, // Notificaciones para usuarios
    TareasProgramadasModule, // Cron jobs para generar notificaciones
    AsistenteFlujoModule, // Asistente de flujo de trabajo para ensayos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
