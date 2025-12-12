### 8) Generación de OpenAPI sin base de datos (flujo desconectado)

Objetivo
- Poder generar `docs/openapi.json` y la colección Postman sin requerir conexión a MySQL ni dependencias nativas durante el proceso de documentación.
- Evitar errores por `TYPEORM_SYNCHRONIZE` o por índices/constraints presentes en la base real.

Decisión
- Introducir un flujo de "documentación desconectada" que arranca la app Nest para construir el documento OpenAPI, pero con TypeORM omitido o stubeado, de forma que:
  - No abre conexiones a BD.
  - No intenta sincronizar el esquema.
  - No carga binarios nativos cuando no están disponibles.

Cambios clave (ya aplicados en el repo)
- `scripts/generate-openapi.js`:
  - Fuerza `process.env.GENERATE_OPENAPI = 'true'` para que `AppModule` omita TypeORM.
  - Fuerza `process.env.TYPEORM_SYNCHRONIZE = 'false'` durante la generación de OpenAPI.
  - Stub/mocks ligeros:
    - `bcrypt`: implementa `hash/compare` de forma trivial para evitar binarios.
    - `@nestjs/typeorm`: devuelve un módulo dummy para `forRoot/forRootAsync/forFeature`, y decora `InjectRepository` sin crear `DataSource`.
  - Carga `AppModule` desde `dist` (compilado): `require('../dist/app.module')`.
  - Si no puede bootstrapped la app, reutiliza `docs/openapi.json` existente como fallback y sale con código 0, permitiendo generar Postman.

- `src/app.module.ts` (configuración env-driven)
  - `TypeOrmModule.forRootAsync` se agrega a `imports` solo cuando `process.env.GENERATE_OPENAPI !== 'true'`.
  - Las credenciales de BD y la bandera `synchronize` provienen de `.env`.

- `package.json` (scripts)
  - `openapi:gen` apunta a `node scripts/generate-openapi.js`.
  - `postman:gen` convierte el OpenAPI a Postman con `openapi-to-postmanv2`.
  - `docs:gen` ejecuta en cadena: `npm run openapi:gen && npm run postman:gen`.

Cómo generar documentación sin BD
1) Compilar (si hace falta) y asegurarte de que existe `dist/` con el `AppModule`:
   ```bash
   npm run build
   ```
   Nota: Si hay problemas de permisos en `dist/`, ajustar propietario/permisos y recrear carpeta:
   ```bash
   sudo chown -R "$USER":"$USER" dist
   chmod -R u+rwX dist
   rm -rf dist && npm run build
   ```

2) Ejecutar generación de OpenAPI deshabilitando BD y sincronización:
   ```bash
   GENERATE_OPENAPI=true TYPEORM_SYNCHRONIZE=false npm run openapi:gen
   ```
   Resultado esperado: `docs/openapi.json` actualizado.

3) Generar colección y environment de Postman desde el OpenAPI:
   ```bash
   npm run postman:gen
   ```
   Resultado esperado:
   - `docs/tms-postman.postman_collection.json`
   - `docs/tms-postman.environment.json`

Ejecución todo-en-uno
- Si ya tienes `dist/` correcto, puedes ejecutar:
  ```bash
  GENERATE_OPENAPI=true TYPEORM_SYNCHRONIZE=false npm run docs:gen
  ```

Parámetros de entorno relevantes
- `GENERATE_OPENAPI=true`: AppModule omite por completo TypeORM en tiempo de generación.
- `TYPEORM_SYNCHRONIZE=false`: salvaguarda adicional para que, aún si se cargara TypeORM, no intente reconciliar el esquema.
- `.env` (para ejecución normal con BD):
  ```env
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_USER=myuser
  DB_PASSWORD=mypassword
  DB_NAME=nest_db
  TYPEORM_SYNCHRONIZE=false
  ```

Por qué es necesario
- Con `synchronize: true`, TypeORM intenta modificar el esquema (p. ej. borrar el índice `uq_parcela_ensayo_nombre`), lo cual puede fallar por restricciones. En un flujo de documentación/CI esto no debe ocurrir.
- En entornos de CI/CD no siempre están disponibles los binarios nativos (como `bcrypt`) ni una BD alcanzable; el stub evita esos requisitos.

Limitaciones y buenas prácticas
- El documento OpenAPI refleja las rutas, DTOs y decoradores de los controladores. Si agregas nuevos endpoints, debes:
  1) Actualizar controladores/DTOs con decoradores de Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, etc.).
  2) Recompilar (`npm run build`).
  3) Regenerar OpenAPI/Postman.
- Mantener `TYPEORM_SYNCHRONIZE=false` fuera de desarrollo local rápido. Para entornos no efímeros (staging/production), aplicar cambios de esquema solo con los SQL en `docs/`.

Solución a errores comunes
- "getaddrinfo ENOTFOUND mysql" durante `openapi:gen`:
  - Usa `GENERATE_OPENAPI=true` para omitir TypeORM.
- "Cannot drop index 'uq_parcela_ensayo_nombre'" al arrancar para generar docs:
  - Asegúrate de tener `TYPEORM_SYNCHRONIZE=false` y el flag `GENERATE_OPENAPI=true`.
- "Nest can't resolve dependencies of the EnsayosService (Repository, ?, ?)" durante docs:
  - Es el síntoma de que se está intentando instanciar repositorios reales; el stub de `@nestjs/typeorm` del script resuelve este caso. Re-ejecuta con `GENERATE_OPENAPI=true`.

Validación rápida
```bash
npx tsc --noEmit -p tsconfig.build.json
GENERATE_OPENAPI=true TYPEORM_SYNCHRONIZE=false npm run docs:gen
ls -l docs/openapi.json docs/tms-postman.postman_collection.json docs/tms-postman.environment.json
```

Referencias cruzadas
- 7) Alineación ORM-DB e índice `uq_parcela_ensayo_nombre`: `docs/decisiones/7-fix-parcela-unique-synchronize.md`.
- Scripts usados: `scripts/generate-openapi.js`, `scripts/openapi-to-postman.js`.
