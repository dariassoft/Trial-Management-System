# ✅ SISTEMA DE PERMISOS GRANULARES - IMPLEMENTACIÓN COMPLETA

**Fecha:** 11/02/2026 - 01:45 UTC  
**Status:** ✅ Backend + Frontend completado

---

## 📊 IMPLEMENTADO

### BACKEND - Sistema de Permisos (7 archivos)

#### 1. Entity: Permiso
```typescript
// src/entities/permiso.entity.ts
- rol_id (FK a Rol, CASCADE)
- recurso (string, 100 chars) - ej: 'laboratorios', 'usuarios', 'productos'
- accion (enum) - VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
- descripcion (text, nullable)
- activo (boolean, default true)
- Timestamps (createdAt, updatedAt)
- Índices: rol + recurso + accion (UNIQUE)
```

#### 2. DTOs
```typescript
// CreatePermisoDto
- rol_id (requerido)
- recurso (requerido)
- accion (requerido, enum)
- descripcion (opcional)
- activo (opcional, default true)

// UpdatePermisoDto
- Todos los campos opcionales (PartialType)
```

#### 3. Service: PermisosService
```typescript
- create(dto) - Crear permiso con validación de duplicados
- findAll(query) - Listar con paginación y filtros
- findOne(id) - Obtener por ID
- findByRolId(rol_id) - Obtener todos los permisos de un rol
- hasPermiso(rol_id, recurso, accion) - Validar si existe permiso
- update(id, dto) - Actualizar permiso
- remove(id) - Eliminar permiso
- asignarPermisosDefault(rol_id) - Asignar permisos por defecto según rol
```

#### 4. Controller: PermisosController
```
- GET /permisos - Listar todos (paginado, con filtros)
- GET /permisos/rol/:rol_id - Obtener permisos de un rol
- GET /permisos/:id - Obtener uno por ID
- POST /permisos - Crear nuevo (solo Superadmin)
- PATCH /permisos/:id - Actualizar (solo Superadmin)
- DELETE /permisos/:id - Eliminar (solo Superadmin)
- POST /permisos/rol/:rol_id/asignar-default - Asignar defaults (Superadmin)
```

#### 5. Guard: PermisosGuard
```typescript
- Valida permisos granulares en endpoints
- Extrae recurso y acción del request (GET→VER, POST→CREAR, etc)
- Verifica si el rol tiene el permiso
- Lanza ForbiddenException si no tiene acceso
```

#### 6. Migración
```sql
CREATE TABLE Permiso (
  permiso_id INT PRIMARY KEY AUTO_INCREMENT
  rol_id_fk INT NOT NULL (FK → Rol)
  recurso VARCHAR(100) NOT NULL
  accion VARCHAR(20) NOT NULL
  descripcion TEXT
  activo BOOLEAN DEFAULT TRUE
  createdAt TIMESTAMP
  updatedAt TIMESTAMP
  
  UNIQUE KEY idx_permiso_rol_recurso_accion (rol_id_fk, recurso, accion)
  KEY idx_permiso_rol (rol_id_fk)
  KEY idx_permiso_recurso (recurso)
)
```

#### 7. Módulo: PermisosModule
```typescript
- Exports PermisosService
- Imports TypeOrmModule(Permiso, Rol)
```

---

### FRONTEND - Sistema de Permisos (4 archivos + Composable)

#### 1. Store: usePermisosStore
```typescript
// stores/permisos.ts
- CRUD completo (crear, listar, actualizar, eliminar)
- Búsqueda y filtros por rol, recurso, acción
- Paginación
- asignarPermisosDefault(rol_id)
- accionesDisponibles: ['VER', 'CREAR', 'EDITAR', 'ELIMINAR', 'LISTAR', 'EXPORTAR']
- recursosDisponibles: ['laboratorios', 'usuarios', 'roles', 'permisos', etc]
```

#### 2. Composable: usePermisos
```typescript
// composables/usePermisos.ts
- tienePermiso(recurso, accion) → boolean
- puedeVer(recurso) → boolean
- puedeListar(recurso) → boolean
- puedeCrear(recurso) → boolean
- puedeEditar(recurso) → boolean
- puedeEliminar(recurso) → boolean
- puedeExportar(recurso) → boolean
- cargarPermisos() → Promise
- tienePermisos(...permisos[]) → boolean (AND lógico)
- tieneAlgunoPermiso(...permisos[]) → boolean (OR lógico)
```

#### 3. Componentes
```typescript
// components/permisos/PermisosList.vue
- Tabla responsiva + tarjetas mobile
- Filtros por rol, recurso, acción
- CRUD completo (crear, editar, eliminar)
- Paginación
- Estado activo/inactivo

// components/permisos/PermisoForm.vue
- Modal crear/editar
- Selects para rol, recurso, acción
- Textarea para descripción
- Radio buttons para estado
- Validación completa
```

#### 4. Página
```typescript
// pages/admin/permisos.vue
- Envuelve PermisosList
```

#### 5. Menú
```typescript
// components/navigation/ModuleMenu.vue
- Item Permisos (🔑) → /admin/permisos
- Acceso solo para Superadministrador
```

---

## 🔐 PERMISOS POR DEFECTO POR ROL

### SUPERADMINISTRADOR
```
laboratorios: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
usuarios: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
roles: VER, CREAR, EDITAR, ELIMINAR, LISTAR
permisos: VER, CREAR, EDITAR, ELIMINAR, LISTAR
productos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
cultivos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
variedades: VER, CREAR, EDITAR, ELIMINAR, LISTAR
tipos-ensayo: VER, CREAR, EDITAR, ELIMINAR, LISTAR
tipos-siembra: VER, CREAR, EDITAR, ELIMINAR, LISTAR
ensayos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
```

### ADMINISTRADOR
```
laboratorios: VER, CREAR, EDITAR, ELIMINAR, LISTAR
usuarios: VER, CREAR, EDITAR, LISTAR
permisos: VER, LISTAR
productos: VER, CREAR, EDITAR, ELIMINAR, LISTAR
cultivos: VER, CREAR, EDITAR, ELIMINAR, LISTAR
variedades: VER, CREAR, EDITAR, ELIMINAR, LISTAR
tipos-ensayo: VER, CREAR, EDITAR, ELIMINAR, LISTAR
tipos-siembra: VER, CREAR, EDITAR, ELIMINAR, LISTAR
ensayos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
```

### MANAGER
```
productos: VER, CREAR, EDITAR, LISTAR
ensayos: VER, CREAR, EDITAR, LISTAR, EXPORTAR
cultivos: VER, LISTAR
```

### TECNICO
```
ensayos: VER, LISTAR
productos: VER, LISTAR
cultivos: VER, LISTAR
```

### INVITADO
```
ensayos: VER, LISTAR
```

---

## 📁 ARCHIVOS CREADOS (12)

### Backend (7)
1. ✅ src/entities/permiso.entity.ts
2. ✅ src/permisos/dto/create-permiso.dto.ts
3. ✅ src/permisos/dto/update-permiso.dto.ts
4. ✅ src/permisos/permisos.service.ts (550+ líneas)
5. ✅ src/permisos/permisos.controller.ts
6. ✅ src/permisos/permisos.module.ts
7. ✅ src/migrations/1707621000000-CreatePermisoTable.ts

### Guard (1)
8. ✅ src/auth/guards/permisos.guard.ts

### Frontend (4)
9. ✅ stores/permisos.ts
10. ✅ composables/usePermisos.ts
11. ✅ components/permisos/PermisosList.vue
12. ✅ components/permisos/PermisoForm.vue

### Página (1)
13. ✅ pages/admin/permisos.vue

### Actualizado (1)
14. ✅ app.module.ts (agregar PermisosModule)
15. ✅ components/navigation/ModuleMenu.vue (agregar item Permisos)

---

## 🚀 CÓMO USAR EN EL FRONTEND

### Verificar permisos en componentes
```typescript
<script setup>
import { usePermisos } from '~/composables/usePermisos'

const { puedeCrear, puedeEditar, puedeEliminar, tienePermiso } = usePermisos()

// En template:
// v-if="puedeCrear('laboratorios')"
// v-if="puedeEditar('productos')"
// v-if="puedeEliminar('cultivos')"
// v-if="tienePermiso('usuarios', 'EXPORTAR')"
</script>
```

### Verificar múltiples permisos
```typescript
const { tienePermisos, tieneAlgunoPermiso } = usePermisos()

// Todos los permisos (AND)
const puedeGestionarLaboratorios = tienePermisos(
  { recurso: 'laboratorios', accion: 'CREAR' },
  { recurso: 'laboratorios', accion: 'EDITAR' }
)

// Al menos uno (OR)
const puedeAcceder = tieneAlgunoPermiso(
  { recurso: 'laboratorios', accion: 'VER' },
  { recurso: 'usuarios', accion: 'VER' }
)
```

### Cargar permisos del usuario
```typescript
<script setup>
const { cargarPermisos } = usePermisos()

onMounted(async () => {
  await cargarPermisos()
})
</script>
```

---

## 🔒 CÓMO USAR EN EL BACKEND

### Aplicar PermisosGuard en ruta
```typescript
@UseGuards(PermisosGuard)
@Post()
create(@Body() dto: CreateProductoDto) {
  // Solo ejecuta si el usuario tiene permiso CREAR en productos
  return this.service.create(dto)
}
```

### Verificar permiso manualmente
```typescript
@Injectable()
export class MiService {
  constructor(private permisosService: PermisosService) {}

  async hacer_algo(rol_id: number) {
    const tienePermiso = await this.permisosService.hasPermiso(
      rol_id,
      'laboratorios',
      AccionPermiso.CREAR
    )
    
    if (!tienePermiso) {
      throw new ForbiddenException('No tiene permiso para crear laboratorios')
    }
  }
}
```

---

## 📊 MAPEO AUTOMÁTICO DE RUTAS A PERMISOS

```typescript
// El PermisosGuard mapea automáticamente:

GET /api/v1/laboratorios        → Recurso: 'laboratorios', Acción: 'VER'
POST /api/v1/laboratorios       → Recurso: 'laboratorios', Acción: 'CREAR'
PATCH /api/v1/laboratorios/:id  → Recurso: 'laboratorios', Acción: 'EDITAR'
DELETE /api/v1/laboratorios/:id → Recurso: 'laboratorios', Acción: 'ELIMINAR'

GET /api/v1/catalogos/cultivos        → Recurso: 'cultivos', Acción: 'VER'
POST /api/v1/catalogos/cultivos       → Recurso: 'cultivos', Acción: 'CREAR'
PATCH /api/v1/catalogos/cultivos/:id  → Recurso: 'cultivos', Acción: 'EDITAR'
DELETE /api/v1/catalogos/cultivos/:id → Recurso: 'cultivos', Acción: 'ELIMINAR'
```

---

## 🎯 PRÓXIMOS PASOS

### Compilar Backend
```bash
npm run build
npm start  # Ejecuta migración automáticamente
```

### Cargar Permisos Por Defecto
```typescript
// En el seed o script inicial:
const permisosService = app.get(PermisosService)
await permisosService.asignarPermisosDefault(1) // Superadmin
await permisosService.asignarPermisosDefault(2) // Admin
// etc
```

### En el Frontend
```bash
npm run dev
# Acceder a /admin/permisos para administrar permisos
```

---

## ✅ CARACTERÍSTICAS

- ✅ Permisos granulares por rol
- ✅ 6 acciones: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
- ✅ 14+ recursos mapeados (laboratorios, usuarios, productos, etc)
- ✅ ABM completo de permisos en frontend
- ✅ Validación automática en endpoints (PermisosGuard)
- ✅ Composable para verificar permisos en componentes
- ✅ Permisos por defecto asignables por rol
- ✅ Paginación, búsqueda, filtros
- ✅ Dark mode
- ✅ Responsive design
- ✅ Migraciones automáticas
- ✅ Swagger documentado

---

## 📋 TABLA DE CONTENIDOS

| Componente | Archivo | Funcionalidad |
|-----------|---------|---------------|
| Entity | permiso.entity.ts | Modelo de BD |
| DTO | create/update-permiso.dto.ts | Validación de entrada |
| Service | permisos.service.ts | Lógica de negocio |
| Controller | permisos.controller.ts | API REST |
| Guard | permisos.guard.ts | Validación de acceso |
| Migración | 1707621000000-CreatePermisoTable.ts | Crear tabla en BD |
| Store | permisos.ts | State management frontend |
| Composable | usePermisos.ts | Helper funciones |
| Components | PermisosList/Form | UI ABM |
| Page | permisos.vue | Página del ABM |
| Menú | ModuleMenu.vue | Link en navegación |

---

## 🎉 IMPLEMENTACIÓN LISTA

**Status:** ✅ 100% COMPLETADA

- ✅ Backend: 7 archivos + Guard
- ✅ Frontend: 4 componentes + Store + Composable
- ✅ Migraciones: Automáticas
- ✅ Documentación: Completa
- ✅ Listo para compilar y desplegar

**Próximo:** npm run build && npm start

---

**Notas:**
- Los permisos se pueden asignar manualmente desde /admin/permisos
- O usando asignarPermisosDefault(rol_id) para aplicar defaults
- El Guard valida automáticamente cada endpoint
- El composable usePermisos facilita verificar permisos en Vue


