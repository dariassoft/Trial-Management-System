### 2) Catálogos dinámicos: Cultivos y Variedades (CRUD + entidades centralizadas)

Objetivo
- Desacoplar valores fijos de `Ensayo` (p. ej., `cultivo_especie`) hacia catálogos administrables.

Decisiones
- Entidades centralizadas en `src/entities/`:
  - `Cultivo` (tabla `Cultivo`): `cultivo_id`, `nombre` (único), relación `OneToMany` con `CultivoVariedad`.
  - `CultivoVariedad` (tabla `Cultivo_Variedad`): `variedad_id`, `nombre`, FK `cultivo_id_fk` con `ON DELETE CASCADE`.
- Recursos NestJS en `src/catalogos/`:
  - `cultivos`: módulo, servicio, controlador, DTOs.
  - `cultivo-variedades`: módulo, servicio, controlador, DTOs.
- Seguridad y documentación:
  - Decorador `@Roles` para RBAC; `@ApiTags`, `@ApiBearerAuth`, DTOs con `class-validator` + Swagger.

Endpoints clave
- `POST /api/v1/catalogos/cultivos` crear cultivo
- `GET /api/v1/catalogos/cultivos` listar cultivos
- `GET /api/v1/catalogos/cultivos/:id/variedades` listar variedades por cultivo
- `POST /api/v1/catalogos/cultivo-variedades` crear variedad (requiere `cultivo_id`)

Notas técnicas
- TypeORM mapea exactamente a los nombres de tablas/columnas provistos.
- Índice único sugerido en la DB: `UNIQUE(cultivo_id_fk, nombre)` para `Cultivo_Variedad` (existe en SQL de creación del usuario).

Verificación rápida
- `npx tsc --noEmit -p tsconfig.build.json`
- Levantar `npm run start:dev` y validar Swagger `/docs`.
