# Ejemplos de Uso del Endpoint de Ensayos

## Endpoint Base
```
GET /api/v1/ensayos
```

---

## Caso 1: Listado Paginado (uso normal en tablas)

### Request
```http
GET /api/v1/ensayos?page=1&limit=10
```

### Comportamiento Backend
```typescript
limit = query.limit ?? 10  // limit = 10
```

### Response
```json
{
  "data": [
    { "id": 1, "nombreEnsayo": "Ensayo Maíz..." },
    { "id": 2, "nombreEnsayo": "Ensayo Soja..." },
    // ... 8 más (total 10)
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pageCount": 15
  }
}
```

---

## Caso 2: Búsqueda SIN Límite (uso en selects)

### Request
```http
GET /api/v1/ensayos?q=maíz
```

### Comportamiento Backend
```typescript
// query.q existe && query.limit === undefined
limit = undefined  // NO aplica límite
```

### Response
```json
{
  "data": [
    { "id": 1, "nombreEnsayo": "Ensayo Maíz Temprano 2025" },
    { "id": 5, "nombreEnsayo": "Ensayo Maíz Tardío 2025" },
    { "id": 12, "nombreEnsayo": "Ensayo Maíz Dulce 2025" },
    { "id": 18, "nombreEnsayo": "Maíz Colorado Zona Norte" },
    // ... TODOS los resultados que coincidan (sin límite)
  ],
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 4,      // limit = total cuando no hay límite
    "pageCount": 1
  }
}
```

---

## Caso 3: Búsqueda CON Límite Explícito

### Request
```http
GET /api/v1/ensayos?q=maíz&limit=2
```

### Comportamiento Backend
```typescript
// Se especifica limit explícitamente
limit = query.limit  // limit = 2
```

### Response
```json
{
  "data": [
    { "id": 1, "nombreEnsayo": "Ensayo Maíz Temprano 2025" },
    { "id": 5, "nombreEnsayo": "Ensayo Maíz Tardío 2025" }
  ],
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 2,
    "pageCount": 2
  }
}
```

---

## Caso 4: Listado Sin Paginación (todos los registros)

### Request
```http
GET /api/v1/ensayos?limit=999999
```

### Comportamiento Backend
```typescript
limit = query.limit  // limit = 999999 (muy alto, trae todos)
```

### Nota
⚠️ **No recomendado:** Mejor usar búsqueda con `q` cuando no se quiere límite.

---

## Caso 5: Búsqueda Combinada con Filtros

### Request
```http
GET /api/v1/ensayos?q=córdoba&laboratorio=INTA&fechaSiembraStart=2025-01-01
```

### Comportamiento Backend
```typescript
// Búsqueda sin límite + filtros adicionales
limit = undefined

// Condiciones WHERE combinadas:
// - LIKE '%córdoba%' en nombre, responsable, cultivo, etc.
// - AND laboratorio.nombre LIKE '%INTA%'
// - AND fechaSiembra >= '2025-01-01'
```

### Response
```json
{
  "data": [
    {
      "id": 7,
      "nombreEnsayo": "Ensayo Maíz Córdoba Norte",
      "laboratorio": { "nombre": "INTA Manfredi" },
      "fechaSiembra": "2025-02-15"
    },
    {
      "id": 23,
      "nombreEnsayo": "Soja RR Córdoba",
      "laboratorio": { "nombre": "INTA Marcos Juárez" },
      "fechaSiembra": "2025-03-10"
    }
    // ... todos los que cumplan TODAS las condiciones
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 2,
    "pageCount": 1
  }
}
```

---

## Caso 6: Ordenamiento

### Request
```http
GET /api/v1/ensayos?q=ensayo&sort=fechaSiembra&order=DESC
```

### Comportamiento Backend
```typescript
limit = undefined  // Sin límite por búsqueda
// Ordenado por fechaSiembra descendente
```

### Response
```json
{
  "data": [
    { "id": 30, "nombreEnsayo": "Último ensayo", "fechaSiembra": "2025-12-01" },
    { "id": 25, "nombreEnsayo": "Ensayo reciente", "fechaSiembra": "2025-11-15" },
    { "id": 18, "nombreEnsayo": "Ensayo antiguo", "fechaSiembra": "2025-01-05" }
    // ... ordenados por fecha descendente
  ]
}
```

---

## Resumen de Parámetros

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 10* | Resultados por página |
| `sort` | string | 'id' | Campo de ordenamiento |
| `order` | 'ASC'\|'DESC' | 'ASC' | Dirección de orden |
| `q` | string | - | Búsqueda global |
| `laboratorio` | string | - | Filtrar por laboratorio |
| `variedad` | string | - | Filtrar por variedad |
| `fechaSiembraStart` | date | - | Fecha inicio |
| `fechaSiembraEnd` | date | - | Fecha fin |

\* **Nota:** El default de `limit` es 10, EXCEPTO cuando hay parámetro `q` sin especificar `limit`, en cuyo caso es `undefined` (sin límite).

---

## Campos Buscables con Parámetro `q`

El parámetro `q` busca en los siguientes campos:
- ✅ `ensayo.nombreEnsayo`
- ✅ `responsable.nombre`
- ✅ `responsable.apellido`
- ✅ `cultivo.nombre`
- ✅ `variedad.nombre`
- ✅ `tipoSiembra.nombre`
- ✅ `laboratorio.nombre`
- ✅ `status.nombre`

**Búsqueda:** Case-insensitive con `LIKE '%término%'`

---

## Ejemplos de Uso en Frontend

### Listado con Paginación (tabla)
```typescript
// Página de ensayos con tabla
await ensayosStore.fetchEnsayos({
  page: 1,
  limit: 10
})
```

### Select de Búsqueda (sin límite)
```typescript
// Select en página de reportes
await ensayosStore.fetchEnsayos({
  q: 'maíz'
  // NO especificar limit → traerá todos
})
```

### Autocomplete con Límite
```typescript
// Autocomplete con máximo 5 sugerencias
await ensayosStore.fetchEnsayos({
  q: searchTerm,
  limit: 5
})
```

---

## Ventajas de Este Diseño

✅ **Un solo endpoint** para múltiples casos de uso
✅ **Comportamiento inteligente** según parámetros
✅ **No hardcodea límites** en el código
✅ **Optimizado** para búsquedas (sin límite) y listados (con paginación)
✅ **Flexible** para diferentes necesidades de frontend
✅ **Fácil de entender** y mantener

---

**Documentación adicional:**
- Ver lógica completa: `/src/ensayos/ensayos.service.ts` línea 63-139
- Ver implementación frontend: `/tms-client-vue/components/reportes/ReportesGenerator.vue`

