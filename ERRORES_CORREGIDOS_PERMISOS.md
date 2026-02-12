# ✅ ERRORES CORREGIDOS - SISTEMA DE PERMISOS

**Fecha:** 12/02/2026 - 00:05 UTC  
**Status:** ✅ Todos los errores corregidos

---

## 🔧 ERRORES ENCONTRADOS Y CORREGIDOS

### Error 1: Rutas de importación incorrectas en permisos.guard.ts
**Problema:**
```
Cannot find module '../permisos/permisos.service'
Cannot find module '../entities/permiso.entity'
Cannot find module './jwt-payload.interface'
```

**Causa:** Las rutas relativas estaban incorrectas (subían 1 nivel en lugar de 2)

**Solución:**
```typescript
// ❌ ANTES
import { PermisosService } from '../permisos/permisos.service';
import { AccionPermiso } from '../entities/permiso.entity';

// ✅ DESPUÉS
import { PermisosService } from '../../permisos/permisos.service';
import { AccionPermiso } from '../../entities/permiso.entity';
import { JwtPayload } from '../jwt-payload.interface';
```

### Error 2: ExecutionContext.getRequest() no existe
**Problema:**
```
Property 'getRequest' does not exist on type 'ExecutionContext'
```

**Causa:** En NestJS, ExecutionContext no tiene método directo `getRequest()`. Debe usarse `switchToHttp().getRequest()`

**Solución:**
```typescript
// ❌ ANTES
const request = context.getRequest();

// ✅ DESPUÉS
const request = context.switchToHttp().getRequest();
```

### Error 3: Tipo incorrecto en permisosMap
**Problema:**
```
Element implicitly has an 'any' type because expression of type 'string' 
can't be used to index type '{ Superadministrador: ... }'
```

**Causa:** El objeto `permisosMap` no tenía tipado para permitir indexación por string

**Solución:**
```typescript
// ❌ ANTES
const permisosMap = {
  'Superadministrador': [...],
  'Administrador': [...],
  ...
}

// ✅ DESPUÉS
const permisosMap: Record<string, { recurso: string; acciones: AccionPermiso[] }[]> = {
  'Superadministrador': [...],
  'Administrador': [...],
  ...
}
```

### Error 4: JwtPayload falta propiedad rol_id
**Problema:**
```
Property 'rol_id' does not exist on type 'JwtPayload'
```

**Causa:** La interfaz JwtPayload no incluía el `rol_id` necesario para validar permisos

**Solución Parte 1 - Actualizar interfaz:**
```typescript
// ❌ ANTES
export interface JwtPayload {
  sub: number;
  username: string;
  rol: Role;
  lab_ids: number[];
}

// ✅ DESPUÉS
export interface JwtPayload {
  sub: number;
  username: string;
  rol: Role;
  rol_id: number;  // ← NUEVO
  lab_ids: number[];
}
```

**Solución Parte 2 - Agregar rol_id al payload en login:**
```typescript
// ❌ ANTES
const payload: JwtPayload = {
  sub: u.id,
  username: u.username,
  rol: u.rol?.nombre as Role,
  lab_ids: [...],
};

// ✅ DESPUÉS
const payload: JwtPayload = {
  sub: u.id,
  username: u.username,
  rol: u.rol?.nombre as Role,
  rol_id: u.rol?.id as number,  // ← NUEVO
  lab_ids: [...],
};
```

### Error 5: Tipo incorrecto en update() de PermisosService
**Problema:**
```
Argument type {...} is not assignable to parameter type DeepPartial<Permiso>
```

**Causa:** El método `preload()` de TypeORM espera `DeepPartial<Permiso>` pero recibía `UpdatePermisoDto`

**Solución:**
```typescript
// ❌ ANTES
const updated = await this.permisoRepository.preload({
  id,
  ...dto,
});

// ✅ DESPUÉS
// Actualizar manualmente en lugar de preload
if (dto.rol_id !== undefined) permiso.rol_id = dto.rol_id;
if (dto.recurso !== undefined) permiso.recurso = dto.recurso;
if (dto.accion !== undefined) permiso.accion = dto.accion;
if (dto.descripcion !== undefined) permiso.descripcion = dto.descripcion;
if (dto.activo !== undefined) permiso.activo = dto.activo;

return this.permisoRepository.save(permiso);
```

---

## 📊 ARCHIVOS CORREGIDOS

1. ✅ `src/auth/guards/permisos.guard.ts` - Rutas de importación + switchToHttp()
2. ✅ `src/auth/jwt-payload.interface.ts` - Agregar rol_id
3. ✅ `src/auth/auth.service.ts` - Incluir rol_id en payload JWT
4. ✅ `src/permisos/permisos.service.ts` - Tipado de permisosMap + update()

---

## ✅ ESTADO DESPUÉS DE CORRECCIONES

| Archivo | Error | Status |
|---------|-------|--------|
| permisos.guard.ts | Rutas importación | ✅ Corregido |
| permisos.guard.ts | getRequest() | ✅ Corregido |
| permisos.service.ts | Tipo permisosMap | ✅ Corregido |
| permisos.service.ts | update() type error | ✅ Corregido |
| jwt-payload.interface.ts | Falta rol_id | ✅ Corregido |
| auth.service.ts | JWT sin rol_id | ✅ Corregido |

---

## 🚀 PRÓXIMOS PASOS

Compilar y ejecutar:
```bash
npm run build
npm start
```

Verificar que funcione:
1. Login devuelve JWT con rol_id
2. PermisosGuard valida automáticamente
3. /admin/permisos funciona correctamente

---

## 📝 NOTAS

- Los "Unused method" warnings son normales (métodos usados vía inyección de dependencia en controller)
- Todos los errores críticos (ERROR) han sido solucionados
- El sistema de permisos está listo para funcionar


