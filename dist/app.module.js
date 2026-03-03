"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// src/app.module.ts
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const ensayos_module_1 = require("./ensayos/ensayos.module");
const laboratorios_module_1 = require("./laboratorios/laboratorios.module");
const productos_module_1 = require("./productos/productos.module");
const tratamientos_module_1 = require("./tratamientos/tratamientos.module");
const bloques_module_1 = require("./bloques/bloques.module");
const parcelas_module_1 = require("./parcelas/parcelas.module");
const aplicaciones_module_1 = require("./aplicaciones/aplicaciones.module");
const momentos_module_1 = require("./momentos/momentos.module");
const datos_campo_module_1 = require("./datos-campo/datos-campo.module");
const datos_cosecha_module_1 = require("./datos-cosecha/datos-cosecha.module");
const datos_siembra_module_1 = require("./datos-siembra/datos-siembra.module");
const tratamientos_producto_module_1 = require("./tratamientos-producto/tratamientos-producto.module");
const protocolo_variables_module_1 = require("./protocolo-variables/protocolo-variables.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const fotos_module_1 = require("./fotos/fotos.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const cultivos_module_1 = require("./catalogos/cultivos/cultivos.module");
const cultivo_variedades_module_1 = require("./catalogos/cultivo-variedades/cultivo-variedades.module");
const tipos_ensayo_module_1 = require("./catalogos/tipos-ensayo/tipos-ensayo.module");
const locations_module_1 = require("./locations/locations.module");
const tipos_siembra_module_1 = require("./catalogos/tipos-siembra/tipos-siembra.module");
const protocolos_module_1 = require("./protocolos/protocolos.module"); // Importar ProtocolosModule
const status_ensayo_module_1 = require("./status-ensayo/status-ensayo.module");
const roles_module_1 = require("./roles/roles.module");
const permisos_module_1 = require("./permisos/permisos.module");
const reportes_module_1 = require("./reportes/reportes.module");
const ormModules = (process.env.GENERATE_OPENAPI === 'true')
    ? []
    : [typeorm_1.TypeOrmModule.forRootAsync({
            imports: [config_1.ConfigModule],
            inject: [config_1.ConfigService],
            useFactory: (config) => ({
                type: 'mysql',
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // 1. Módulo de Configuración para leer .env
            config_1.ConfigModule.forRoot({
                isGlobal: true, // Hace que .env esté disponible en toda la app
                envFilePath: '.env',
                // Si corremos en Docker, honramos las variables de entorno del contenedor y NO cargamos .env
                ignoreEnvFile: process.env.DOCKERIZED === 'true',
            }),
            // 2. Módulo de TypeORM (opcional durante generación de OpenAPI)
            ...ormModules,
            // Servir archivos estáticos (fotos y videos)
            serve_static_1.ServeStaticModule.forRoot({
                serveRoot: '/uploads',
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
            }),
            ensayos_module_1.EnsayosModule,
            laboratorios_module_1.LaboratoriosModule,
            productos_module_1.ProductosModule,
            tratamientos_module_1.TratamientosModule,
            bloques_module_1.BloquesModule,
            parcelas_module_1.ParcelasModule,
            aplicaciones_module_1.AplicacionesModule,
            momentos_module_1.MomentosModule,
            datos_campo_module_1.DatosCampoModule,
            datos_cosecha_module_1.DatosCosechaModule,
            datos_siembra_module_1.DatosSiembraModule,
            tratamientos_producto_module_1.TratamientosProductoModule,
            protocolo_variables_module_1.ProtocoloVariablesModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            cultivos_module_1.CultivosModule,
            cultivo_variedades_module_1.CultivoVariedadesModule,
            tipos_ensayo_module_1.TiposEnsayoModule,
            locations_module_1.LocationsModule,
            tipos_siembra_module_1.TiposSiembraModule,
            protocolos_module_1.ProtocolosModule, // Añadido
            status_ensayo_module_1.StatusEnsayoModule, // Nuevo
            roles_module_1.RolesModule, // Nuevo - ABM de Roles
            permisos_module_1.PermisosModule, // Nuevo - ABM de Permisos
            reportes_module_1.ReportesModule, // Nuevo - Generación de reportes
            fotos_module_1.FotosModule, // Para subir/servir fotos y videos
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
