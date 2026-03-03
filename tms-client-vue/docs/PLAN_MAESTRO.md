# 🚀 PLAN MAESTRO TMS - ROADMAP ACTUALIZADO

**Actualizado**: Enero 29, 2026  
**Versión**: 3.0 - Sesión 4 completada + Correcciones Parcelas
**Estado Global**: ✅ Sesiones 1-4 Completadas - Listo para Mediciones en Campo

---

## 📍 RUTAS ABSOLUTAS (MI MÁQUINA)

```
Raíz Proyecto: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/
Backend:       /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend:      /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
```

---

## 📚 DOCUMENTACIÓN PRINCIPAL (Enero 2026)

Los siguientes documentos contienen el estado actual y plan de trabajo:

1. **STATUS_PROYECTO_ENERO_2026.md** - Estado actual del proyecto
   - Ubicación: `/tms-backend/STATUS_PROYECTO_ENERO_2026.md`
   
2. **TAREAS_PENDIENTES_GUIA.md** - Lista de tareas pendientes
   - Ubicación: `/tms-backend/TAREAS_PENDIENTES_GUIA.md`
   
3. **PLAN_MEDICIONES_CAMPO.md** - Plan detallado para mediciones
   - Ubicación: `/tms-backend/PLAN_MEDICIONES_CAMPO.md`
   
4. **gemini-rules.md** - Estructura, reglas, Docker
   - Ubicación: `/tms-backend/gemini-rules.md`

---

## 🐳 COMANDOS: EJECUTAR EN CONTENEDORES DOCKER

**⚠️ IMPORTANTE**: `npm install`, `npm start`, `npm run dev`, etc. deben ejecutarse **dentro de contenedores Docker**, NO en host local.

**⚠️ CRÍTICO**: Los comandos Docker deben ejecutarse desde **LA RAÍZ DEL PROYECTO**, NO desde `/tms-backend`

```
✅ CORRECTO:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

❌ INCORRECTO:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
```

**Razón**: El `docker-compose.frontend.yml` usa rutas relativas. Si ejecutas desde `/tms-backend`, resulta en ruta duplicada `/tms-backend/tms-backend`.

### Backend (NestJS + MySQL)
```bash
# ✅ CORRECTO: Ejecutar desde raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Iniciar servicios
docker-compose -f tms-backend/docker-compose.yml up -d

# Entrar al contenedor
docker-compose -f tms-backend/docker-compose.yml exec app bash

# Dentro: ejecutar npm
npm install
npm start
npm run build
```

### Frontend (Nuxt 3)
```bash
# ✅ CORRECTO: Ejecutar desde raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Iniciar servicios
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d

# Entrar al contenedor
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash

# Dentro: ejecutar npm
npm install
npm run dev
npm run build
```

**Ver más**: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md` (sección Docker)

---

## 📚 DOCUMENTACIÓN RELACIONADA (Mantener Sincronizados)

Estos 4 documentos están interconectados - incluir todos en prompts a IA:

1. **`gemini-rules.md`** - Estructura, reglas, Docker
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`
   
2. **`DOCUMENTACION_REFERENCIA.md`** - Guía rápida, referencias
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md`
   
3. **`TEMPLATE_PROMPTS.md`** - 5 templates listos
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`
   
4. **`PLAN_MAESTRO.md`** - Este archivo (Roadmap)
   - Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md`

**⚠️ Actualizar siempre estos 4 documentos juntos para mantener sincronización**

---



### ✅ SESIÓN 1 - Backend & Frontend Base (100% COMPLETADA)

**Objetivo**: Crear infraestructura base del sistema

**Lo que se hizo**:
- ✅ NestJS API con 50+ endpoints funcionales
- ✅ 22 tablas MySQL + Protocolo + UsuarioLaboratorio = 24 entidades
- ✅ Autenticación JWT (login, register, refresh token)
- ✅ 3 Roles: SUPERADMIN, ADMIN, TECNICO
- ✅ Nuxt 3 frontend con Pinia state management
- ✅ Autenticación completa en UI (login, logout, remember me)
- ✅ Middleware de protección de rutas
- ✅ Layout default con navbar responsive
- ✅ Dark mode / Light mode toggle
- ✅ Tailwind CSS configurado

**Endpoints API**:
```
Auth:         POST /login, /register, /refresh-token
Users:        CRUD usuarios
Laboratorios: GET catálogo
Productos:    GET catálogo
Catalogos:    Tipos ensayo, cultivos, variedades, siembras, protocolos
```

**Tecnología**:
- Backend: NestJS 11.x, TypeORM 0.3.x, MySQL 8.x
- Frontend: Nuxt 3, Vue 3, Pinia, TailwindCSS, TypeScript

**Status**: ✅ 100% Operativo - COMPLETADA

---

### ✅ SESIÓN 2 - CRUD Ensayos (100% COMPLETADA)

**Objetivo**: Crear funcionalidad completa CRUD para Ensayos con búsqueda avanzada

**Lo que se hizo**:

#### Backend (Completo)
- ✅ **DTOs**:
  - `CreateEnsayoDto` (20 campos con ejemplos en Swagger)
  - `UpdateEnsayoDto` (todos opcionales)
  - Campos de fecha: `fechaInicio`, `fechaSiembra`, `fechaCosecha` (ISO YYYY-MM-DD)
  - Nuevo campo: `codigoLabor` (string, max 50)
  
- ✅ **Endpoints CRUD**:
  - `POST /api/v1/ensayos` - Crear (20 campos, ejemplo completo Swagger)
  - `GET /api/v1/ensayos` - Listar con filtros avanzados
  - `GET /api/v1/ensayos/:id` - Detalle completo
  - `PATCH /api/v1/ensayos/:id` - Editar (ejemplo completo Swagger)
  - `DELETE /api/v1/ensayos/:id` - Eliminar

- ✅ **Búsqueda y Filtros**:
  - Búsqueda general (`q`) en 8 campos: nombreEnsayo, responsable, cultivo, variedad, tipoSiembra, laboratorio, status
  - Filtro específico: `laboratorio` (por nombre)
  - Filtro específico: `variedad` (por nombre)
  - **Rangos de fecha**: `fechaSiembraStart` y `fechaSiembraEnd` (YYYY-MM-DD)
  - Paginación: `page`, `limit`
  - Ordenamiento: `sort`, `order` (ASC/DESC)
  - Todos documentados en Swagger con `@ApiQuery`

- ✅ **Lógica SQL**:
  ```sql
  -- Búsqueda case-insensitive
  LOWER(e.nombreEnsayo) LIKE LOWER(:q)
  LOWER(responsable.nombre) LIKE LOWER(:q)
  ... (8 campos totales)
  
  -- Filtros específicos
  LOWER(laboratorio.nombre) LIKE LOWER(:laboratorio)
  LOWER(variedad.nombre) LIKE LOWER(:variedad)
  
  -- Rangos de fecha
  DATE(e.fechaSiembra) >= STR_TO_DATE(:fechaSiembraStart, "%Y-%m-%d")
  AND DATE(e.fechaSiembra) <= STR_TO_DATE(:fechaSiembraEnd, "%Y-%m-%d")
  ```

- ✅ **Documentación Swagger**:
  - @ApiTags, @ApiOperation, @ApiOkResponse
  - @ApiBody con ejemplos JSON completos
  - @ApiQuery para todos los parámetros
  - @ApiProperty en DTOs con descripciones
  - Roles documentados: TECNICO, ADMIN, SUPERADMIN

#### Frontend (Completo)
- ✅ **Pinia Store** (`stores/ensayos.ts`):
  - `fetchEnsayos(params)` - Con parámetros de búsqueda, filtros y fechas
  - `getEnsayo(id)` - Obtener detalle
  - `createEnsayo(data)` - Crear con 20 campos
  - `updateEnsayo(id, data)` - Editar
  - `deleteEnsayo(id)` - Eliminar
  - State: ensayos[], loading, error, meta (paginación)

- ✅ **Composable** (`composables/useEnsayos.ts`):
  - Funciones wrapper para UI
  - Manejo de errores
  - Toast notifications

- ✅ **Componentes**:
  - `EnsayoForm.vue` - Formulario 20 campos
    - Validación en tiempo real
    - Fields incluyen: nombreEnsayo, codigoLabor (con placeholder "26-BASF-0001-PRE-"), laboratorio, tipo ensayo, responsable, cultivo, variedad, tipoSiembra, ubicación (4 campos), coordenadas, distancia surcos, 3 fechas, protocolo, status
    - Dark mode completamente funcional
    
  - `EnsayoTable.vue` - Tabla con estilos profesionales
    - Responsive design
    - Botones Ver, Editar, Eliminar con colores y iconos
    - Mostrar: nombre, responsable, laboratorio, variedad, fecha siembra, estado

  - `dashboard/RecentEnsayos.vue` - Widget con filtros
    - 3 inputs: búsqueda + fecha inicio + fecha fin
    - Últimos 5 ensayos
    - Estilos idénticos a página de ensayos
    - Grid responsive (1 col mobile, 3 cols desktop)

- ✅ **Páginas**:
  - `/ensayos` - Listado completo
    - Grid 3 columnas: búsqueda, fecha inicio, fecha fin
    - Tabla con datos y acciones
    - Paginación
    - Ordenamiento clickeable en headers
    - Responsive: 1 col mobile, tabla completa desktop
    
  - `/ensayos/new` - Crear
    - Formulario 20 campos
    - Validación
    - Submit y cancel
    
  - `/ensayos/[id]` - Ver detalle
    - Mostrar todos los datos
    - Formato fecha DD/MM/YYYY (sin timezone issues)
    - Botones Ver, Editar, Eliminar
    
  - `/ensayos/[id]/edit` - Editar
    - Mismo formulario que create
    - Cargar datos existentes
    - Validación en submit

- ✅ **Búsqueda y Filtros en UI**:
  - Input búsqueda (texto libre en 8 campos)
  - Input fecha inicio (date picker HTML5)
  - Input fecha fin (date picker HTML5)
  - Búsqueda: se ejecuta con onChange en input
  - Filtros de fecha: se ejecutan con watch
  - Todos funcionan simultáneamente sin conflicto

- ✅ **Estilos y UX**:
  - Botones con colores: Ver (azul), Editar (amarillo), Eliminar (rojo)
  - Botones con iconos: 👁️, ✏️, 🗑️
  - Hover effects en botones
  - Inputs con focus ring azul
  - Labels claras y descriptivas
  - Mensajes de error/éxito toast
  - Dark mode completo

#### Base de Datos (Actualizaciones)
- ✅ Tabla `Ensayo`:
  - Nuevo campo: `codigoLabor` VARCHAR(50) nullable
  - Campos de fecha: `fecha_inicio`, `fecha_siembra`, `fecha_cosecha` tipo DATE
  - Todos con índices para búsqueda eficiente
  - Foreign keys: laboratorio, protocolo, responsable, cultivo, variedad, tipoSiembra

- ✅ Tabla `Cultivo_Variedad`:
  - Nueva tabla agregada en S2
  - Relación muchos-a-muchos con Ensayo
  - Usado en filtros

#### Documentación (Actualizada)
- ✅ `STATUS_SESION_2.md` - Detalles completos
- ✅ `GUIA_ENSAYOS_CRUD.md` - Guía paso a paso
- ✅ Swagger actualizado con ejemplos
- ✅ Backend verificación (`BACKEND_VERIFICATION_COMPLETE.md`)

**Compatibilidad**:
- ✅ Frontend-Backend: 100% sincronizado
- ✅ DTOs con ejemplos JSON completos
- ✅ Campos de fecha: ISO en BD/API, DD/MM en UI
- ✅ Filtros funcionales en ambos lados

**Status**: ✅ 100% Operativo - COMPLETADA

---

## 📋 PRÓXIMAS SESIONES (Roadmap)

### 🟨 SESIÓN 3 - Protocolos & Tratamientos (EN PROGRESO)

**Objetivo Fase 1**: ✅ CRUD Protocolos (COMPLETADO)
**Objetivo Fase 2**: 📅 CRUD Tratamientos (PRÓXIMA)

**✅ FASE 1 COMPLETADA (Diciembre 12)**:
- ✅ Store `protocolos.ts` con CRUD completo
- ✅ Componente `ProtocoloList.vue` - UI responsiva desktop/mobile
- ✅ Modal crear/editar protocolo
- ✅ Búsqueda + paginación + filtros (sort, order)
- ✅ 5 endpoints CRUD Protocolos con Swagger
- ✅ Roles: ADMIN, SUPERADMIN, MANAGER (según endpoint)
- ✅ 0 TypeScript errors
- ✅ 0 Vite warnings
- ✅ Dark mode soportado
- ✅ Documentación: SESION_3_PROTOCOLO_FIX.md, STATUS_SESION_3.md, CHECKLIST_SESION_3.md

**📅 FASE 2 PRÓXIMA (Sesión 3 continuación)**:
- [ ] Crear store `tratamientos.ts` (✅ base existe)
  - Completar fetchTratamientos con filtros avanzados
  - Agregar métodos para relación con productos

- [ ] Crear componente `TratamientoList.vue`
  - Tabla responsiva + tarjetas mobile
  - Modal crear/editar
  - Búsqueda + filtros

- [ ] Componente `TratamientoForm.vue`
  - Formulario con protocolo select
  - Validaciones según es_testigo

- [ ] Gestión de Productos
  - Relación M:N TratamientoProducto
  - Modal agregar productos
  - **⭐ NUEVO**: Campo `estadio` (V2, V3, V4...)

- [ ] Integración:
  - [ ] Búsqueda por número, descripción, tipo
  - [ ] Filtro por protocolo
  - [ ] Productos en tratamientos
  - [ ] Validaciones según es_testigo (sin productos si testigo)

**Endpoints implementados**:
```
POST   /api/v1/protocolos           ✅ Full
GET    /api/v1/protocolos           ✅ Full
GET    /api/v1/protocolos/:id       ✅ Full
PATCH  /api/v1/protocolos/:id       ✅ Full
DELETE /api/v1/protocolos/:id       ✅ Full

POST   /api/v1/tratamientos         📅 Backend ready
GET    /api/v1/tratamientos         📅 Backend ready
GET    /api/v1/tratamientos/:id     📅 Backend ready
PATCH  /api/v1/tratamientos/:id     📅 Backend ready
DELETE /api/v1/tratamientos/:id     📅 Backend ready
POST   /api/v1/tratamientos/:id/productos  📅 Pendiente UI
GET    /api/v1/productos            ✅ Disponible
GET    /api/v1/protocolos           ✅ Disponible
```

**Backend Status**: 
- ✅ Entidad `Tratamiento` lista
- ✅ Entidad `TratamientoProducto` lista
- ✅ Endpoints CRUD funcionales
- ✅ DTOs definidos

**Frontend Status (Fase 1)**:
- ✅ Store protocolos funcional
- ✅ Store tratamientos base
- ✅ Componente ProtocoloList responsivo
- ⏳ Componentes Tratamiento (próxima)

**Documentación Relacionada**:
- `/tms-backend/SESION_3_PROTOCOLO_FIX.md` - Qué se hizo
- `/tms-backend/STATUS_SESION_3.md` - Estado actual
- `/tms-backend/CHECKLIST_SESION_3.md` - Validaciones
- `/tms-backend/gemini-rules.md` - Reglas y Docker

### ✅ SESIÓN 2 - CRUD Ensayos (COMPLETADA)

**Objetivo**: Gestión completa de ensayos

**Lo que se hizo**:
- ✅ Store `ensayos.ts` con métodos CRUD
- ✅ Composable `useEnsayos.ts` para UI
- ✅ Componentes: `EnsayoForm.vue`, `EnsayoTable.vue`
- ✅ Páginas: listado, crear, editar, ver detalle
- ✅ Búsqueda: 8 campos + laboratorio + variedad + rango fechas
- ✅ Validación: 20 campos con class-validator
- ✅ Estilos: botones, iconos, responsive
- ✅ Swagger documentado

**Estado**: 100% Operativo

---

### 📅 SESIÓN 4 - Diseño Experimental (Bloques, Parcelas)

**Objetivo**: Estructurar ensayos en bloques y parcelas

**Tareas**:
- [ ] CRUD Bloques
- [ ] CRUD Parcelas
- [ ] Relaciones: Ensayo → Bloques → Parcelas
- [ ] UI responsiva

**Estimación**: 2-3 horas

---

### 📅 SESIÓN 5 - Datos de Campo

**Objetivo**: Registrar datos de campo y cosecha

**Tareas**:
- [ ] CRUD DatosCampo
- [ ] Mediciones por variable
- [ ] Aplicaciones de tratamientos
- [ ] Cosecha
- [ ] Upload de fotos

**Estimación**: 3-4 horas

---

### 📅 SESIÓN 6 - Reportes

**Objetivo**: Generación de reportes (PDF, CSV)

**Tareas**:
- [ ] Reportes PDF
- [ ] Exportación CSV
- [ ] Gráficos (Chart.js)

**Estimación**: 3 horas

---

### 📅 SESIÓN 7 - Dashboard Mejorado

**Objetivo**: Dashboard con widgets

**Tareas**:
- [ ] Widgets de KPIs
- [ ] Gráficos resumen
- [ ] Calendario de eventos

**Estimación**: 2-3 horas

---

### 📅 SESIÓN 8 - Admin Panel

**Objetivo**: Gestión de usuarios y configuración

**Tareas**:
- [ ] Panel de control
- [ ] Gestión de roles
- [ ] Logs de auditoría

**Estimación**: 2-3 horas

---

### 📅 SESIÓN 9 - Polish & Testing

**Objetivo**: Pulir y testear aplicación

**Tareas**:
- [ ] Testing unitario
- [ ] Testing E2E
- [ ] Optimización de performance
- [ ] Documentación final

**Estimación**: 3-4 horas
````
- ⬜ Todo por crear

**Duración estimada**: 2-3 horas

---

### 📅 SESIÓN 4 - Diseño Experimental

**Objetivo**: Crear gestión de bloques, parcelas y asignación de tratamientos

**Tareas**:
- [ ] Stores: `bloques.ts`, `parcelas.ts`
- [ ] Componentes: Tablas, formularios
- [ ] Páginas: CRUD Bloques, CRUD Parcelas
- [ ] Asignar tratamientos a parcelas
- [ ] Visualización grid/mapa (opcional)
- [ ] Drag & drop (opcional)

**Endpoints**:
```
GET    /api/v1/bloques
POST   /api/v1/bloques
PATCH  /api/v1/bloques/:id
GET    /api/v1/parcelas
POST   /api/v1/parcelas
PATCH  /api/v1/parcelas/:id
GET    /api/v1/ensayos/:id/bloques
GET    /api/v1/bloques/:id/parcelas
```

**Duración estimada**: 3-4 horas

---

### 📅 SESIÓN 5 - Carga de Datos de Campo

**Objetivo**: Crear formularios para registrar mediciones, fotos y observaciones

**Tareas**:
- [ ] Store: `datoscampo.ts`
- [ ] Componentes: Formulario mediciones, upload fotos
- [ ] Páginas: Registro de datos por parcela/tratamiento
- [ ] Variables por protocolo
- [ ] Fechas y momentos de evaluación
- [ ] Observaciones y notas

**Endpoints**:
```
GET    /api/v1/datos-campo
POST   /api/v1/datos-campo
GET    /api/v1/datos-campo/:id
GET    /api/v1/fotos
POST   /api/v1/fotos
GET    /api/v1/protocolo-variables
GET    /api/v1/momentos-evaluacion
```

**Duración estimada**: 3-4 horas

---

### 📅 SESIÓN 6 - Reportes y Análisis

**Objetivo**: Crear visualización y exportación de datos

**Tareas**:
- [ ] Tabla datos con filtros avanzados
- [ ] Gráficos básicos (Chart.js)
- [ ] Exportar a CSV (Papa Parse)
- [ ] Exportar a PDF (jsPDF)
- [ ] Resumen estadístico
- [ ] Comparativas entre tratamientos

**Librerías a agregar**:
```bash
npm install chart.js vue-chartjs
npm install jspdf html2pdf
npm install papaparse
```

**Duración estimada**: 3-4 horas

---

### 📅 SESIÓN 7 - Dashboard Mejorado

**Objetivo**: Crear dashboard ejecutivo con resúmenes

**Tareas**:
- [ ] Tarjetas resumen (ensayos activos, en ejecución, completados)
- [ ] Gráficos últimos ensayos
- [ ] Timeline de actividades
- [ ] Accesos rápidos a funciones principales
- [ ] Notificaciones de eventos

**Duración estimada**: 2-3 horas

---

### 📅 SESIÓN 8 - Admin Panel

**Objetivo**: Crear gestión de usuarios y laboratorios

**Tareas**:
- [ ] CRUD usuarios (crear, editar, eliminar, asignar laboratorios)
- [ ] CRUD laboratorios (crear, editar, eliminar)
- [ ] Asignación usuario-laboratorio
- [ ] Gestión de roles
- [ ] Logs de actividad

**Duración estimada**: 3-4 horas

---

### 📅 SESIÓN 9 - Mejoras y Polish

**Objetivo**: Refinamiento final y pulido

**Tareas**:
- [ ] Testing completo
- [ ] Optimización performance
- [ ] Responsive design refinado en todas las páginas
- [ ] Animaciones y transiciones
- [ ] Temas de color adicionales
- [ ] Accesibilidad (WCAG)
- [ ] SEO básico (meta tags)

**Duración estimada**: 3-4 horas

---

## 🎯 ESTRUCTURA DE CARPETAS FINAL

### Backend `/src`
```
src/
├── main.ts                          # Entry point
├── app.module.ts
├── app.controller.ts
├── app.service.ts
│
├── auth/                            # ✅ S1
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/
│   ├── decorators/
│   ├── strategies/
│   └── dto/
│
├── users/                           # ✅ S1
├── laboratorios/                    # ✅ S1 (catálogo)
├── productos/                       # ✅ S1 (catálogo)
│
├── ensayos/                         # ✅ S2
│   ├── ensayos.controller.ts        # Documentado Swagger
│   ├── ensayos.service.ts           # Con filtros fecha
│   ├── ensayos.module.ts
│   └── dto/
│       ├── create-ensayo.dto.ts
│       └── update-ensayo.dto.ts
│
├── tratamientos/                    # 📅 S3
├── tratamientos-producto/           # 📅 S3
├── bloques/                         # 📅 S4
├── parcelas/                        # 📅 S4
├── aplicaciones/                    # 📅 S5
├── datos-campo/                     # 📅 S5
├── datos-cosecha/                   # 📅 S5
├── fotos/                           # 📅 S5
│
├── protocolo-variables/             # ✅ S1
├── protocolos/                      # ✅ S1
├── momentos/                        # ✅ S1
├── catalogos/                       # ✅ S1
│
├── entities/                        # 24 TypeORM entities
├── common/                          # DTOs comunes, utilities
├── database/                        # Config TypeORM
└── locations/                       # Ubicaciones
```

### Frontend `/tms-client-vue`
```
tms-client-vue/
├── pages/
│   ├── index.vue                    # Dashboard ✅ (S1/S2)
│   ├── login.vue                    # Login ✅ (S1)
│   ├── reset-password.vue           # Reset ✅ (S1)
│   │
│   ├── ensayos/                     # ✅ S2 (CRUD Completo)
│   │   ├── index.vue                # Listado con filtros
│   │   ├── new.vue                  # Crear
│   │   ├── [id].vue                 # Ver detalle
│   │   └── [id]/edit.vue            # Editar
│   │
│   ├── tratamientos/                # 📅 S3
│   ├── bloques/                     # 📅 S4
│   ├── parcelas/                    # 📅 S4
│   ├── aplicaciones/                # 📅 S5
│   ├── datoscampo/                  # 📅 S5
│   ├── reportes/                    # 📅 S6
│   ├── admin/                       # 📅 S8
│   │   ├── usuarios/
│   │   └── laboratorios/
│   └── dashboard/                   # 📅 S7
│
├── components/
│   ├── dashboard/                   # ✅ S2
│   │   ├── RecentEnsayos.vue        # Con filtros fecha
│   │   └── ...
│   │
│   └── ensayos/                     # ✅ S2
│       ├── EnsayoForm.vue           # 20 campos
│       ├── EnsayoTable.vue          # Con estilos
│       └── ...
│
├── stores/
│   ├── auth.ts                      # ✅ S1
│   └── ensayos.ts                   # ✅ S2
│
├── composables/
│   ├── useApi.ts                    # ✅ S1
│   ├── useTheme.ts                  # ✅ S1
│   └── useEnsayos.ts                # ✅ S2
│
├── middleware/
│   └── auth.ts                      # ✅ S1
│
├── layouts/
│   ├── default.vue                  # ✅ S1
│   └── blank.vue                    # ✅ S1
│
├── assets/
│   └── css/main.css                 # ✅ S1
│
├── docs/
│   ├── PLAN_MAESTRO.md              # Este archivo
│   ├── STATUS_SESION_2.md           # ✅ Completa
│   ├── GUIA_ENSAYOS_CRUD.md
│   └── ...
│
├── nuxt.config.ts
├── package.json                     # Nuxt 3.9+, Vue 3.4+, Pinia
├── tsconfig.json
├── tailwind.config.ts
└── .env
```

---

## 📊 MATRIZ DE FUNCIONALIDADES

| Funcionalidad | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 |
|---|---|---|---|---|---|---|---|---|---|
| Autenticación | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔧 | 🔧 | ✅ |
| **CRUD Ensayos** | | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Búsqueda Ensayos | | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Filtros Fecha | | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **CRUD Tratamientos** | | | 🔧 | 🔧 | 🔧 | 🔧 | 🔧 | ✅ | ✅ |
| **Diseño Experimental** | | | | 🔧 | 🔧 | 🔧 | ✅ | ✅ | ✅ |
| **Datos de Campo** | | | | | 🔧 | 🔧 | ✅ | ✅ | ✅ |
| Reportes | | | | | | 🔧 | 🔧 | ✅ | ✅ |
| Admin Panel | | | | | | | | 🔧 | ✅ |
| Testing | | | | | | | | | 🔧 |

**Leyenda**: ✅ Funcional | 🔧 En desarrollo | ⬜ No empezado

---

## 📊 CAMBIOS DETECTADOS POR SESIÓN

### ✅ Sesión 1
- 22 tablas base + 2 nuevas (Protocolo, UsuarioLaboratorio)
- 24 entidades TypeORM
- Autenticación JWT completa
- 50+ endpoints

### ✅ Sesión 2
- **Tablas**: Cultivo_Variedad (nueva), índices en Ensayo
- **Campos Ensayo**: `codigoLabor` (new), `fechaInicio`, `fechaSiembra`, `fechaCosecha` (tipo DATE)
- **Búsqueda**: 8 campos case-insensitive + laboratorio específico + variedad específica
- **Filtros Fecha**: `fechaSiembraStart` y `fechaSiembraEnd` (rango)
- **DTOs**: Ejemplos JSON completos en Swagger
- **UI**: Componentes, pages, forms, tables con estilos profesionales
- **Validación**: Frontend + Backend

### ✅ Sesión 3
- **Frontend**: 4 componentes nuevos (ProtocoloList, ProtocoloForm, TratamientoForm, ProductosTratamiento)
- **Stores**: Reescritos completamente (protocolos.ts, tratamientos.ts)
- **Composables**: 2 nuevos (useProtocolos.ts, useTratamientos.ts)
- **Diseño**: Mobile-first tarjetas (sin tablas), expandible
- **Funcionalidad**: Gestión completa Protocolos + Tratamientos + Productos
- **Búsqueda**: Por nombre, protocolo, testigo
- **Validación**: Formularios con validación HTML5 + lógica

### 📅 Sesión 4+
- Nuevas tablas para Bloques, Parcelas, DatosCampo, etc.
- Nuevas pages y componentes
- Más búsquedas avanzadas
- Reportes y gráficos

---

## 🔄 PATRÓN A SEGUIR (Desde S3)

Para cada nueva sesión de CRUD:

1. **Backend** (Ya existe, solo documentar si falta):
   - ✅ Entidad TypeORM
   - ✅ Controller con @ApiTags, @ApiOperation
   - ✅ Service con lógica
   - ✅ DTO con ejemplos
   - ✅ Endpoints CRUD documentados

2. **Frontend**:
   - [ ] Crear store `[entidad].ts`
   - [ ] Crear composable `use[Entidad].ts`
   - [ ] Crear componentes (Form, Table)
   - [ ] Crear pages (list, new, [id], [id]/edit)
   - [ ] Integrar búsqueda y filtros
   - [ ] Aplicar estilos (TailwindCSS, dark mode)
   - [ ] Validar sincronización backend-frontend

3. **Documentación**:
   - [ ] STATUS_SESION_[N].md
   - [ ] GUIA_[ENTIDAD]_CRUD.md
   - [ ] Actualizar PLAN_MAESTRO.md

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Backend
```json
{
  "framework": "NestJS 11.x",
  "language": "TypeScript 5.3+",
  "orm": "TypeORM 0.3.x",
  "database": "MySQL 8.x",
  "auth": "JWT (@nestjs/jwt, passport-jwt)",
  "validation": "class-validator, class-transformer",
  "docs": "Swagger (@nestjs/swagger)",
  "env": "@nestjs/config"
}
```

### Frontend
```json
{
  "framework": "Nuxt 3.9+",
  "ui": "Vue 3.4+",
  "state": "Pinia 2.1+",
  "http": "Nuxt $fetch (axios compatible)",
  "css": "TailwindCSS 3.3+",
  "language": "TypeScript 5.3+",
  "icons": "Emoji (👁️ ✏️ 🗑️)"
}
```

### Próximas (S3+)
```json
{
  "charts": "Chart.js 4.x, vue-chartjs 5.x",
  "export": "jsPDF 2.x, html2pdf 0.10.x",
  "csv": "papaparse 5.x",
  "drag": "vue-draggable-next 2.x"
}
```

---

## 📈 MÉTRICAS PROYECTO

| Métrica | Actual | Final Estimado |
|---------|--------|---|
| Sesiones | 2/9 | 9 |
| Entidades | 24 | 30+ |
| Endpoints | 50+ | 100+ |
| Páginas | 4 | 20+ |
| Componentes | 10 | 40+ |
| Stores | 1 | 7 |
| Composables | 3 | 10+ |
| Líneas código | 10,000+ | 20,000+ |
| Duración | 10h | 25-30h |

---

## ✅ CHECKLIST DE CALIDAD

### Código
- ✅ TypeScript tipado estricto
- ✅ ESLint/Prettier configurado
- ✅ Nomenclatura consistente
- ✅ Comentarios en código complejo
- ✅ DTOs con validación

### Testing
- ✅ Testing manual en desarrollo
- ✅ Validación de formularios
- ✅ Responsive en mobile/tablet/desktop
- ✅ Dark mode funcionando
- ✅ Sin errores en consola

### Documentación
- ✅ README actualizado
- ✅ Swagger completo (backend)
- ✅ Comments en código
- ✅ STATUS_SESION_[N].md
- ✅ GUIA_[FEATURE].md

### Performance
- ✅ Índices en tablas searchables
- ✅ Paginación implementada
- ✅ Lazy loading en componentes
- ✅ Caché de datos (si aplica)

---

## 🚀 INSTRUCCIONES PARA IA ASSISTANTS

### Antes de Empezar
1. Leer `gemini-rules.md` (este directorio raíz)
2. Leer `PLAN_MAESTRO.md` (este archivo)
3. Leer `STATUS_SESION_[N].md` (estado actual)
4. Revisar estructura de carpetas anterior

### Durante Desarrollo
1. Seguir convenciones de nomenclatura
2. Documentar en Swagger (backend)
3. Tipado completo (TypeScript)
4. Testing mientras desarrollas
5. Commits limpios

### Al Finalizar
1. Actualizar documentación
2. Testing manual completo
3. Verificar no hay errores console
4. Hacer commit
5. Actualizar STATUS_SESION_[N].md

---

## 📝 DOCUMENTACIÓN POR SESIÓN

```
📂 Backend
├── README.md
├── ACTUALIZACION_SQL_BACKEND_SWAGGER.md
├── BACKEND_VERIFICATION_COMPLETE.md
├── REGENERAR_DOCUMENTACION.md
├── gemini-rules.md                     ← NUEVO (Este documento raíz)
└── docs/openapi.json

📂 Frontend (tms-client-vue)
├── docs/
│   ├── PLAN_MAESTRO.md                 ← ACTUALIZADO (Sesión 2)
│   ├── STATUS_SESION_1.md              (Completada)
│   ├── STATUS_SESION_2.md              (Completada)
│   ├── GUIA_ENSAYOS_CRUD.md
│   ├── ARQUITECTURA_FRONTEND.md
│   └── PLAN_SESION_3.md                (Próximo)
```

---

## 🎯 SESIÓN 3 COMPLETADA ✅

### ✅ SESIÓN 3 - CRUD Protocolos y Tratamientos (100% COMPLETADA)

**Fecha**: Diciembre 12, 2025  
**Duración Real**: 1 sesión  
**Dificultad**: Media  
**Completitud**: ✅ 100%

**Lo que se implementó**:

#### Backend
- ✅ DTOs: CreateTratamientoDto, UpdateTratamientoDto
- ✅ DTOs: CreateTratamientoProductoDto con estadio
- ✅ Endpoints CRUD (5 + 3)
- ✅ Búsqueda/filtros
- ✅ Swagger documentado

#### Frontend
- ✅ `stores/protocolos.ts` (nuevo)
- ✅ `stores/tratamientos.ts` (reescrito)
- ✅ `composables/useProtocolos.ts` (nuevo)
- ✅ `composables/useTratamientos.ts` (nuevo)
- ✅ Componentes:
  - ProtocoloList.vue (tarjetas expandibles)
  - ProtocoloForm.vue (modal)
  - TratamientoForm.vue (con productos)
  - ProductosTratamiento.vue (gestión inline)
- ✅ Páginas: /protocolos/, /protocolos/[id].vue
- ✅ Búsqueda, filtros, paginación
- ✅ Mobile-first (tarjetas, sin tablas)

#### Diseño
- ✅ Tarjetas expandibles
- ✅ Tratamientos numerados (1..N)
- ✅ Testigo con badge
- ✅ Productos con dosis + estadio
- ✅ Responsive mobile/tablet/desktop
- ✅ Dark mode soportado

**Documentación**:
- ✅ SESION_3_DOCUMENTACION.md

---

## 🏁 CONCLUSIÓN

### Estado Actual
- ✅ Backend: 50+ endpoints, 24 entidades, documentado
- ✅ Frontend: 2 sesiones completadas (Auth, CRUD Ensayos)
- ✅ Base de datos: Sincronizada, optimizada
- ✅ Documentación: Completa y actualizada

### Listos Para
- ✅ Sesión 3 (CRUD Tratamientos)
- ✅ Escalabilidad (patrón establecido)
- ✅ Mantenimiento (documentación clara)
- ✅ Colaboración (reglas definidas)

### Visión Final
Sistema profesional, escalable, production-ready con:
- 9 sesiones planificadas
- 100+ endpoints API
- 20+ páginas UI
- Full CRUD para ensayos, tratamientos, diseño experimental
- Reportes y análisis
- Admin panel
- Testing completo

---

**Última actualización**: Diciembre 11, 2025  
**Versión**: 2.1 (Con Docker + Referencias Cruzadas)  
**Mantenido por**: Sistema TMS  
**Próxima revisión**: Sesión 3 (Tratamientos)

---

## 📞 REFERENCIAS DIRECTAS

**Documentos sincronizados** (Incluir todos en prompts):
- `gemini-rules.md` (/tms-backend/)
- `DOCUMENTACION_REFERENCIA.md` (/tms-backend/)
- `TEMPLATE_PROMPTS.md` (/tms-backend/)
- `PLAN_MAESTRO.md` (Este archivo - /tms-client-vue/docs/)

¡Listo para continuar! 🚀

