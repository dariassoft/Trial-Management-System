### 1) Decoradores de TypeScript en NestJS y configuración de compilador

Decisión
- Habilitar correctamente los decoradores y su metadata en TypeScript para evitar errores como:
  `Unable to resolve signature of property decorator when called as an expression. Argument of type 'undefined' is not assignable to parameter of type 'Object'.`

Acciones
- En `tsconfig.json`:
  - `"experimentalDecorators": true`
  - `"emitDecoratorMetadata": true`
  - `"useDefineForClassFields": false`
  - `"strictPropertyInitialization": false`
- Asegurar la importación de `reflect-metadata` al inicio de `src/main.ts`.

Verificación
- `npx tsc --noEmit -p tsconfig.build.json` sin errores.

Notas
- Decoradores de TypeORM, class-validator y Swagger requieren metadata activa.
- Evitar pasar símbolos no definidos a decoradores (`@IsEnum`, `@ApiProperty({ enum: ... })`, relaciones en TypeORM, etc.).
