# 🔐 GUÍA RÁPIDA - SISTEMA DE PERMISOS

## Estructura

```
Backend:
  Entity: src/entities/permiso.entity.ts
  DTOs: src/permisos/dto/
  Service: src/permisos/permisos.service.ts
  Controller: src/permisos/permisos.controller.ts
  Guard: src/auth/guards/permisos.guard.ts
  Module: src/permisos/permisos.module.ts
  Migration: src/migrations/1707621000000-CreatePermisoTable.ts

Frontend:
  Store: stores/permisos.ts
  Composable: composables/usePermisos.ts
  Components: components/permisos/
    - PermisosList.vue
    - PermisoForm.vue
  Page: pages/admin/permisos.vue
```

## Tabla de Permisos

| Rol | laboratorios | usuarios | productos | cultivos | variedades | tipos-ensayo | ensayos |
|-----|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Superadmin | ✓✓✓✓✓✓ | ✓✓✓✓✓✓ | ✓✓✓✓✓✓ | ✓✓✓✓✓✓ | ✓✓✓✓✓ | ✓✓✓✓✓ | ✓✓✓✓✓✓ |
| Admin | ✓✓✓✓✓ | ✓✓✓✓ | ✓✓✓✓✓ | ✓✓✓✓✓ | ✓✓✓✓✓ | ✓✓✓✓✓ | ✓✓✓✓✓✓ |
| Manager | - | - | ✓✓✓✓ | ✓✓ | - | - | ✓✓✓✓✓ |
| Tecnico | - | - | ✓✓ | ✓✓ | - | - | ✓✓ |
| Invitado | - | - | - | - | - | - | ✓✓ |

Leyenda: ✓ = VER, ✓✓ = VER+LISTAR, ✓✓✓ = VER+LISTAR+CREAR, etc

## Acciones (6)

1. **VER** - Ver detalles de un recurso
2. **LISTAR** - Listar recursos
3. **CREAR** - Crear nuevo recurso
4. **EDITAR** - Modificar un recurso
5. **ELIMINAR** - Borrar un recurso
6. **EXPORTAR** - Exportar datos

## Cómo usar en Frontend

```typescript
import { usePermisos } from '~/composables/usePermisos'

const { 
  puedeVer, 
  puedeCrear, 
  puedeEditar, 
  puedeEliminar,
  cargarPermisos 
} = usePermisos()

// En template
<button v-if="puedeCrear('laboratorios')">Crear</button>
<button v-if="puedeEditar('productos')">Editar</button>
<button v-if="puedeEliminar('cultivos')">Eliminar</button>

// Cargar al montar
onMounted(async () => {
  await cargarPermisos()
})
```

## Cómo usar en Backend

```typescript
// Con Guard automático
@UseGuards(PermisosGuard)
@Post()
create(@Body() dto: CreateProductoDto) {
  // Valida automáticamente
  return this.service.create(dto)
}

// Verificar manualmente
async cualquier_metodo(rol_id: number) {
  const ok = await this.permisosService.hasPermiso(
    rol_id,
    'laboratorios',
    AccionPermiso.CREAR
  )
  
  if (!ok) {
    throw new ForbiddenException('No autorizado')
  }
}
```

## Endpoints API

```
GET    /api/v1/permisos                    - Listar todos
GET    /api/v1/permisos/rol/:rol_id       - Permisos de un rol
GET    /api/v1/permisos/:id               - Obtener uno
POST   /api/v1/permisos                    - Crear (Superadmin)
PATCH  /api/v1/permisos/:id               - Actualizar (Superadmin)
DELETE /api/v1/permisos/:id               - Eliminar (Superadmin)
POST   /api/v1/permisos/rol/:id/asignar-default - Defaults
```

## ABM en Frontend

URL: `/admin/permisos`

Acceso: Solo Superadministrador

Funciones:
- Listar permisos (paginado, filtrable)
- Crear nuevo permiso
- Editar permiso existente
- Eliminar permiso
- Filtrar por rol, recurso, acción
- Asignar permisos por defecto a un rol

## Compilación

```bash
# Backend
npm run build
npm start  # Ejecuta migración automáticamente

# Frontend
npm run dev  # Para desarrollo
npm run build  # Para producción
```

## Recursos Disponibles

- laboratorios
- usuarios
- roles
- permisos
- productos
- cultivos
- variedades
- tipos-ensayo
- tipos-siembra
- ensayos
- protocolos
- tratamientos
- bloques
- parcelas

## Notas Importantes

1. Los permisos se validan automáticamente en endpoints con PermisosGuard
2. El mapeo HTTP→Acción es automático (GET→VER, POST→CREAR, etc)
3. Los composables cargan permisos desde el store (no automáticamente)
4. Llama a `cargarPermisos()` al iniciar sesión o montar componente
5. La migración crea tabla con índice UNIQUE en (rol_id, recurso, accion)
6. Se pueden asignar permisos por defecto según el rol
7. Los permisos se pueden modificar manualmente desde /admin/permisos

## Ejemplo Completo (Frontend)

```typescript
<template>
  <div>
    <!-- Solo visible si tiene permiso -->
    <button v-if="puedeCrear('productos')" @click="abrirFormProducto">
      ➕ Nuevo
    </button>
    
    <table>
      <tr v-for="producto in productos" :key="producto.id">
        <td>{{ producto.nombre }}</td>
        <td>
          <!-- Botones condicionales -->
          <button v-if="puedeEditar('productos')" @click="editar(producto)">
            ✏️
          </button>
          <button v-if="puedeEliminar('productos')" @click="eliminar(producto)">
            🗑️
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePermisos } from '~/composables/usePermisos'

const { 
  puedeCrear, 
  puedeEditar, 
  puedeEliminar,
  cargarPermisos 
} = usePermisos()

onMounted(async () => {
  // Cargar permisos del usuario actual
  await cargarPermisos()
})
</script>
```

---

**Listo para usar: npm run build && npm start** 🚀

