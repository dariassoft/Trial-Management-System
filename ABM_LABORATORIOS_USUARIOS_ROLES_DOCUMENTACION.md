# 📋 ABM LABORATORIOS, USUARIOS Y ROLES - IMPLEMENTACIÓN COMPLETADA

**Fecha:** 11/02/2026  
**Estado:** ✅ IMPLEMENTADO Y DOCUMENTADO

---

## 📊 RESUMEN GENERAL

Se han implementado **3 ABM completos** (Altas, Bajas, Modificaciones) siguiendo la arquitectura y patrones del proyecto:

1. **ROLES** - Gestión de roles del sistema
2. **USUARIOS** - Gestión de usuarios con asignación de laboratorios
3. **LABORATORIOS** - Gestión de laboratorios con información extendida

---

## 🔧 BACKEND (NestJS)

### 1. ROLES Module

**Ubicación:** `/src/roles/`

#### Archivos Creados:
- `roles.controller.ts` - Controlador con endpoints CRUD + Swagger
- `roles.service.ts` - Lógica de negocio con paginación y búsqueda
- `roles.module.ts` - Módulo de NestJS
- `dto/create-rol.dto.ts` - DTO para creación
- `dto/update-rol.dto.ts` - DTO para actualización (PartialType)

#### Endpoints:
```
POST    /api/v1/roles              - Crear rol
GET     /api/v1/roles              - Listar roles (paginado, con búsqueda)
GET     /api/v1/roles/:id          - Obtener rol por ID
PATCH   /api/v1/roles/:id          - Actualizar rol
DELETE  /api/v1/roles/:id          - Eliminar rol
```

#### Características:
- ✅ Control de acceso: `@Roles(ADMIN, SUPERADMIN)`
- ✅ Paginación: `page`, `limit`, `sort`, `order`
- ✅ Búsqueda: por nombre y descripción
- ✅ Validación: nombre único, descripción máx 500 caracteres
- ✅ Prevención de eliminación: no permite eliminar si hay usuarios asignados
- ✅ Swagger completo con ejemplos

### 2. USUARIOS Module (MEJORADO)

**Ubicación:** `/src/users/`

#### Archivos Modificados:
- `users.controller.ts` - Swagger mejorado
- `users.service.ts` - Ya completado con toda la lógica
- `dto/create-user.dto.ts` - DTOs actualizados
- `dto/update-user.dto.ts` - DTOs actualizados
- `users.module.ts` - Ya registrado en app.module

#### Endpoints:
```
POST    /api/v1/users              - Crear usuario
GET     /api/v1/users              - Listar usuarios (paginado, con búsqueda)
GET     /api/v1/users/:id          - Obtener usuario por ID
PATCH   /api/v1/users/:id          - Actualizar usuario
DELETE  /api/v1/users/:id          - Eliminar usuario
POST    /api/v1/users/:id/laboratorios     - Asignar laboratorios
DELETE  /api/v1/users/:id/laboratorios/:labId - Quitar laboratorio
```

#### Características:
- ✅ Control de acceso: `@Roles(ADMIN, SUPERADMIN)`
- ✅ Paginación y búsqueda
- ✅ Hashing de contraseña con bcrypt
- ✅ Relación con laboratorios
- ✅ Filtros por rol y estado activo
- ✅ Swagger completo

### 3. LABORATORIOS Module (MEJORADO)

**Ubicación:** `/src/laboratorios/`

#### Archivos Modificados:
- `entities/laboratorio.entity.ts` - Campos adicionales (descripción, dirección, teléfono, email, contacto, estado)
- `laboratorios.controller.ts` - Swagger mejorado
- `laboratorios.service.ts` - Búsqueda y filtros mejorados
- `dto/create-laboratorio.dto.ts` - DTOs con nuevos campos
- `dto/update-laboratorio.dto.ts` - PartialType creado

#### Endpoints:
```
POST    /api/v1/laboratorios       - Crear laboratorio
GET     /api/v1/laboratorios       - Listar (paginado, búsqueda, filtro activo)
GET     /api/v1/laboratorios/:id   - Obtener laboratorio por ID
PATCH   /api/v1/laboratorios/:id   - Actualizar laboratorio
DELETE  /api/v1/laboratorios/:id   - Eliminar laboratorio
```

#### Características:
- ✅ Campos extendidos: descripción, dirección, teléfono, email, contacto
- ✅ Control de acceso: `@Roles(MANAGER, ADMIN, SUPERADMIN)`
- ✅ Paginación y búsqueda mejorada
- ✅ Filtro por estado activo
- ✅ Validación de nombre único
- ✅ Prevención de eliminación si tiene usuarios asignados
- ✅ Timestamps automáticos (createdAt, updatedAt)

### 4. app.module.ts (ACTUALIZADO)

```typescript
// Agregado:
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    // ... otros módulos
    RolesModule, // Nuevo - ABM de Roles
    // ...
  ],
})
```

---

## 🎨 FRONTEND (Nuxt 3 + Vue 3)

### 1. STORES (Pinia)

**Ubicación:** `/tms-client-vue/stores/`

#### `roles.ts`
- Estado: `roles`, `currentRol`, `loading`, `error`, `total`, `currentPage`, `pageSize`, `filtros`
- Métodos: `fetchRoles()`, `fetchRolById()`, `createRol()`, `updateRol()`, `deleteRol()`, `setCurrentPage()`

#### `usuarios.ts`
- Estado: `usuarios`, `currentUsuario`, `loading`, `error`, `total`, `currentPage`, `pageSize`, `filtros`
- Métodos: `fetchUsuarios()`, `fetchUsuarioById()`, `createUsuario()`, `updateUsuario()`, `deleteUsuario()`, `asignarLaboratorios()`, `quitarLaboratorio()`, `setCurrentPage()`

#### `laboratorios.ts`
- Estado: `laboratorios`, `currentLaboratorio`, `loading`, `error`, `total`, `currentPage`, `pageSize`, `filtros`
- Métodos: `fetchLaboratorios()`, `fetchLaboratorioById()`, `createLaboratorio()`, `updateLaboratorio()`, `deleteLaboratorio()`, `setCurrentPage()`

### 2. COMPONENTES

**Ubicación:** `/tms-client-vue/components/`

#### Roles (`components/roles/`)
- `RolesList.vue` - Listado con tabla desktop + tarjetas mobile, búsqueda, ordenamiento, paginación
- `RoleForm.vue` - Modal para crear/editar roles

#### Usuarios (`components/usuarios/`)
- `UsuariosList.vue` - Listado con tabla desktop + tarjetas mobile
- `UsuarioForm.vue` - Modal con asignación de laboratorios, gestión de rol, estado activo

#### Laboratorios (`components/laboratorios/`)
- `LaboratoriosList.vue` - Listado con tarjetas, búsqueda, ordenamiento, paginación
- `LaboratorioForm.vue` - Modal con todos los campos (descripción, dirección, teléfono, email, contacto)

#### Común (`components/common/`)
- `ConfirmDeleteModal.vue` - Modal reutilizable para confirmar eliminaciones

### 3. PÁGINAS

**Ubicación:** `/tms-client-vue/pages/admin/`

```
pages/
├── admin/
│   ├── roles.vue
│   ├── usuarios.vue
│   └── laboratorios.vue
```

Cada página:
- Importa su componente List correspondiente
- Aplica middleware de autenticación
- Responsive (mobile-first)

### 4. MENÚ DE NAVEGACIÓN (ACTUALIZADO)

**Archivo:** `components/navigation/ModuleMenu.vue`

Nuevos módulos agregados:
```typescript
{
  id: 'laboratorios',
  name: 'Laboratorios',
  icon: '🏭',
  href: '/admin/laboratorios',
  roles: ['Superadministrador', 'Administrador'],
},
{
  id: 'usuarios',
  name: 'Usuarios',
  icon: '👥',
  href: '/admin/usuarios',
  roles: ['Superadministrador', 'Administrador'],
},
{
  id: 'roles',
  name: 'Roles',
  icon: '🔐',
  href: '/admin/roles',
  roles: ['Superadministrador'],
},
```

---

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

### Backend
- ✅ Entities con relaciones TypeORM
- ✅ DTOs con validación (class-validator)
- ✅ Services con lógica de negocio
- ✅ Controllers con endpoints RESTful
- ✅ Decorador @Roles para control de acceso
- ✅ Paginación completa (page, limit, sort, order)
- ✅ Búsqueda con query string `q`
- ✅ Swagger con ejemplos
- ✅ Manejo de errores (400, 404, etc)
- ✅ Validación de integridad referencial

### Frontend
- ✅ Stores Pinia con composables
- ✅ useApi para llamadas HTTP
- ✅ Componentes responsive (Tailwind)
- ✅ Tablas desktop + tarjetas mobile
- ✅ Modales para formularios
- ✅ Búsqueda y filtros
- ✅ Paginación
- ✅ Confirmación de eliminaciones
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Integración en menú de navegación

---

## 📝 ESTRUCTURA DE DATOS

### ROLES
```
{
  id: number
  nombre: 'Superadministrador' | 'Administrador' | 'Manager' | 'Tecnico' | 'Invitado'
  descripcion: string | null
  usuariosCount: number
}
```

### USUARIOS
```
{
  id: number
  username: string (email)
  nombre: string | null
  apellido: string | null
  telefono: string
  fecha_nacimiento: date | null
  esta_activo: boolean
  rol: { id, nombre }
  laboratoriosAsignados: [{ id, laboratorio: { id, nombre } }]
}
```

### LABORATORIOS
```
{
  id: number
  nombre: string (unique)
  descripcion: string | null
  direccion: string | null
  telefono: string | null
  email: string | null
  contacto: string | null
  esta_activo: boolean
  createdAt: datetime
  updatedAt: datetime
}
```

---

## 🔐 CONTROL DE ACCESO

| Endpoint | SUPERADMIN | ADMIN | MANAGER | Técnico | Invitado |
|----------|:----------:|:-----:|:-------:|:-------:|:--------:|
| /roles GET | ✅ | ✅ | ❌ | ❌ | ❌ |
| /roles POST/PATCH/DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |
| /users GET | ✅ | ✅ | ❌ | ❌ | ❌ |
| /users POST/PATCH/DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |
| /laboratorios GET | ✅ | ✅ | ✅ | ✅ | ✅* |
| /laboratorios POST/PATCH/DELETE | ✅ | ✅ | ✅ | ❌ | ❌ |

*Invitado: solo laboratorios asignados

---

## 🧪 PRUEBAS RECOMENDADAS

### Backend
```bash
# Crear rol
POST /api/v1/roles
{
  "nombre": "Administrador",
  "descripcion": "Acceso administrativo completo"
}

# Listar roles con búsqueda
GET /api/v1/roles?page=1&limit=10&q=admin&sort=nombre&order=ASC

# Crear usuario con laboratorios
POST /api/v1/users
{
  "username": "user@example.com",
  "password": "S3gura123",
  "rolId": 2,
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "3875789133",
  "laboratorioIds": [1, 2]
}

# Asignar laboratorios a usuario existente
POST /api/v1/users/5/laboratorios
{
  "laboratorioIds": [1, 2, 3]
}

# Crear laboratorio
POST /api/v1/laboratorios
{
  "nombre": "Lab Central",
  "descripcion": "Laboratorio principal",
  "direccion": "Calle Principal 123",
  "telefono": "3875000000",
  "email": "lab@example.com",
  "contacto": "Ing. García"
}
```

### Frontend
1. Navegar a `/admin/roles`, `/admin/usuarios`, `/admin/laboratorios`
2. Crear nuevo elemento usando botón "+"
3. Editar elemento existente
4. Eliminar elemento (con confirmación)
5. Buscar usando filtro "q"
6. Paginar resultados
7. Ordenar por diferentes campos

---

## 📚 OTROS ABMs NECESARIOS

Basado en el análisis del proyecto, se recomienda implementar los siguientes ABMs adicionales:

### 1. **PRODUCTOS** ⭐ (Alta Prioridad)
- **Descripción:** Gestionar productos químicos/semillas usados en ensayos
- **Campos:** nombre, descripción, laboratorio, tipo, unidad, precio
- **Relaciones:** Laboratorio → Productos, Tratamiento-Producto
- **Ubicación Actual:** `/src/productos/` (parcialmente implementado)
- **Acceso:** ADMIN, SUPERADMIN, MANAGER

### 2. **CULTIVOS** ⭐ (Alta Prioridad)
- **Descripción:** Catalogar tipos de cultivos
- **Campos:** nombre, descripción, ciclo vegetativo
- **Ubicación Actual:** `/src/catalogos/cultivos/` (existe)
- **Acceso:** ADMIN, SUPERADMIN, INVITADO (lectura)

### 3. **VARIEDADES DE CULTIVO** ⭐ (Alta Prioridad)
- **Descripción:** Variedades dentro de cada cultivo
- **Ubicación Actual:** `/src/catalogos/cultivo-variedades/` (existe)
- **Relaciones:** Cultivo → Variedades

### 4. **TIPOS DE ENSAYO** (Alta Prioridad)
- **Descripción:** Clasificación de ensayos
- **Ubicación Actual:** `/src/catalogos/tipos-ensayo/` (existe)
- **Acceso:** ADMIN, SUPERADMIN, INVESTIGADOR

### 5. **TIPOS DE SIEMBRA** (Prioridad Media)
- **Descripción:** Métodos de siembra (surcos, cuadrícula, etc)
- **Ubicación Actual:** `/src/catalogos/tipos-siembra/` (existe)

### 6. **UBICACIONES/PROVINCIAS** (Prioridad Media)
- **Descripción:** Provincias, departamentos para geo-referenciación
- **Ubicación Actual:** `/src/locations/` (existe, solo lectura)
- **Campos:** provincia, departamento, región

### 7. **ESTATUS DE ENSAYO** (Prioridad Media)
- **Descripción:** Estados de un ensayo (activo, finalizado, cancelado)
- **Ubicación Actual:** `/src/status-ensayo/` (existe)
- **Acceso:** ADMIN, SUPERADMIN

### 8. **PERMISOS/PERFILES** (Prioridad Baja - Opcional)
- **Descripción:** ABM de permisos granulares por rol
- **Nota:** Actualmente se usan decoradores @Roles simples
- **Beneficio:** Más granularidad en control de acceso

---

## 📊 TABLA COMPARATIVA ABMs

| ABM | Estado | Backend | Frontend | Swagger | Prioridad |
|-----|:------:|:-------:|:--------:|:-------:|:---------:|
| Roles | ✅ Completo | ✅ | ✅ | ✅ | Alta |
| Usuarios | ✅ Completo | ✅ | ✅ | ✅ | Alta |
| Laboratorios | ✅ Completo | ✅ | ✅ | ✅ | Alta |
| Productos | 🟡 Parcial | ✅ | ❌ | ⚠️ | Alta |
| Cultivos | 🟡 Parcial | ✅ | ❌ | ⚠️ | Alta |
| Variedades | 🟡 Parcial | ✅ | ❌ | ⚠️ | Alta |
| Tipos Ensayo | 🟡 Parcial | ✅ | ❌ | ⚠️ | Alta |
| Tipos Siembra | 🟡 Parcial | ✅ | ❌ | ⚠️ | Media |
| Ubicaciones | 🟡 Parcial | ✅ | ❌ | ⚠️ | Media |
| Estatus Ensayo | 🟡 Parcial | ✅ | ❌ | ⚠️ | Media |
| Permisos | ❌ No implementado | ❌ | ❌ | ❌ | Baja |

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

1. **Completar Catálogos:** Crear interfaces de usuario para PRODUCTOS, CULTIVOS, VARIEDADES
2. **ABM Configuraciones:** Permitir administrar configuraciones del sistema
3. **Reportes:** Implementar reportes de ensayos y actividades
4. **Auditoría:** Registrar quién hizo qué cambios y cuándo
5. **Notificaciones:** Sistema de alertas para eventos importantes

---

## 📞 NOTAS IMPORTANTES

- **Autenticación:** Todos los endpoints requieren Bearer token JWT
- **Paginación:** Por defecto 10 registros por página, máximo 100
- **Búsqueda:** Case-insensitive, búsqueda parcial con LIKE
- **Timestamps:** Automáticos en laboratorios (createdAt, updatedAt)
- **Validación:** Nombres únicos verificados en BD
- **Integridad:** Validación de FK antes de eliminar

---

**Documentación compilada:** 11/02/2026  
**Versión:** 1.0  
**Estado:** PRODUCCIÓN LISTA

