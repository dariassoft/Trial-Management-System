# Reglas para la Interacción con IA en el Proyecto TMS

**Último Update**: Diciembre 11, 2025  
**Versión**: 2.2 (Con rutas absolutas y referencias actualizadas)  
**Para**: GitHub Copilot, Gemini, Junie y otros AI Assistants  
**Proyecto**: Trial Management System (TMS)

---

## 📍 RUTAS ABSOLUTAS DEL PROYECTO

```
🏠 Raíz Proyecto:
   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/

📦 Backend (NestJS):
   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/

🎨 Frontend (Nuxt 3):
   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/
```

---

## 📚 DOCUMENTOS DE REFERENCIA OBLIGATORIOS

**IMPORTANTE**: Antes de cualquier sesión, IA Assistant DEBE tener estos documentos en contexto:

1. **gemini-rules.md** (Este archivo)
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`
   - Contenido: Estructura, Docker, convenciones, rutas

2. **DOCUMENTACION_REFERENCIA.md**
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md`
   - Contenido: Guía rápida, referencias cruzadas, cómo usar

3. **TEMPLATE_PROMPTS.md**
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`
   - Contenido: 5 templates pre-formateados, copiar/pegar

4. **PLAN_MAESTRO.md**
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md`
   - Contenido: Roadmap 9 sesiones, estado actual, próximas tareas

---

## 🐳 IMPORTANTE: EJECUCIÓN EN CONTENEDORES DOCKER

### ⚠️ TODOS LOS COMANDOS `npm` DEBEN EJECUTARSE EN SUS CONTENEDORES

**NO ejecutar en host local** - Ejecutar DENTRO de los contenedores Docker:

### 🚨 ADVERTENCIA CRÍTICA: UBICACIÓN CORRECTA

**⚠️ PROBLEMA HISTÓRICO**: Ejecutar Docker desde `/tms-backend` causa rutas duplicadas

```
❌ INCORRECTO - PRODUCE ERRORES:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d
# ERROR: build path .../tms-backend/tms-backend (DUPLICADO)

✅ CORRECTO - FUNCIONA:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d
# SUCCESS: build path .../tms-backend (CORRECTO)
```

**POR QUÉ**: El archivo `docker-compose.frontend.yml` usa ruta relativa `../tms-backend`. Si ejecutas desde `/tms-backend`, Docker calcula: `/tms-backend` + `../tms-backend` = `/tms-backend/tms-backend` ❌

**SOLUCIÓN**: Ejecutar **SIEMPRE** desde la raíz del proyecto.

---

### 📍 DIRECTORIO CORRECTO PARA DOCKER

**⚠️ CRÍTICO**: Los comandos Docker deben ejecutarse desde **LA RAÍZ DEL PROYECTO**, NO desde `/tms-backend`

```
✅ CORRECTO:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

❌ INCORRECTO:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
```

**Razón**: El `docker-compose.frontend.yml` usa rutas relativas (`context: ../tms-backend`). Si ejecutas desde `/tms-backend`, la ruta relativa se duplica:
- ❌ `/tms-backend/tms-backend` (INCORRECTO - ruta duplicada)
- ✅ `/tms-backend` (CORRECTO - ruta única)

---

#### Backend (NestJS + MySQL)
```bash
# 📍 RUTA ABSOLUTA BACKEND: 
#    /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

# ✅ CORRECTO: Ejecutar Docker desde raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Iniciar servicios
docker-compose -f tms-backend/docker-compose.yml up -d

# Entrar al contenedor backend
docker-compose -f tms-backend/docker-compose.yml exec app bash

# Dentro del contenedor, ejecutar comandos npm
npm install          # Instalar dependencias
npm run build        # Compilar
npm start            # Iniciar desarrollo
npm run dev          # Desarrollo con reload
npm test             # Tests
npm run lint         # ESLint

# Ver logs
docker-compose -f tms-backend/docker-compose.yml logs -f app
docker-compose -f tms-backend/docker-compose.yml logs -f mysql

# ⚠️ IMPORTANTE: NO ejecutar Docker desde /tms-backend, causa rutas duplicadas
```

#### Frontend (Nuxt 3)
```bash
# 📍 RUTA ABSOLUTA FRONTEND: 
#    /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue

# ✅ CORRECTO: Ejecutar Docker desde raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Iniciar servicios
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d

# Entrar al contenedor frontend
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash

# Dentro del contenedor, ejecutar comandos npm
npm install          # Instalar dependencias
npm run dev          # Desarrollo (localhost:3001)
npm run build        # Build producción
npm run generate     # Generar estático
npm run typecheck    # TypeScript check

# Ver logs
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml logs -f nuxt

# ⚠️ IMPORTANTE: NO ejecutar Docker desde /tms-backend, causa rutas duplicadas
```

#### Ambos servicios simultáneamente
```bash
# 📍 UBICACIÓN: Raíz del Proyecto
#    /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# ✅ CORRECTO: Ejecutar desde raíz (NO desde /tms-backend)
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Iniciar ambos
docker-compose -f tms-backend/docker-compose.yml up -d
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d

# Ver estado
docker-compose -f tms-backend/docker-compose.yml ps
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml ps

# Para npm commands
# Backend
docker-compose -f tms-backend/docker-compose.yml exec app bash

# Frontend
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash
```

### 📍 Puertos
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`
- MySQL: `localhost:3306`

### 🔧 Troubleshooting Docker
```bash
# Ubicación: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

# Limpiar todo
docker-compose down -v

# Rebuild imágenes
docker-compose build --no-cache

# Restart servicios
docker-compose restart app
docker-compose -f tms-client-vue/docker-compose.frontend.yml restart nuxt
```

---

## 📚 DOCUMENTACIÓN RELACIONADA

**Incluir en cada prompt a IA Assistants:**

1. **`gemini-rules.md`** (Este archivo) - Estructura, reglas, Docker
2. **`DOCUMENTACION_REFERENCIA.md`** - Guía rápida, cómo usar, referencias
3. **`TEMPLATE_PROMPTS.md`** - 5 templates listos para copiar/pegar
4. **`PLAN_MAESTRO.md`** - Roadmap 9 sesiones, estado actual

Estos documentos están en:
```
/tms-backend/gemini-rules.md                              ← Este
/tms-backend/DOCUMENTACION_REFERENCIA.md                  ← Referencias
/tms-backend/TEMPLATE_PROMPTS.md                          ← Templates
/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md         ← Roadmap
```

---



### 📂 Backend - `/tms-backend`

```
tms-backend/
├── src/
│   ├── main.ts                          # Entry point
│   ├── app.module.ts                    # Root module
│   ├── app.controller.ts                # Root controller
│   ├── app.service.ts                   # Root service
│   │
│   ├── auth/                            # Autenticación JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── strategies/
│   │   └── dto/
│   │
│   ├── users/                           # Gestión de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   └── usuarios-laboratorio.ts      # Relación usuario-laboratorio
│   │
│   ├── ensayos/                         # ✅ CRUD Ensayos (Sesión 2)
│   │   ├── ensayos.controller.ts        # Endpoints documentados Swagger
│   │   ├── ensayos.service.ts           # Lógica con filtros por fecha
│   │   ├── ensayos.module.ts
│   │   └── dto/
│   │       ├── create-ensayo.dto.ts
│   │       └── update-ensayo.dto.ts
│   │
│   ├── tratamientos/                    # 📅 Sesión 3 (CRUD Pendiente)
│   │   ├── tratamientos.controller.ts
│   │   ├── tratamientos.service.ts
│   │   └── dto/
│   │
│   ├── tratamientos-producto/           # Relación tratamiento-producto
│   ├── productos/                       # Catálogo de productos
│   ├── bloques/                         # 📅 Sesión 4 (Diseño experimental)
│   ├── parcelas/                        # 📅 Sesión 4 (Diseño experimental)
│   ├── aplicaciones/                    # 📅 Sesión 5 (Datos de campo)
│   ├── datos-campo/                     # 📅 Sesión 5 (Mediciones)
│   ├── datos-cosecha/                   # 📅 Sesión 5 (Cosecha)
│   ├── fotos/                           # 📅 Sesión 5 (Upload de fotos)
│   ├── laboratorios/                    # Catálogo de laboratorios
│   ├── protocolo-variables/             # Variables de protocolo
│   ├── protocolos/                      # 📅 Sesión 3+ (Protocolos)
│   ├── momentos/                        # Momentos de evaluación
│   ├── catalogos/                       # Catálogos generales
│   ├── entities/                        # 24 entidades TypeORM
│   ├── common/                          # Utilities, DTOs comunes
│   ├── database/                        # Config TypeORM
│   └── locations/                       # Ubicaciones geográficas
│
├── dist/                                # Build compilado
├── scripts/
│   ├── generate-openapi.js              # Genera OpenAPI desde código
│   └── openapi-to-postman.js            # Convierte a Postman collection
│
├── docs/
│   ├── openapi.json                     # Especificación OpenAPI
│   ├── *.postman_collection.json        # Colecciones Postman
│   ├── *.sql                            # Scripts SQL
│   ├── *.md                             # Documentación varia
│   └── ACTUALIZACION_SQL_BACKEND_SWAGGER.md
│
├── package.json                         # NestJS 11.x, TypeORM 0.3.x
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.mjs
└── .env                                 # Variables de entorno
```

### 📂 Frontend - `/tms-client-vue`

```
tms-client-vue/
├── pages/
│   ├── index.vue                        # Dashboard ✅ (S1/S2)
│   ├── login.vue                        # Login ✅ (S1)
│   ├── reset-password.vue               # Reset ✅ (S1)
│   ├── ensayos/                         # ✅ CRUD Completo (Sesión 2)
│   │   ├── index.vue                    # Listado con filtros
│   │   ├── new.vue                      # Crear
│   │   ├── [id].vue                     # Ver detalle
│   │   └── [id]/
│   │       └── edit.vue                 # Editar
│   │
│   ├── tratamientos/                    # 📅 Sesión 3
│   ├── bloques/                         # 📅 Sesión 4
│   ├── parcelas/                        # 📅 Sesión 4
│   ├── datoscampo/                      # 📅 Sesión 5
│   ├── reportes/                        # 📅 Sesión 6
│   ├── admin/                           # 📅 Sesión 8
│   └── dashboard/                       # 📅 Sesión 7
│
├── components/
│   ├── dashboard/
│   │   └── RecentEnsayos.vue            # ✅ Con filtros fecha (S2)
│   └── ensayos/
│       ├── EnsayoForm.vue               # ✅ Completo con placeholder (S2)
│       └── EnsayoTable.vue              # ✅ Tabla con estilos (S2)
│
├── stores/
│   ├── auth.ts                          # ✅ (S1)
│   └── ensayos.ts                       # ✅ (S2)
│
├── composables/
│   ├── useApi.ts                        # ✅ (S1)
│   ├── useTheme.ts                      # ✅ (S1)
│   └── useEnsayos.ts                    # ✅ (S2)
│
├── middleware/
│   └── auth.ts                          # ✅ (S1)
│
├── layouts/
│   ├── default.vue                      # ✅ (S1)
│   └── blank.vue                        # ✅ (S1)
│
├── assets/
│   └── css/main.css                     # ✅ (S1)
│
├── docs/
│   ├── PLAN_MAESTRO.md                  # Este documento (ACTUALIZADO)
│   ├── STATUS_SESION_2.md               # ✅ Sesión 2 completada
│   ├── GUIA_ENSAYOS_CRUD.md
│   ├── ARQUITECTURA_FRONTEND.md
│   └── ... (más docs)
│
├── nuxt.config.ts
├── package.json                         # Nuxt 3, Vue 3, Pinia
├── tsconfig.json
├── tailwind.config.ts
└── .env
```

---

## 🗄️ CAMBIOS EN BASE DE DATOS

### ✅ ENTIDADES PRINCIPALES (24 total)

| Entidad | Tablas | Campos Claves | Cambios Recientes |
|---------|--------|---------------|-------------------|
| **Ensayo** | 1 | id, nombreEnsayo, **codigoLabor**, fechaInicio, **fechaSiembra**, fechaCosecha, status | ✅ Agregado codigoLabor con placeholder, fechas ISO YYYY-MM-DD |
| **Laboratorio** | 1 | id, nombre, ubicacion | No cambios |
| **Usuario** | 1 | id, username, email, rol_id_fk | ✅ Relación usuario-laboratorio agregada |
| **UsuarioLaboratorio** | 1 | usuario_id, lab_id | ✅ Nueva tabla (S1) |
| **Tratamiento** | 1 | id, nombreTratamiento, dosis, unidad | Pendiente por S3 |
| **TratamientoProducto** | 1 | tratamiento_id, producto_id, dosis | Relación M:N |
| **Producto** | 1 | id, nombre, tipo | Catálogo |
| **Protocolo** | 1 | id, nombre, descripcion | ✅ Agregada (S1) |
| **ProtocoloVariable** | 1 | protocolo_id, variable_id | Relación |
| **TipoEnsayo** | 1 | id, nombre | Catálogo |
| **TipoEnsayoVariable** | 1 | tipo_ensayo_id, variable_id | Relación |
| **Cultivo** | 1 | id, nombre | Catálogo |
| **CultivoVariedad** | 1 | id, nombre, cultivo_id | ✅ Agregada (S2) |
| **TipoSiembra** | 1 | id, nombre | Catálogo |
| **Bloque** | 1 | id, numeroBloque, ensayo_id | Pendiente por S4 |
| **Parcela** | 1 | id, numeroParcela, bloque_id | Pendiente por S4 |
| **DatosCampo** | 1 | id, parcela_id, fechaRegistro, observaciones | Pendiente por S5 |
| **DatosCampoMedicion** | 1 | datoscampo_id, variable_id, valor | Pendiente por S5 |
| **Aplicacion** | 1 | id, tratamiento_id, parcela_id, fechaAplicacion | Pendiente por S5 |
| **DatosCosecha** | 1 | id, parcela_id, fechaCosecha, rendimiento | Pendiente por S5 |
| **FotoRegistro** | 1 | id, datoscampo_id, url | Pendiente por S5 |
| **MomentoEvaluacion** | 1 | id, nombre, dds (días desde siembra) | Catálogo |
| **Rol** | 1 | id, nombre | Catálogo |
| **Location** | 1 | id, provincia, departamento, localidad | Catálogo |

### 📅 CAMBIOS POR SESIÓN

**Sesión 1**: ✅ 22 tablas base, Protocolo, UsuarioLaboratorio  
**Sesión 2**: ✅ CultivoVariedad, codigoLabor, fechas ISO, indices  
**Sesión 3**: 📅 Tratamientos optimizado, validaciones  
**Sesión 4**: 📅 Bloques, Parcelas, optimizaciones  
**Sesión 5**: 📅 DatosCampo, Aplicaciones, FotoRegistro  

---

## 🔄 CAMBIOS EN FORMULARIOS Y BÚSQUEDA

### ✅ FORMULARIO ENSAYOS (Sesión 2 - Completada)

**Campos**:
```
nombreEnsayo*           (string, required)
codigoLabor             (string, optional) - placeholder: "26-BASF-0001-PRE-"
laboratorioId           (select)
tipoEnsayoId            (select)
responsableId           (select)
cultivoId               (select)
variedadId              (select, NUEVO S2)
tipoSiembraId           (select)
provincia               (string)
departamento            (string)
establecimiento         (string)
lote                    (string)
latitud                 (number)
longitud                (number)
distSurcosCm            (number)
fechaInicio             (date, ISO YYYY-MM-DD)
fechaSiembra            (date, ISO YYYY-MM-DD)
fechaCosecha            (date, ISO YYYY-MM-DD)
protocoloId             (select)
status                  (enum: ['Activo', 'En Ejecución', 'Completado', ...])
```

**Validación**: `class-validator` + `class-transformer`

### ✅ BÚSQUEDA Y FILTROS (Sesión 2 - Actualizada)

**Tipo**: Busqueda multicampo + Filtros específicos + Rango de fechas

**Parámetros GET /ensayos**:
```
page=1                  (default: 1)
limit=10                (default: 10)
sort=fechaSiembra       (default: id)
order=ASC|DESC          (default: ASC)
q=texto                 (búsqueda general - 8+ campos)
laboratorio=nombre      (filtro específico)
variedad=nombre         (filtro específico)
fechaSiembraStart=YYYY-MM-DD  (✅ NUEVO - rango)
fechaSiembraEnd=YYYY-MM-DD    (✅ NUEVO - rango)
```

**Campos en búsqueda general (q)**:
```
1. nombreEnsayo         (case-insensitive, LIKE)
2. responsable.nombre   (case-insensitive, LIKE)
3. responsable.apellido (case-insensitive, LIKE)
4. cultivo.nombre       (case-insensitive, LIKE)
5. variedad.nombre      (case-insensitive, LIKE)
6. tipoSiembra.nombre   (case-insensitive, LIKE)
7. laboratorio.nombre   (case-insensitive, LIKE)
8. status               (case-insensitive, LIKE)
```

**Lógica Backend**:
```typescript
// búsqueda general
LOWER(e.nombreEnsayo) LIKE LOWER(:q) OR
LOWER(responsable.nombre) LIKE LOWER(:q) OR ...

// filtro laboratorio
LOWER(laboratorio.nombre) LIKE LOWER(:laboratorio)

// filtro variedad
LOWER(variedad.nombre) LIKE LOWER(:variedad)

// rangos de fecha (✅ NUEVO)
DATE(e.fechaSiembra) >= STR_TO_DATE(:fechaSiembraStart, "%Y-%m-%d")
AND DATE(e.fechaSiembra) <= STR_TO_DATE(:fechaSiembraEnd, "%Y-%m-%d")
```

---

## 📡 ENDPOINTS BACKEND

### ✅ CRUD ENSAYOS (Completado S2)

```
POST   /api/v1/ensayos
       Body: CreateEnsayoDto (20 campos)
       Response: Ensayo object
       Roles: TECNICO, ADMIN, SUPERADMIN
       Swagger: ✅ Ejemplo completo

GET    /api/v1/ensayos
       Query: page, limit, sort, order, q, laboratorio, variedad, 
              fechaSiembraStart, fechaSiembraEnd
       Response: { data: [], meta: { total, page, limit, pageCount } }
       Swagger: ✅ Todos los parámetros documentados

GET    /api/v1/ensayos/:id
       Response: Ensayo completo con relaciones
       Swagger: ✅ Documentado

PATCH  /api/v1/ensayos/:id
       Body: UpdateEnsayoDto (todos campos opcionales)
       Response: Ensayo actualizado
       Roles: TECNICO, ADMIN, SUPERADMIN
       Swagger: ✅ Ejemplo completo

DELETE /api/v1/ensayos/:id
       Response: { deleted: true }
       Roles: TECNICO, ADMIN, SUPERADMIN
       Swagger: ✅ Documentado
```

### 📅 CRUD TRATAMIENTOS (Pendiente S3)

```
POST   /api/v1/tratamientos          (Crear)
GET    /api/v1/tratamientos          (Listar - con filtros)
GET    /api/v1/tratamientos/:id      (Detalle)
PATCH  /api/v1/tratamientos/:id      (Editar)
DELETE /api/v1/tratamientos/:id      (Eliminar)
POST   /api/v1/tratamientos/:id/productos  (Agregar productos)
```

### 📚 OTROS ENDPOINTS IMPORTANTES

```
Auth:
POST   /api/v1/auth/login            (JWT)
POST   /api/v1/auth/register         (Crear usuario)
POST   /api/v1/auth/refresh-token

Usuarios:
GET    /api/v1/users                 (Listar)
POST   /api/v1/users                 (Crear)
PATCH  /api/v1/users/:id             (Editar)

Laboratorios:
GET    /api/v1/laboratorios          (Catálogo)

Productos:
GET    /api/v1/productos             (Catálogo)

Catálogos:
GET    /api/v1/tipo-ensayos
GET    /api/v1/cultivos
GET    /api/v1/cultivos-variedades
GET    /api/v1/tipo-siembras
GET    /api/v1/protocolos
GET    /api/v1/protocolo-variables
GET    /api/v1/momentos-evaluacion
```

---

## 🎨 FRONTEND FUNCIONALIDADES

### ✅ SESIÓN 1 (Backend & Frontend Base)

**Completado**:
- ✅ Autenticación JWT (login, logout, register)
- ✅ Pinia store para auth
- ✅ Middleware de rutas protegidas
- ✅ Layout default con navbar
- ✅ Dashboard básico
- ✅ Tema claro/oscuro

**Estado**: 100% Operativo

### ✅ SESIÓN 2 (CRUD Ensayos)

**Completado**:
- ✅ Pinia store: `ensayos.ts` con métodos CRUD
- ✅ Composable: `useEnsayos.ts` para UI
- ✅ Componentes:
  - `EnsayoForm.vue` - Formulario 20 campos con validación
  - `EnsayoTable.vue` - Tabla estilizada
  - Dashboard RecentEnsayos - Con filtros fecha
- ✅ Páginas:
  - `/ensayos` - Listado con búsqueda multicampo + filtro fechas
  - `/ensayos/new` - Crear
  - `/ensayos/[id]` - Ver detalle
  - `/ensayos/[id]/edit` - Editar
- ✅ Búsqueda: Por 8+ campos + laboratorio + variedad + rango fechas
- ✅ Formulario: codigoLabor con placeholder, fechas DD/MM mostrado
- ✅ Estilos: Botones con colores, iconos, responsive

**Estado**: 100% Operativo

### 📅 SESIÓN 3 (CRUD Tratamientos) - PRÓXIMA

**A implementar**:
- [ ] Pinia store: `tratamientos.ts`
- [ ] Composable: `useTratamientos.ts`
- [ ] Componentes: Form, Table
- [ ] Páginas: Listado, Crear, Editar
- [ ] Búsqueda: General + filtros
- [ ] Relación: Productos en tratamientos

**Duración**: 2-3 horas

---

## 🛠️ TECNOLOGÍAS Y LIBRERÍAS

### Backend Stack
```json
{
  "@nestjs/core": "^11.0.0",
  "@nestjs/common": "^11.0.0",
  "@nestjs/swagger": "^7.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/config": "^3.0.0",
  "typeorm": "^0.3.x",
  "mysql2": "^3.x",
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x",
  "passport-jwt": "^4.0.0"
}
```

### Frontend Stack
```json
{
  "nuxt": "^3.9.0",
  "vue": "^3.4.0",
  "pinia": "^2.1.0",
  "axios": "^1.6.0",
  "tailwindcss": "^3.3.0",
  "typescript": "^5.3.0"
}
```

### A Agregar en Futuras Sesiones
```json
{
  "chart.js": "^4.x",           // Sesión 6
  "vue-chartjs": "^5.x",        // Sesión 6
  "jspdf": "^2.x",              // Sesión 6
  "html2pdf": "^0.10.x",        // Sesión 6
  "papaparse": "^5.x",          // Sesión 6
  "vue-draggable-next": "^2.x"  // Sesión 4
}
```

---

## 📋 CONVENCIONES DE CÓDIGO

### TypeScript
- Tipado estricto habilitado (`strict: true`)
- Interfaces para datos públicos
- Types para datos privados/internos
- Genéricos para reutilizabilidad

### NestJS Backend
- **Archivos**: `kebab-case` (e.g., `ensayo.controller.ts`)
- **Clases**: `PascalCase` (e.g., `EnsayoController`, `CreateEnsayoDto`)
- **Métodos**: `camelCase` (e.g., `findAll()`, `createEnsayo()`)
- **Propiedades**: `camelCase` (e.g., `nombreEnsayo`, `fechaSiembra`)
- **DTOs**: Sufijo `Dto` (e.g., `CreateEnsayoDto`, `UpdateEnsayoDto`)
- **Decoradores**: `@ApiProperty`, `@IsString()`, `@MaxLength(255)` en DTOs

### Vue 3 Frontend
- **Componentes**: `PascalCase` (e.g., `EnsayoForm.vue`, `EnsayoTable.vue`)
- **Páginas**: `kebab-case` dentro de pages/ (e.g., `[id]/edit.vue`)
- **Composables**: `camelCase` con prefijo `use` (e.g., `useEnsayos.ts`)
- **Stores**: `camelCase` (e.g., `ensayos.ts`, `auth.ts`)
- **Variables**: `camelCase` (e.g., `searchQuery`, `dateStart`)
- **Estilos**: TailwindCSS classes + dark: variant para tema oscuro

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

- **JWT**: Bearer tokens en Authorization header
- **Roles**: SUPERADMIN, ADMIN, TECNICO, USUARIO (restricción por endpoint)
- **Guards**: `@Roles()` decorator en controladores
- **Middleware**: Auth middleware en frontend (protege rutas)
- **Hash**: Contraseñas hasheadas con bcrypt (backend)
- **CORS**: Habilitado para frontend en localhost

---

## 📊 ESTADO DE SESIONES

| Sesión | Objetivo | Backend | Frontend | Docs | Status |
|--------|----------|---------|----------|------|--------|
| **S1** | Base | ✅ 50+ endpoints | ✅ Auth UI | ✅ | ✅ 100% |
| **S2** | CRUD Ensayos | ✅ Completo | ✅ Completo | ✅ | ✅ 100% |
| **S3** | CRUD Tratamientos | 📅 Code ready | ⬜ Nuevo | 📅 | ⏳ Pendiente |
| **S4** | Diseño Experimental | 📅 Entities | ⬜ Nuevo | ⬜ | ⏳ Pendiente |
| **S5** | Datos de Campo | 📅 Entities | ⬜ Nuevo | ⬜ | ⏳ Pendiente |
| **S6** | Reportes | 📅 Partial | ⬜ Nuevo | ⬜ | ⏳ Pendiente |
| **S7** | Dashboard | 📅 Partial | 📅 Mejorar | ⬜ | ⏳ Pendiente |
| **S8** | Admin Panel | 📅 Partial | ⬜ Nuevo | ⬜ | ⏳ Pendiente |
| **S9** | Polish | 📅 Testing | 📅 Testing | ⬜ | ⏳ Pendiente |

---

## 🎯 GUÍA PARA IA ASSISTANTS

### Antes de Iniciar Sesión

1. **Leer documentación**:
   - Este archivo (gemini-rules.md) - Estructura y reglas
   - PLAN_MAESTRO.md - Roadmap y sesiones
   - STATUS_SESION_[N].md - Estado actual

2. **Verificar estado**:
   - Backend compilado (`npm run build`)
   - Frontend corriendo (`npm run dev`)
   - BD sincronizada
   - Variables de entorno configuradas

3. **Entender objetivo**:
   - Leer descripción de sesión en PLAN_MAESTRO
   - Revisar endpoints en Swagger
   - Estudiar DTOs relacionados

### Durante Desarrollo

1. **Seguir convenciones**:
   - Nombres según tipo de archivo/código
   - Tipado TypeScript completo
   - Documentación Swagger en backend
   - Componentes reutilizables en frontend

2. **Sincronizar frontend-backend**:
   - Backend: DTOs con ejemplos completos
   - Frontend: Integración API en stores/composables
   - Ambos: Mismos nombres de campos

3. **Validar cambios**:
   - Backend: `npm run build` sin errores
   - Frontend: `npm run typecheck` sin errores
   - Testing manual antes de cerrar

### Al Completar Sesión

1. **Actualizar documentación**:
   - STATUS_SESION_[N].md - Qué se completó
   - PLAN_MAESTRO.md - Marcar como ✅
   - Comentar cambios en código

2. **Commits limpios**:
   - Mensaje descriptivo
   - Agrupar cambios relacionados
   - Uno por funcionalidad

3. **Validaciones finales**:
   - Pruebas manuales completas
   - Dark mode funciona
   - Responsive en mobile
   - Errores manejados correctamente

---

## 📞 REFERENCIAS RÁPIDAS

### Endpoints Actuales (S2)
- 5 endpoints CRUD ensayos + 30+ endpoints catálogos
- Total: 50+ endpoints funcionales
- Documentación: Swagger en `/api/docs`

### Almacenamiento de Fechas
- BD: `DATE` (sin hora)
- API: String ISO `YYYY-MM-DD`
- Frontend Display: Función `formatDate()` → `DD/MM/YYYY`
- Filtros: `fechaSiembraStart` y `fechaSiembraEnd` (ISO format)

### Búsqueda Implementada
- General: 8 campos + case-insensitive
- Específica: laboratorio, variedad
- Rango: fechas con start/end
- Paginación: page, limit
- Orden: sort, order (ASC/DESC)

### Validación de Datos
- Backend: `class-validator` en DTOs
- Frontend: Validación manual + feedback user
- Tipos: TypeScript en ambos lados

---

## 📚 DOCUMENTACIÓN COMPLEMENTARIA

**IMPORTANTE**: Siempre incluir estos documentos en prompts a IA Assistants para contexto completo:

### Documentos Relacionados (Mantener actualizados en conjunto)
1. **gemini-rules.md** ← Este archivo
   - Estructura, reglas, Docker, convenciones
   
2. **DOCUMENTACION_REFERENCIA.md**
   - Guía rápida para usar con IA
   - Cómo estructurar prompts
   - Estado actual del proyecto
   - Referencias de archivos
   
3. **TEMPLATE_PROMPTS.md**
   - 5 templates pre-formateados
   - Copiar/pegar listos para usar
   - Ejemplos funcionales
   
4. **PLAN_MAESTRO.md** (en `tms-client-vue/docs/`)
   - Roadmap 9 sesiones
   - Estado Sesión 1 y 2
   - Tareas Sesiones 3-9
   - Patrón a seguir

### Cómo Usar (Lectura recomendada)
```
1. Leer gemini-rules.md         (estructura y reglas)
2. Leer DOCUMENTACION_REFERENCIA.md (guía rápida)
3. Revisar TEMPLATE_PROMPTS.md  (copiar template adecuado)
4. Consultar PLAN_MAESTRO.md    (roadmap y sesión)
5. Enviar prompt con referencias a estos archivos
```

### En cada prompt a IA, incluir:
```
Contexto: 
- /tms-backend/gemini-rules.md (estructura, Docker)
- /tms-backend/DOCUMENTACION_REFERENCIA.md (referencias)
- /tms-backend/TEMPLATE_PROMPTS.md (template)
- /tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md (roadmap)

⚠️ IMPORTANTE - RUTAS ABSOLUTAS:
- Backend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
- Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue

Ejecutar Docker SIEMPRE desde raíz: 
/media/Datos/Projects/WebstormProjects/TrialManagementSystem
```

---

## 🔄 PRÓXIMOS PASOS

**Sesión 3**: CRUD Tratamientos
- Endpoints ya existen en backend
- Seguir patrón de Ensayos (ver PLAN_MAESTRO.md)
- Integrar con Productos
- Duración: 2-3 horas
- Ver TEMPLATE_PROMPTS.md (Template 3: Nueva Sesión)

---

**Última revisión**: Diciembre 11, 2025  
**Versión actual**: 2.1 (Actualizado con Docker y referencias cruzadas)  
**Mantenido por**: Sistema de gestión TMS  
**Documentos sincronizados**: gemini-rules.md + DOCUMENTACION_REFERENCIA.md + TEMPLATE_PROMPTS.md + PLAN_MAESTRO.md


