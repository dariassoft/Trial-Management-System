# AGENTS.md — TMS Backend (Trial Management System)

## Architecture

NestJS 10 monorepo with a **Nuxt 3 SPA frontend** embedded at `tms-client-vue/`. Backend is a REST API (MySQL 8 + TypeORM 0.3) for managing agronomic field trials (ensayos). All routes are prefixed with `api/v1` (set in `src/main.ts`).

**Domain model hierarchy:** Laboratorio → Ensayo → (Bloques, Parcelas, Tratamientos) → DatosCampo/DatosCosecha/DatosSiembra. Ensayo is the central entity that ties together location, protocol, crop variety, and field measurements.

**Key data flow:** Field measurements go through `DatosCampo` → `DatosCampoMedicion` (per-variable values keyed by `ProtocoloVariable`). Reports (`src/reportes/`) aggregate this data into PDF (pdfkit) and Excel (exceljs) exports.

## Development

```bash
docker compose up          # Starts backend (:3000), MySQL (:3306), and Vue client (:3001)
npm run start:dev          # Local dev without Docker (needs .env with DB_HOST=localhost)
npm run migration:run      # Run TypeORM migrations
npm test                   # Jest unit tests (*.spec.ts)
npm run test:e2e           # E2E tests (test/jest-e2e.json)
```

Swagger docs auto-generated at `/docs`. Setting `GENERATE_OPENAPI=true` skips DB connection for offline OpenAPI generation (see `src/app.module.ts` conditional `ormModules`).

## Module Pattern

Every domain follows the same structure — use `src/ensayos/` as the canonical example:
- `ensayos.module.ts` — imports entity repos via `TypeOrmModule.forFeature([...])`
- `ensayos.controller.ts` — decorated with `@ApiTags`, `@ApiBearerAuth`, Swagger decorators on every endpoint
- `ensayos.service.ts` — `@Injectable({ scope: Scope.REQUEST })`, injects `REQUEST` to access JWT user for row-level filtering
- `dto/create-ensayo.dto.ts` — uses `class-validator` + `@ApiProperty`/`@ApiPropertyOptional` decorators

**When creating a new module:** register it in `src/app.module.ts` imports array, place entities in `src/entities/`, and DTOs in `<module>/dto/`.

## Auth & Authorization

- **All routes are JWT-protected by default** via global `JwtAuthGuard` + `RolesGuard` in `main.ts`.
- Use `@Public()` decorator (`src/auth/decorators/public.decorator.ts`) to make a route public.
- Use `@Roles(Role.TECNICO, Role.ADMIN, Role.SUPERADMIN)` to restrict by role. Roles enum: `SUPERADMIN`, `ADMIN`, `MANAGER`, `TECNICO`, `INVITADO`.
- `INVITADO` role is lab-scoped: `JwtPayload.lab_ids` filters data. Services access this via `this.auth` getter pattern (see `ensayos.service.ts`).

## Entities & Database

- All entities live in `src/entities/` (flat directory, not colocated with modules).
- Entity naming: PascalCase table names (`Ensayo`, `Datos_Campo`), `snake_case` column names with `_fk` suffix for foreign keys.
- PK pattern: `@PrimaryGeneratedColumn({ name: '<table>_id' })` mapped to `id: number`.
- `synchronize: false` — schema changes require TypeORM migrations in `src/migrations/`. Migrations use timestamp-prefixed filenames and raw `QueryRunner` API.
- Migrations auto-run on app start (`migrationsRun: true`).

## Conventions

- **Language:** Codebase uses Spanish for domain names (ensayo, parcela, laboratorio, cultivo) and code comments. Keep this consistent.
- **Validation:** Global `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true, transform: true`. DTOs must use class-validator decorators.
- **Pagination:** Extend `PageQueryDto` from `src/common/dto/pagination.dto.ts` for list endpoints. Return `PaginatedResponse<T>` shape.
- **Request-scoped services:** Services that filter by user (ensayos, datos-campo, etc.) use `Scope.REQUEST` and inject `REQUEST` to read JWT payload.
- **File uploads:** Handled by multer, served statically from `/uploads` directory.
- **Scheduled tasks:** `src/tareas-programadas/` uses `@nestjs/schedule` `@Cron` for daily notification generation.
- **Reports module:** Split into specialized services — `calculos-reportes.service.ts` (statistics), `reportes-especializados.service.ts`, `svg-charts.service.ts`, `pdf-generator.ts`, `excel-generator.ts`.

## Testing

- Unit tests colocated as `*.spec.ts` next to source files.
- E2E tests in `test/` directory, configured via `test/jest-e2e.json`.
- Reports module has dedicated E2E spec: `src/reportes/reportes.e2e.spec.ts`.

## Docker

- `DOCKERIZED=true` env var tells `ConfigModule` to skip `.env` file and use container env vars instead.
- MySQL health check ensures app waits for DB readiness before starting.
- Vue client mounts as separate container on port 3001, talks to backend via `http://app:3000` on the `backend-network`.

