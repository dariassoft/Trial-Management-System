# 📋 PLAN IMPLEMENTACIÓN ABMs PRIORITARIOS

**Fecha:** 11/02/2026  
**Status:** En Progreso

---

## ✅ COMPLETADOS

### 1. PRODUCTOS - MEJORADO
- ✅ Entity actualizada con: descripcion, tipo, unidad, precio, timestamps
- ✅ CreateProductoDto actualizado (sin enums)
- ✅ UpdateProductoDto (PartialType)
- ✅ ProductosService mejorado con búsqueda completa
- ✅ ProductosController con Swagger completo
- ✅ Migración: 1707620400000-AddProductoFields.ts

**Acceso:** ADMIN, SUPERADMIN, MANAGER

### 2. CULTIVOS - MEJORADO
- ✅ Entity actualizada con: descripcion, ciclo_vegetativo, esta_activo, timestamps
- ✅ CreateCultivoDto actualizado
- ✅ UpdateCultivoDto (PartialType)
- ✅ CultivosService existente
- ✅ Migración: 1707620500000-AddCultivoFields.ts

**Acceso:** ADMIN, SUPERADMIN, INVESTIGADOR, lectura general

---

## 🔄 EN PROGRESO

###3. VARIEDADES DE CULTIVO
- Entity: CultivoVariedad (ya existe)
- Ubicación: /src/catalogos/cultivo-variedades/
- Campos: nombre, cultivo_id (FK)
- Necesita: Mejorar DTOs, Frontend (páginas, componentes, store)

### 4. TIPOS DE ENSAYO
- Entity: TipoEnsayo (ya existe)
- Ubicación: /src/catalogos/tipos-ensayo/
- Campos: nombre, descripcion, variables de evaluación, timestamps
- Necesita: Mejorar DTOs, Frontend, migración si es necesario

### 5. TIPOS DE SIEMBRA
- Entity: TipoSiembra (existe)
- Ubicación: /src/catalogos/tipos-siembra/
- Campos: nombre
- Necesita: Frontend (solo lectura o CRUD)

---

## 📝 ESTRUCTURA BACKEND ACTUALIZADA

```
src/
├── entities/
│   ├── producto.entity.ts         ✅ ACTUALIZADO
│   ├── cultivo.entity.ts          ✅ ACTUALIZADO
│   ├── cultivo-variedad.entity.ts
│   ├── tipo-ensayo.entity.ts
│   └── tipo-siembra.entity.ts
├── productos/
│   ├── productos.controller.ts    ✅ MEJORADO
│   ├── productos.service.ts       ✅ MEJORADO
│   ├── productos.module.ts
│   └── dto/
│       ├── create-producto.dto.ts ✅ ACTUALIZADO
│       └── update-producto.dto.ts
├── catalogos/
│   ├── cultivos/
│   │   ├── cultivos.controller.ts
│   │   ├── cultivos.service.ts
│   │   ├── cultivos.module.ts
│   │   └── dto/
│   │       ├── create-cultivo.dto.ts ✅ ACTUALIZADO
│   │       └── update-cultivo.dto.ts
│   ├── cultivo-variedades/
│   ├── tipos-ensayo/
│   └── tipos-siembra/
└── migrations/
    ├── 1707620400000-AddProductoFields.ts      ✅ NUEVA
    └── 1707620500000-AddCultivoFields.ts       ✅ NUEVA
```

---

## 📱 FRONTEND NECESARIO

### PRODUCTOS (Crear)
- ✅ Store: stores/productos.ts
- ✅ Componentes: components/productos/ProductosList.vue, ProductoForm.vue
- ✅ Página: pages/admin/productos.vue

### CULTIVOS (Crear)
- ✅ Store: stores/cultivos.ts
- ✅ Componentes: components/catalogos/cultivos/CultivosList.vue, CultivoForm.vue
- ✅ Página: pages/catalogos/cultivos.vue

### VARIEDADES (Crear)
- ✅ Store: stores/cultivo-variedades.ts
- ✅ Componentes: components/catalogos/variedades/VariedadesList.vue, VariedadForm.vue
- ✅ Página: pages/catalogos/variedades.vue

### TIPOS ENSAYO (Crear)
- ✅ Store: stores/tipos-ensayo.ts
- ✅ Componentes: components/catalogos/tipos-ensayo/TiposEnsayoList.vue, TipoEnsayoForm.vue
- ✅ Página: pages/catalogos/tipos-ensayo.vue

### TIPOS SIEMBRA (Crear)
- ✅ Store: stores/tipos-siembra.ts
- ✅ Componentes: components/catalogos/tipos-siembra/TiposSiembraList.vue, TipoSiembraForm.vue
- ✅ Página: pages/catalogos/tipos-siembra.vue

---

## 🔧 CAMBIOS EVITANDO ERRORES ANTERIORES

### ✅ Sin campos ID en PATCH payload
```typescript
// Siempre limpiar el ID antes de enviar UPDATE
const { id, ...dataToUpdate } = data
await api.patch(`/ruta/${id}`, dataToUpdate)
```

### ✅ DTOs sin enums restrictivos
```typescript
// ANTES (malo):
@IsEnum(Role) nombre: Role;

// AHORA (bueno):
@IsString() nombre: string;
```

### ✅ Migraciones automáticas
```typescript
// app.module.ts
migrationsRun: true  // Se ejecutan al iniciar
```

### ✅ Todos los campos opcionales en UPDATE
```typescript
// UpdateDto hereda de PartialType
export class UpdateDto extends PartialType(CreateDto) {}
```

---

## 🚀 PRÓXIMOS PASOS

### FASE 1: Compilar y probar cambios actuales
1. `npm run build`
2. `npm start` (ejecuta migraciones)
3. Probar GET /api/v1/productos
4. Probar GET /api/v1/catalogos/cultivos

### FASE 2: Crear Frontend para PRODUCTOS
1. Store: stores/productos.ts
2. Components: ProductosList.vue, ProductoForm.vue
3. Página: pages/admin/productos.vue
4. Actualizar menú

### FASE 3: Crear Frontend para CULTIVOS
1. Store: stores/cultivos.ts
2. Components: CultivosList.vue, CultivoForm.vue
3. Página: pages/catalogos/cultivos.vue

### FASE 4: Crear Frontend para VARIEDADES
(Similar a cultivos pero con relación)

### FASE 5: Crear Frontend para TIPOS ENSAYO
(Similar con variables de evaluación)

---

## 📊 RESUMEN CAMBIOS

| Elemento | Status | Archivo |
|----------|:------:|---------|
| Producto Entity | ✅ | src/entities/producto.entity.ts |
| Producto DTO | ✅ | src/productos/dto/ |
| Producto Service | ✅ | src/productos/productos.service.ts |
| Producto Controller | ✅ | src/productos/productos.controller.ts |
| Producto Migration | ✅ | src/migrations/1707620400000-* |
| Cultivo Entity | ✅ | src/entities/cultivo.entity.ts |
| Cultivo DTO | ✅ | src/catalogos/cultivos/dto/ |
| Cultivo Migration | ✅ | src/migrations/1707620500000-* |

---

## ⚠️ IMPORTANTE

Antes de continuar con Frontend:

1. Compilar backend: `npm run build`
2. Iniciar: `npm start`
3. Verificar migraciones en BD: `DESCRIBE Producto;` y `DESCRIBE Cultivo;`
4. Probar endpoints GET en Postman/curl

Si todo OK → Continuar con Frontend

---

**Último update:** 11/02/2026 - 23:50 UTC  
**Próxima fase:** Frontend para PRODUCTOS

