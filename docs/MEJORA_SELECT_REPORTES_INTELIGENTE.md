# Mejora Inteligente del Select en Página de Reportes

## Problema Original
El select de ensayos en la página de reportes estaba limitado a 10 resultados de forma hardcodeada, lo cual no era una solución inteligente ni flexible.

## Solución Implementada (Enfoque Inteligente)

### Principios de la Solución
1. **No hardcodear límites** - El límite debe ser parte de los parámetros de la llamada
2. **Búsqueda dinámica** - Hacer llamadas al backend solo cuando sea necesario
3. **Reutilizar endpoints existentes** - Usar el parámetro `q` que ya existe en el endpoint
4. **Optimización con debounce** - Evitar llamadas excesivas al backend

---

## Cambios Realizados

### 1. Backend - Servicio de Ensayos
**Archivo:** `/src/ensayos/ensayos.service.ts`

#### Cambio 1: Lógica inteligente de límite
```typescript
// ANTES
const limit = query.limit ?? 10;

// DESPUÉS
// Si hay búsqueda (q) y no se especifica límite, no paginar (traer todos los resultados)
// Si no hay búsqueda, usar paginación con límite por defecto de 10
const limit = query.q && query.limit === undefined ? undefined : (query.limit ?? 10);
```

**Lógica:**
- Si hay parámetro `q` (búsqueda) Y NO se especifica `limit` → **No aplicar límite** (traer todos los resultados)
- Si NO hay búsqueda → Aplicar límite por defecto de **10** (para listados paginados)
- Si se especifica `limit` explícitamente → Usar ese valor (independientemente de si hay búsqueda o no)

#### Cambio 2: Aplicar paginación condicionalmente
```typescript
// ANTES
.skip((page - 1) * limit)
.take(limit)

// DESPUÉS
.skip(limit !== undefined ? (page - 1) * limit : 0)
.take(limit)
```

#### Cambio 3: Retornar metadata correcta
```typescript
// ANTES
return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };

// DESPUÉS
return { data, meta: { total, page, limit: limit ?? total, pageCount: limit ? Math.max(1, Math.ceil(total / limit)) : 1 } };
```

---

### 2. Frontend - Componente de Reportes
**Archivo:** `/tms-client-vue/components/reportes/ReportesGenerator.vue`

#### Nuevas Variables Reactivas
```typescript
const searchQuery = ref('')           // Texto de búsqueda del usuario
const buscando = ref(false)           // Indicador de carga durante búsqueda
let searchTimeout: ReturnType<typeof setTimeout> | null = null  // Para debounce
```

#### Watch con Debounce para Búsqueda Dinámica
```typescript
watch(searchQuery, (newValue) => {
  // Limpiar timeout previo
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Si hay menos de 3 caracteres, limpiar resultados
  if (newValue.length < 3) {
    ensayosStore.ensayos = []
    ensayoSeleccionado.value = null
    return
  }

  // Debounce de 300ms
  buscando.value = true
  searchTimeout = setTimeout(async () => {
    try {
      // Llamar al backend con el parámetro q (sin límite por defecto)
      await ensayosStore.fetchEnsayos({ q: newValue })
    } catch (err) {
      console.error('Error al buscar ensayos:', err)
    } finally {
      buscando.value = false
    }
  }, 300)
})
```

#### Nuevo Template con Campo de Búsqueda
```vue
<div>
  <!-- Campo de búsqueda -->
  <input
    v-model="searchQuery"
    type="text"
    placeholder="Escribe al menos 3 caracteres para buscar ensayos..."
  />

  <!-- Indicador de carga -->
  <div v-if="buscando">
    <span>🔍 Buscando...</span>
  </div>

  <!-- Select deshabilitado hasta que haya búsqueda -->
  <select
    v-model.number="ensayoSeleccionado"
    :disabled="searchQuery.length < 3"
  >
    <option :value="null">-- Elige un ensayo --</option>
    <option v-for="ensayo in ensayos" :key="ensayo.id" :value="ensayo.id">
      {{ `Ensayo #${ensayo.id} - ${ensayo.nombreEnsayo}` }}
    </option>
  </select>

  <!-- Mensajes informativos dinámicos -->
  <p v-if="searchQuery.length === 0">
    💡 Ingresa al menos 3 caracteres en el campo de búsqueda
  </p>
  <p v-else-if="searchQuery.length < 3">
    💡 Ingresa {{ 3 - searchQuery.length }} carácter(es) más
  </p>
  <p v-else-if="!buscando && ensayos.length === 0">
    ❌ No se encontraron ensayos que coincidan con "{{ searchQuery }}"
  </p>
  <p v-else-if="!buscando && ensayos.length > 0">
    ✅ Se encontraron {{ ensayos.length }} ensayo(s)
  </p>
</div>
```

---

## Flujo de Funcionamiento

### Caso de Uso: Listado Paginado (sin búsqueda)
```
Request: GET /api/v1/ensayos?page=1
Backend: limit = undefined ?? 10 = 10
Response: 10 ensayos con paginación
```

### Caso de Uso: Búsqueda sin límite explícito
```
Request: GET /api/v1/ensayos?q=maíz
Backend: limit = (q existe && limit === undefined) ? undefined : 10 = undefined
Response: TODOS los ensayos que coincidan con "maíz"
```

### Caso de Uso: Búsqueda con límite explícito
```
Request: GET /api/v1/ensayos?q=maíz&limit=5
Backend: limit = 5 (explícito)
Response: Máximo 5 ensayos que coincidan con "maíz"
```

---

## Ventajas de Esta Solución

✅ **Flexible:** El endpoint puede usarse tanto para listados paginados como para búsquedas sin límite
✅ **Inteligente:** El comportamiento se adapta según el contexto de uso
✅ **Reutilizable:** No necesita endpoints especiales para búsquedas
✅ **Optimizada:** Debounce de 300ms evita llamadas excesivas
✅ **UX Mejorada:** Feedback visual en tiempo real sobre el estado de la búsqueda
✅ **Mantenible:** No hay valores hardcodeados arbitrarios
✅ **Escalable:** El mismo patrón puede aplicarse a otros selects con búsqueda

---

## Diferencias con el Enfoque Anterior (Rechazado)

| Aspecto | Enfoque Rechazado ❌ | Enfoque Actual ✅ |
|---------|---------------------|------------------|
| **Límite** | Hardcodeado a 1000 | Dinámico según contexto |
| **Carga inicial** | Carga 1000 registros al montar | No carga nada hasta búsqueda |
| **Búsqueda** | Filtra localmente | Llama al backend (usa índices DB) |
| **Performance** | Mala (carga todo siempre) | Buena (carga bajo demanda) |
| **Reutilización** | Endpoint específico | Endpoint genérico reutilizable |
| **Escalabilidad** | Limitada a 1000 registros | Sin límite arbitrario |

---

## Testing Recomendado

### Test 1: Búsqueda con menos de 3 caracteres
1. Escribir "ma" en el campo de búsqueda
2. ✅ Debe mostrar: "Ingresa 1 carácter más"
3. ✅ El select debe estar deshabilitado

### Test 2: Búsqueda válida con resultados
1. Escribir "maíz" en el campo de búsqueda
2. ✅ Debe mostrar: "🔍 Buscando..." (durante 300ms)
3. ✅ Debe hacer llamada: `/api/v1/ensayos?q=maíz`
4. ✅ Debe mostrar: "✅ Se encontraron X ensayos"
5. ✅ El select debe tener todos los resultados

### Test 3: Búsqueda sin resultados
1. Escribir "xxxxxx" en el campo de búsqueda
2. ✅ Debe mostrar: "❌ No se encontraron ensayos que coincidan con 'xxxxxx'"

### Test 4: Debounce
1. Escribir rápidamente "maízzzz"
2. ✅ Debe hacer solo 1 llamada al backend (no 8 llamadas)

### Test 5: Listado paginado normal
1. Llamar directamente: `GET /api/v1/ensayos`
2. ✅ Debe retornar solo 10 registros con paginación

---

## Notas Técnicas

- El backend usa `query.q && query.limit === undefined` para detectar búsquedas sin límite
- El parámetro `q` ya existía y busca en: nombreEnsayo, responsable, cultivo, variedad, laboratorio, status
- El debounce evita llamadas mientras el usuario sigue escribiendo
- Los resultados se limpian automáticamente si el usuario borra el texto de búsqueda
- El select se deshabilita cuando no hay búsqueda válida para evitar confusión

---

## Fecha de Implementación
2026-04-08

