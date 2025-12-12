require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    // Fuerza a deshabilitar sincronización de esquema durante la generación de OpenAPI
    process.env.TYPEORM_SYNCHRONIZE = process.env.TYPEORM_SYNCHRONIZE ?? 'false';
    process.env.GENERATE_OPENAPI = 'true';

    // Mock de 'bcrypt' para evitar cargas nativas en entornos donde no están disponibles
    const Module = require('module');
    const originalRequire = Module.prototype.require;
    Module.prototype.require = function (request) {
      if (request === 'bcrypt') {
        return {
          hash: async (plain) => `mockhash:${plain}`,
          compare: async () => true,
        };
      }
      if (request === '@nestjs/typeorm') {
        // Stub minimal para evitar requerir DataSource durante la generación de OpenAPI
        class Dummy {}
        const dummyModule = {
          module: Dummy,
          providers: [],
          exports: [],
          imports: [],
        };
        return {
          TypeOrmModule: {
            forRoot: () => dummyModule,
            forRootAsync: () => dummyModule,
            forFeature: () => dummyModule,
          },
          InjectRepository: () => () => (target, key, index) => {},
          getRepositoryToken: () => 'RepoToken',
        };
      }
      return originalRequire.apply(this, arguments);
    };

    // Cargamos el AppModule compilado desde dist (resultado de nest build)
    const { AppModule } = require('../dist/app.module');

    const app = await NestFactory.create(AppModule);

    // Mantener el mismo prefijo global que en main.ts
    app.setGlobalPrefix('api/v1');

    // Configurar el documento Swagger similar a main.ts
    const config = new DocumentBuilder()
      .setTitle('API de Ensayos Agronómicos')
      .setDescription('Documentación de la API para el sistema de gestión de ensayos')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Añadir servidores para facilitar importación externa
    document.servers = [
      { url: 'http://localhost:3000', description: 'Local' },
    ];

    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

    const outPath = path.join(docsDir, 'openapi.json');
    fs.writeFileSync(outPath, JSON.stringify(document, null, 2));

    await app.close();
    console.log(`[openapi:gen] OpenAPI escrito en ${outPath}`);
  } catch (err) {
    const path = require('path');
    const fs = require('fs');
    const fallback = path.join(process.cwd(), 'docs', 'openapi.json');
    if (fs.existsSync(fallback)) {
      console.warn('[openapi:gen] No se pudo generar OpenAPI desde la app, se reutiliza docs/openapi.json existente. Motivo:', err?.message || err);
      process.exit(0);
    }
    console.error('[openapi:gen] Error generando OpenAPI (sin fallback disponible):', err);
    process.exit(1);
  }
})();
