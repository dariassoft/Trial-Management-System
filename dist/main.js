"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./auth/guards/roles.guard");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        // --- Configuración de CORS ---
        // En desarrollo: permite todos los orígenes
        // En producción: configurar FRONTEND_URLS en .env
        const configuredOrigins = ((_a = process.env.FRONTEND_URLS) === null || _a === void 0 ? void 0 : _a.split(',').map((origin) => origin.trim()).filter(Boolean)) || [];
        const localOrigins = [
            'http://localhost:3001',
            'http://127.0.0.1:3001',
        ];
        const productionOrigins = [
            'https://agronomic-tms.dariassoft.com.ar',
            'https://www.agronomic-tms.dariassoft.com.ar',
        ];
        const allowedOrigins = [
            ...new Set([...configuredOrigins, ...localOrigins, ...productionOrigins]),
        ];
        const corsOptions = {
            origin: (origin, callback) => {
                const isDev = process.env.NODE_ENV !== 'production';
                // En desarrollo, permitir todos
                if (isDev) {
                    callback(null, true);
                }
                else if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    console.warn(`CORS blocked origin: ${origin}`);
                    callback(new Error('Not allowed by CORS policy'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            optionsSuccessStatus: 200,
        };
        app.enableCors(corsOptions);
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        // Guards globales (JWT + Roles)
        const reflector = app.get(core_1.Reflector);
        app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector), new roles_guard_1.RolesGuard(reflector));
        // --- Inicio de Configuración de Swagger ---
        const config = new swagger_1.DocumentBuilder()
            .setTitle('API de Ensayos Agronómicos')
            .setDescription('Documentación de la API para el sistema de gestión de ensayos')
            .setVersion('1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        // La ruta donde se servirá la documentación (ej. http://localhost:3000/docs)
        swagger_1.SwaggerModule.setup('docs', app, document);
        // --- Fin de Configuración de Swagger ---
        yield app.listen(3000);
        console.log(`Application is running on: ${yield app.getUrl()}`);
        console.log(`Swagger docs available at: ${yield app.getUrl()}/docs`);
    });
}
bootstrap();
