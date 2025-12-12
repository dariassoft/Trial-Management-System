import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Configuración de CORS ---
  // En desarrollo: permite todos los orígenes
  // En producción: configurar FRONTEND_URLS en .env
  const corsOptions = {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      const isDev = process.env.NODE_ENV !== 'production';
      const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || [];

      // En desarrollo, permitir todos
      if (isDev) {
        callback(null, true);
      } else if (!origin || allowedOrigins.some(allowed => origin.includes(allowed.trim()))) {
        callback(null, true);
      } else {
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Guards globales (JWT + Roles)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // --- Inicio de Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API de Ensayos Agronómicos')
    .setDescription('Documentación de la API para el sistema de gestión de ensayos')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // La ruta donde se servirá la documentación (ej. http://localhost:3000/docs)
  SwaggerModule.setup('docs', app, document);
  // --- Fin de Configuración de Swagger ---

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/docs`);
}
bootstrap();
