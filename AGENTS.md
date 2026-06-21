# AGENTS.md — TMS (Trial Management System)

> **Two independent projects live in this repo.** Do NOT confuse them.

| Project | Path | Framework | Port | Docker Service |
|---------|------|-----------|------|----------------|
| **Backend** | `/tms-backend/` | NestJS 10 + TypeORM 0.3 + MySQL 8 | 3000 | `app` |
| **Frontend** | `/tms-backend/tms-client-vue/` | Nuxt 3 + Vue 3 + Pinia + TailwindCSS 3 | 3001 | `client-vue` |
| **Database** | — | MySQL 8.0 | 3306 | `mysql` |

---

## 1. Repository Layout

```
TrialManagementSystem/
├── tms-backend/                      ← BACKEND root (NestJS)
│   ├── src/                          ← All backend source code
│   │   ├── main.ts                   ← Bootstrap: CORS, global prefix, guards, Swagger
│   │   ├── app.module.ts             ← Root module, registers ALL feature modules
│   │   ├── entities/                 ← ALL TypeORM entities (flat, 27 files)
│   │   ├── migrations/               ← TypeORM migrations (11 files, auto-run on start)
│   │   ├── auth/                     ← JWT auth, guards, decorators
│   │   ├── common/                   ← Shared DTOs (pagination), exception filter
│   │   ├── ensayos/                  ← Central domain module
│   │   ├── laboratorios/             ← Lab management
│   │   ├── bloques/                  ← Blocks within trials
│   │   ├── parcelas/                 ← Plots within blocks
│   │   ├── tratamientos/             ← Treatments within protocols
│   │   ├── tratamientos-producto/    ← Treatment-Product junction
│   │   ├── aplicaciones/             ← Field applications
│   │   ├── momentos/                 ← Evaluation moments
│   │   ├── datos-campo/              ← Field measurements
│   │   ├── datos-cosecha/            ← Harvest data
│   │   ├── datos-siembra/            ← Sowing data
│   │   ├── protocolos/               ← Experiment protocols
│   │   ├── protocolo-variables/      ← Variables per trial type
│   │   ├── productos/                ← Agrochemical products
│   │   ├── catalogos/                ← Catalog modules (cultivos, variedades, tipos-ensayo, tipos-siembra)
│   │   ├── locations/                ← Location helpers
│   │   ├── fotos/                    ← Photo/video upload (multer)
│   │   ├── reportes/                 ← PDF/Excel report generation
│   │   ├── notificaciones/           ← User notifications
│   │   ├── tareas-programadas/       ← Cron jobs (@nestjs/schedule)
│   │   ├── asistente-flujo/          ← Workflow assistant
│   │   ├── users/                    ← User management
│   │   ├── roles/                    ← Role CRUD
│   │   ├── permisos/                 ← Permission CRUD
│   │   ├── settings/                 ← App settings
│   │   └── status-ensayo/            ← Trial status catalog
│   ├── docker-compose.yml            ← Dev: 3 services (app, mysql, client-vue)
│   ├── Dockerfile                    ← Backend Docker (node:20-alpine, npm start:dev)
│   ├── package.json                  ← Backend deps
│   ├── tsconfig.json                 ← target es2016, commonjs, strict
│   ├── .env                          ← Local dev env vars
│   ├── uploads/                      ← Static file uploads served at /uploads
│   └── tms-client-vue/               ← FRONTEND root (Nuxt 3) — SEPARATE PROJECT
│       ├── app.vue                   ← Root: initializes auth + theme
│       ├── nuxt.config.ts            ← SSR in prod only, TailwindCSS, Pinia, apiBase
│       ├── Dockerfile                ← Multi-stage build (builder → node:20-alpine)
│       ├── package.json              ← Frontend deps (nuxt, pinia, axios, tailwind, headlessui, heroicons)
│       ├── tailwind.config.ts        ← Custom primary palette, Inter font, dark mode 'class'
│       ├── .env.development          ← NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
│       ├── .env.production           ← NUXT_PUBLIC_API_BASE=https://agronomic-tms.dariassoft.com.ar/api/v1
│       ├── layouts/                  ← default.vue (sidebar + header + toast + offline indicator)
│       ├── pages/                    ← File-based routing
│       ├── components/               ← 16 component subdirs + 4 root components
│       ├── composables/              ← 13 composables (useApi, useEnsayos, useBloques, etc.)
│       ├── stores/                   ← 26 Pinia stores (one per domain)
│       ├── middleware/               ← auth.ts, ensayos.ts, page-loader.ts
│       ├── plugins/                  ← error-handler.ts, version-check.ts
│       ├── utils/                    ← apiHelpers.ts
│       ├── types/                    ← qrcode.d.ts
│       └── validation/              ← cache-policy-check.js
```

---

## 2. Backend Architecture

### 2.1 Tech Stack
- **NestJS 10** with Express adapter
- **TypeORM 0.3** with MySQL 8 (`mysql2` driver)
- **JWT auth** via `@nestjs/passport` + `passport-jwt`
- **Swagger** auto-generated at `/docs`
- **File uploads**: multer → `/uploads` (ServeStatic)
- **Reports**: `pdfkit` (PDF) + `exceljs` (Excel)
- **Cron**: `@nestjs/schedule` for daily notifications
- **Validation**: `class-validator` + `class-transformer`

### 2.2 Bootstrap (`src/main.ts`)
- Global prefix: `api/v1`
- CORS: allows all origins in dev; reads `FRONTEND_URLS` env in prod
- Global `ValidationPipe`: `whitelist: true, forbidNonWhitelisted: true, transform: true`
- Global guards: `JwtAuthGuard` + `RolesGuard` (all routes protected by default)
- Swagger at `/docs` with Bearer auth scheme

### 2.3 Module Pattern
Every domain follows the same structure (use `src/ensayos/` as canonical example):

```
ensayos/
├── ensayos.module.ts       ← TypeOrmModule.forFeature([Entity...])
├── ensayos.controller.ts   ← @ApiTags, @ApiBearerAuth, Swagger decorators
├── ensayos.service.ts      ← @Injectable({ scope: Scope.REQUEST }), injects REQUEST
└── dto/
    ├── create-ensayo.dto.ts ← class-validator + @ApiProperty decorators
    └── update-ensayo.dto.ts
```

**When creating a new module:** register in `app.module.ts` imports, place entities in `src/entities/`, DTOs in `<module>/dto/`.

### 2.4 Auth & Authorization

- **JWT payload** (`JwtPayload`): `{ sub: number, username: string, rol: Role, rol_id: number, lab_ids: number[] }`
- **Roles enum**: `SUPERADMIN='Superadministrador'`, `ADMIN='Administrador'`, `MANAGER='Manager'`, `TECNICO='Tecnico'`, `INVITADO='Invitado'`
- **`@Public()` decorator** → makes route public (skips JWT)
- **`@Roles(Role.X)` decorator** → restricts by role
- **`INVITADO` role** is lab-scoped: `lab_ids` in JWT filters data. Services access via `this.auth` getter pattern
- **Permissions system**: `Permiso` entity with `AccionPermiso` enum (`VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR`) tied to `Rol` + `recurso` string. Enforced via `PermisosGuard`
- **Password hashing**: bcrypt with salt rounds=10, auto-hash in `@BeforeInsert`/`@BeforeUpdate` on `Usuario` entity
- **Login**: `POST /api/v1/auth/login` → returns `{ accessToken, user }`

### 2.5 Entities & Database (27 entities in `src/entities/`)

**Entity conventions:**
- PascalCase table names (`Ensayo`, `Datos_Campo`)
- `snake_case` column names with `_fk` suffix for foreign keys
- PK pattern: `@PrimaryGeneratedColumn({ name: '<table>_id' })` mapped to `id: number`
- `synchronize: false` — all schema changes via migrations
- `migrationsRun: true` — migrations auto-run on app start

**Complete Entity Map:**

| Entity | Table | PK | Key Relations |
|--------|-------|----|---------------|
| `Laboratorio` | `Laboratorio` | `lab_id` | → Productos, → UsuarioLaboratorio |
| `Usuario` | `Usuario` | `usuario_id` | → Rol, → UsuarioLaboratorio[] |
| `Rol` | `Rol` | `rol_id` | → Usuario[], enum Role values |
| `UsuarioLaboratorio` | `Usuario_Laboratorio` | `usuario_lab_id` | → Usuario, → Laboratorio |
| `Permiso` | `Permiso` | `permiso_id` | → Rol, AccionPermiso enum |
| `Ensayo` | `Ensayo` | `ensayo_id` | → Laboratorio, → Protocolo, → TipoEnsayo, → Usuario(responsable), → Cultivo, → CultivoVariedad, → TipoSiembra, → StatusEnsayo, → Aplicacion[], → Bloque[], → Parcela[] |
| `Protocolo` | `Protocolo` | `protocolo_id` | → Tratamiento[], → Ensayo[] |
| `TipoEnsayo` | `Tipo_Ensayo` | `tipo_ensayo_id` | → TipoEnsayoVariable[], → TipoEnsayoEvaluacionDia[] |
| `TipoEnsayoVariable` | (junction) | — | → TipoEnsayo |
| `TipoEnsayoEvaluacionDia` | (junction) | — | → TipoEnsayo |
| `StatusEnsayo` | `StatusEnsayo` | `status_id` | → Ensayo[] |
| `Cultivo` | `Cultivo` | — | crop species |
| `CultivoVariedad` | (variedad) | — | → Cultivo |
| `TipoSiembra` | `Tipo_Siembra` | — | sowing type catalog |
| `Bloque` | `Bloque` | `bloque_id` | → Ensayo, → Parcela[] |
| `Parcela` | `Parcela` | `parcela_id` | → Ensayo, → Bloque, → Tratamiento, → DatosCampo[], → DatosSiembra (1:1), → DatosCosecha (1:1) |
| `Tratamiento` | `Tratamiento` | `tratamiento_id` | → Protocolo, → Parcela[], → TratamientoProducto[] |
| `TratamientoProducto` | `Tratamiento_Producto` | `trat_prod_id` | → Tratamiento, → Producto (with dosis, unidadDosis, estadio) |
| `Producto` | `Producto` | `producto_id` | → Laboratorio, → TratamientoProducto[] |
| `Aplicacion` | `Aplicacion` | `aplicacion_id` | → Ensayo, → MomentoEvaluacion[] (weather + equipment data) |
| `MomentoEvaluacion` | `Momento_Evaluacion` | `momento_id` | → Aplicacion, → DatosCampo[] |
| `DatosCampo` | `Datos_Campo` | `dato_campo_id` | → Parcela, → MomentoEvaluacion, → DatosCampoMedicion[], → FotoRegistro[] |
| `DatosCampoMedicion` | `Datos_Campo_Medicion` | `medicion_id` | → DatosCampo, → ProtocoloVariable |
| `ProtocoloVariable` | `Protocolo_Variable` | `variable_id` | → TipoEnsayo, → DatosCampoMedicion[] |
| `DatosSiembra` | `Datos_Siembra` | `siembra_id` | → Parcela (1:1) |
| `DatosCosecha` | `Datos_Cosecha` | `cosecha_id` | → Parcela (1:1), extensive harvest fields |
| `FotoRegistro` | `Foto_Registro` | `foto_id` | → DatosCampo |

**Domain Model Hierarchy:**
```
Laboratorio
  └── Ensayo (central entity)
        ├── Protocolo → Tratamiento[] → TratamientoProducto[]
        ├── Bloque[] → Parcela[]
        ├── Parcela[] ← (also linked to Bloque + Tratamiento)
        │     ├── DatosSiembra (1:1)
        │     ├── DatosCosecha (1:1)
        │     └── DatosCampo[] (per MomentoEvaluacion)
        │           ├── DatosCampoMedicion[] (per ProtocoloVariable)
        │           └── FotoRegistro[]
        └── Aplicacion[] → MomentoEvaluacion[]
```

**Key data flow:** Field measurements go through `DatosCampo` → `DatosCampoMedicion` (per-variable values keyed by `ProtocoloVariable`). Reports aggregate this data into PDF/Excel exports.

### 2.6 Pagination
- Extend `PageQueryDto` from `src/common/dto/pagination.dto.ts` (page, limit, sort, order)
- Return `PaginatedResponse<T>` shape: `{ data: T[], meta: { total, page, limit, pageCount } }`
- Use `buildMeta()` helper

### 2.7 Reports Module (`src/reportes/`)
Split into specialized services:
- `reportes.service.ts` — main orchestrator (37KB, largest service)
- `calculos-reportes.service.ts` — statistical calculations
- `reportes-especializados.service.ts` — specialized report types
- `pdf-generator.ts` — pdfkit-based PDF generation
- `excel-generator.ts` — exceljs-based Excel generation
- `svg-charts.service.ts` — SVG chart generation
- `graficos-reales.service.ts` — real data chart service

### 2.8 Error Handling
- Global `AllExceptionsFilter` in `src/common/filters/all-exceptions.filter.ts`
- Returns structured JSON: `{ statusCode, timestamp, path, message, error }`

### 2.9 Registered Modules (in `app.module.ts`)
EnsayosModule, LaboratoriosModule, ProductosModule, TratamientosModule, BloquesModule, ParcelasModule, AplicacionesModule, MomentosModule, DatosCampoModule, DatosCosechaModule, DatosSiembraModule, TratamientosProductoModule, ProtocoloVariablesModule, AuthModule, UsersModule, CultivosModule, CultivoVariedadesModule, TiposEnsayoModule, LocationsModule, TiposSiembraModule, ProtocolosModule, StatusEnsayoModule, RolesModule, PermisosModule, ReportesModule, FotosModule, NotificacionesModule, TareasProgramadasModule, AsistenteFlujoModule

---

## 3. Frontend Architecture

### 3.1 Tech Stack
- **Nuxt 3.9** (Vue 3, Composition API, `<script setup>`)
- **Pinia** for state management (26 stores)
- **TailwindCSS 3** with `@tailwindcss/forms` plugin
- **Headless UI** (`@headlessui/vue`) for accessible components
- **Heroicons** (`@heroicons/vue`) for icons
- **Axios** (available but `$fetch` is primary HTTP client)
- **Dark mode**: class-based (`darkMode: 'class'` in tailwind)
- **Font**: Inter (via tailwind config)
- **QR**: `qrcode` + `jsqr` libraries

### 3.2 Nuxt Configuration (`nuxt.config.ts`)
- **SSR**: enabled only in production (`ssr: process.env.NODE_ENV === 'production'`)
- **Dev server**: port 3001
- **Modules**: `@pinia/nuxt`
- **CSS**: `~/assets/css/main.css` (TailwindCSS entry)
- **Auto-imports**: `~/composables`, `~/stores`, `~/utils`
- **API Base**: loaded from `.env.development` or `.env.production` → `runtimeConfig.public.apiBase`

### 3.3 API Communication Pattern
All API calls go through `composables/useApi.ts`:
```typescript
const { get, post, patch, put, delete: del } = useApi()
// Uses $fetch with baseURL from runtimeConfig.public.apiBase
// Auto-injects Bearer token from auth store
// Auto-redirects to /login on 401
```

### 3.4 Auth Flow (Frontend)
1. `stores/auth.ts` — Pinia store with `login()`, `logout()`, `initializeAuth()`
2. Token + user stored in `localStorage`
3. `middleware/auth.ts` — global route middleware:
   - Public routes: `/login`, `/reset-password`, `/`
   - Redirects unauthenticated users to `/login`
   - Redirects authenticated users away from `/login`
4. Initializes `offlineStore` for offline-first field data capture

### 3.5 Offline Support (`stores/offline.ts`)
- **IndexedDB** (`tms_offline_db`) with two object stores: `pending_mediciones`, `pending_media`
- Queues field measurements and photos/videos when offline
- `syncAll(api)` — syncs pending data when connection is restored
- Auto-detects online/offline via `navigator.onLine` events
- Cleanup of synced data older than 7 days

### 3.6 Pages (File-Based Routing)

| Route | Page File | Description |
|-------|-----------|-------------|
| `/` | `index.vue` | Dashboard home |
| `/login` | `login.vue` | Login form |
| `/reset-password` | `reset-password.vue` | Password reset |
| `/ensayos` | `ensayos/index.vue` | Trial list |
| `/ensayos/new` | `ensayos/new.vue` | Create trial |
| `/ensayos/:id` | `ensayos/[id].vue` → `[id]/index.vue` | Trial detail |
| `/ensayos/:id/edit` | `ensayos/[id]/edit.vue` | Edit trial |
| `/mediciones` | `mediciones/index.vue` | Measurements list |
| `/mediciones/:id` | `mediciones/[id]/index.vue` | Measurement detail |
| `/bloques` | `bloques.vue` | Block management |
| `/parcelas` | `parcelas.vue` | Plot management |
| `/siembra` | `siembra.vue` | Sowing data (23KB) |
| `/cosecha` | `cosecha.vue` | Harvest data (37KB) |
| `/reportes` | `reportes.vue` | Report generation |
| `/protocolos` | `protocolos/index.vue` | Protocol list |
| `/tipos-ensayo` | `tipos-ensayo/index.vue` | Trial types |
| `/notificaciones` | `notificaciones.vue` | Notifications |
| `/settings` | `settings.vue` | User settings |
| `/admin/laboratorios` | `admin/laboratorios.vue` | Lab management |
| `/admin/usuarios` | `admin/usuarios.vue` | User management |
| `/admin/roles` | `admin/roles.vue` | Role management |
| `/admin/permisos` | `admin/permisos.vue` | Permissions management |
| `/admin/productos` | `admin/productos.vue` | Product management |
| `/catalogos/cultivos` | `catalogos/cultivos.vue` | Crop catalog |
| `/catalogos/variedades` | `catalogos/variedades.vue` | Variety catalog |
| `/catalogos/tipos-ensayo` | `catalogos/tipos-ensayo.vue` | Trial type catalog |
| `/catalogos/tipos-siembra` | `catalogos/tipos-siembra.vue` | Sowing type catalog |

### 3.7 Stores (26 Pinia stores in `stores/`)
`aplicaciones`, `asistente-flujo`, `auth`, `bloques`, `catalogos`, `cultivos`, `datos-campo`, `ensayos`, `laboratorios`, `menu`, `momentos`, `notificaciones`, `offline`, `parcelas`, `permisos`, `productos`, `protocolos`, `reportes`, `roles`, `settings`, `tipos-ensayo`, `tipos-siembra`, `tratamientos`, `usuarios`, `variedades`

### 3.8 Composables (13 in `composables/`)
`useApi`, `useBloques`, `useEnsayos`, `useLoginDebug`, `useNotifications`, `usePageLoader`, `useParcelas`, `usePermisos`, `useProtocolos`, `useTheme`, `useTiposEnsayo`, `useTratamientos`, `useVersionCheck`

### 3.9 Component Organization (`components/`)

| Directory | Components |
|-----------|------------|
| `common/` | ConfirmDeleteModal, OfflineIndicator, TheToast, WorkflowAssistant |
| `navigation/` | ModuleMenu, NavLinks, SideMenu |
| `ensayos/` | EnsayoDetail, EnsayoForm, EnsayoTable, DeleteConfirm |
| `reportes/` | EnsayoSearchSelect, ReportesGenerator |
| `bloques/` | Block-related components |
| `parcelas/` | Plot-related components |
| `catalogos/` | Catalog CRUD components |
| `dashboard/` | Dashboard widgets |
| `laboratorios/` | Lab management components |
| `media/` | Photo/video components |
| `permisos/` | Permission management |
| `productos/` | Product management |
| `protocolos/` | Protocol management |
| `roles/` | Role management |
| `tiposEnsayo/` | Trial type management |
| `usuarios/` | User management |
| Root | AppUpdateNotification, ErrorBoundary, NotificationContainer |

### 3.10 Layout
- `default.vue` — Main app layout: sidebar (desktop permanent, mobile drawer) + top header with dark mode toggle, notifications bell (polls every 60s), user dropdown menu. Includes `TheToast`, `OfflineIndicator`, `WorkflowAssistant`
- `blank.vue` — Empty layout (for login page)

### 3.11 Plugins
- `error-handler.ts` — catches dynamic import failures and auto-reloads
- `version-check.ts` — checks for app updates

### 3.12 Utilities
- `apiHelpers.ts` — `extractArrayFromResponse()`, `extractTotalFromResponse()`, `extractErrorMessage()` for robust API response handling

---

## 4. Docker & Deployment

### 4.1 Development (`tms-backend/docker-compose.yml`)
Three services on `backend-network`:

**`app`** (Backend):
- Build from `./Dockerfile` (node:20-alpine, `npm run start:dev`)
- Port 3000
- Volume mounts `.:​/app` for hot reload
- Env: `DOCKERIZED=true`, `DB_HOST=mysql`, `DB_PORT=3306`, `DB_USER=myuser`, `DB_PASSWORD=mypassword`, `DB_NAME=nest_db`
- Depends on mysql (health check)

**`mysql`** (Database):
- `mysql:8.0`
- Port 3306
- Health check: `mysqladmin ping` (5s interval, 30 retries, 15s start period)
- Named volume: `mysql-data`

**`client-vue`** (Frontend):
- Build from `./tms-client-vue/Dockerfile`
- Command: `npx nuxi dev --host 0.0.0.0 --port 3001`
- Port 3001
- Volume mounts `./tms-client-vue:​/app:delegated`
- Named volume for `node_modules` isolation: `client_node_modules`
- Env: `NUXT_PUBLIC_API_BASE_URL=http://app:3000`
- Runs as `node` user (UID 1000)

### 4.2 Production (`docker-compose-ionos-agronomic-tms.yml`)
Deployed on IONOS VPS with **Traefik** reverse proxy:
- `agronomic-tms.dariassoft.com.ar` → frontend (port 3000)
- `api.agronomic-tms.dariassoft.com.ar` → backend (port 8000)
- `pma.agronomic-tms.dariassoft.com.ar` → phpMyAdmin (IP-restricted)
- `adminer.agronomic-tms.dariassoft.com.ar` → Adminer (IP-restricted)

Frontend Dockerfile is multi-stage: builder runs `npm run build`, production stage runs `node server.mjs` as non-root user `nuxt`.

### 4.3 Environment Variables

**Backend `.env`:**
```
DB_TYPE=mysql, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET, JWT_EXPIRATION_TIME
DOCKERIZED=true|false (skips .env file loading in Docker)
GENERATE_OPENAPI=true (skips DB for OpenAPI generation)
FRONTEND_URLS (comma-separated, for CORS in production)
NODE_ENV=development|production
```

**Frontend `.env.development`:**
```
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
```

**Frontend `.env.production`:**
```
NUXT_PUBLIC_API_BASE=https://agronomic-tms.dariassoft.com.ar/api/v1
```

---

## 5. Development Commands

### Backend (`tms-backend/`)
```bash
docker compose up              # Start all 3 services
npm run start:dev              # Local dev (needs .env with DB_HOST=localhost)
npm run start:debug            # Debug with --inspect
npm run build                  # Production build → dist/
npm run start:prod             # Run production build
npm run migration:run          # Run TypeORM migrations
npm run migration:create -- -n Name  # Create migration
npm test                       # Jest unit tests (*.spec.ts)
npm run test:e2e               # E2E tests
npm run lint                   # ESLint fix
npm run format                 # Prettier
```

### Frontend (`tms-backend/tms-client-vue/`)
```bash
npm run dev                    # Nuxt dev server on :3001
npm run build                  # Production build → .output/
npm run preview                # Preview production build
npm run generate               # Static site generation
npm run typecheck              # TypeScript check
```

---

## 6. Conventions

- **Language:** Codebase uses **Spanish** for domain names (ensayo, parcela, laboratorio, cultivo, siembra, cosecha) and code comments. Keep this consistent.
- **Request-scoped services:** Services filtering by user use `Scope.REQUEST` and inject `REQUEST` to read JWT payload.
- **File uploads:** multer → `/uploads` directory, served statically via ServeStatic.
- **Scheduled tasks:** `@Cron` decorators in `tareas-programadas.service.ts` for daily notification generation.
- **Frontend state:** One Pinia store per domain, using Composition API (`defineStore` with setup function).
- **Frontend API calls:** Always through `useApi()` composable, never direct `$fetch`.
- **Frontend components:** Use `<script setup lang="ts">` with Composition API.
- **Frontend styling:** TailwindCSS utility classes, dark mode via `dark:` prefix.
- **Swagger:** All endpoints documented with `@ApiTags`, `@ApiBearerAuth`, `@ApiProperty` decorators.
- **Pagination:** All list endpoints use `PageQueryDto` and return `PaginatedResponse<T>`.
- **No browser native alerts/confirms:** Do NOT use browser native alert or confirm dialogs (`alert()`, `confirm()`) anywhere in the application. Always use the application's styled components (such as `ConfirmDeleteModal` or custom styled modals/toasts) to handle notifications, confirmations, and warnings.
- **Diseño Experimental y Restricción de Bloques:** Al crear o editar un ensayo se puede definir la cantidad planificada de bloques (`cantBloques`). Si este campo está definido, el backend (`BloquesService`) limita estrictamente la creación de nuevos bloques a esa cantidad, previniendo exceder el diseño planificado. Además, en el formulario de ensayos, si se selecciona un protocolo y se define la cantidad de bloques, se sugiere automáticamente la dimensión de la matriz de parcelas ($B \times T$, donde $B$ es la cantidad de bloques y $T$ es la cantidad de tratamientos). Se valida que el número de filas en la estructura de la matriz coincida exactamente con la cantidad de bloques planificada.

---

## 7. Testing

- **Backend unit tests:** colocated as `*.spec.ts` next to source files
- **Backend E2E tests:** `test/` directory, configured via `test/jest-e2e.json`
- **Reports E2E:** `src/reportes/reportes.e2e.spec.ts`
- **Frontend:** No test framework configured

---

## 8. Key Gotchas

1. **Don't confuse projects**: Backend is `tms-backend/`, Frontend is `tms-backend/tms-client-vue/`. They have separate `package.json`, `Dockerfile`, `node_modules`, and `tsconfig.json`.
2. **DOCKERIZED env var**: When `true`, `ConfigModule` skips `.env` file and uses container env vars.
3. **API prefix**: All backend routes are under `/api/v1`. Frontend constructs URLs relative to `apiBase` runtime config.
4. **SSR only in prod**: Nuxt runs as SPA in development, SSR in production.
5. **node_modules isolation**: Docker uses named volume `client_node_modules` to prevent host/container mismatch.
6. **Migrations auto-run**: `migrationsRun: true` means migrations execute on every app start. Never use `synchronize: true`.
7. **Frontend runs inside backend dir**: The Vue client lives at `tms-backend/tms-client-vue/` but is a completely independent Node.js project with its own dependencies.
