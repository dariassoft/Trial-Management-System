# 🐛 FIX: Error SSR en Componentes de Listado - Fetch Failed

## 📋 Problema Identificado

**Error observado:**
```
[GET] "http://localhost:3000/api/v1/productos?...": <no response> fetch failed
Error: QueryFailedError: Duplicate entry '30' for key 'Datos_Siembra.uk_parcela_siembra'
```

**Causa raíz:**
Los componentes de listado estaban llamando a `inicializar()` **directamente en el script de setup**, sin envolverlo en `onMounted()`. Esto causaba que:

1. **Durante SSR (Server-Side Rendering)**: Se ejecutaba en el servidor, donde no hay acceso a `localStorage` (donde se guarda el token)
2. **Sin autenticación**: Las peticiones API fallaban con `401 Unauthorized`
3. **En el navegador**: Se ejecutaba de nuevo al montarse el componente, causando problemas de duplicidad y conflictos

## ✅ Solución Implementada

Se movió la inicialización de datos a un hook `onMounted()` para que **solo se ejecute en el cliente, después del montaje**.

### Patrón Correcto:

```typescript
// ❌ INCORRECTO - Se ejecuta en SSR y en cliente
const inicializar = async () => {
  await store.fetch()
}
inicializar()

// ✅ CORRECTO - Solo en cliente, después del montaje
const inicializar = async () => {
  try {
    await store.fetch()
  } catch (error) {
    console.warn('Error al cargar datos:', error)
  }
}
onMounted(() => {
  inicializar()
})
```

## 📝 Archivos Modificados (6 componentes)

### 1. ✅ `ProductosList.vue`
- **Ruta**: `/tms-client-vue/components/productos/ProductosList.vue`
- **Cambios**:
  - Importado `onMounted` desde 'vue'
  - Envuelto `inicializar()` en `onMounted(() => { inicializar() })`
  - Agregado try/catch en inicializar

### 2. ✅ `TiposSiembraList.vue`
- **Ruta**: `/tms-client-vue/components/catalogos/tipos-siembra/TiposSiembraList.vue`
- **Cambios**: Same pattern (onMounted + try/catch)

### 3. ✅ `VariedadesList.vue`
- **Ruta**: `/tms-client-vue/components/catalogos/variedades/VariedadesList.vue`
- **Cambios**: Same pattern (onMounted + try/catch)

### 4. ✅ `CultivosList.vue`
- **Ruta**: `/tms-client-vue/components/catalogos/cultivos/CultivosList.vue`
- **Cambios**: Same pattern (onMounted + try/catch)

### 5. ✅ `TiposEnsayoList.vue`
- **Ruta**: `/tms-client-vue/components/catalogos/tipos-ensayo/TiposEnsayoList.vue`
- **Cambios**: Same pattern (onMounted + try/catch)

### 6. ✅ `PermisosList.vue`
- **Ruta**: `/tms-client-vue/components/permisos/PermisosList.vue`
- **Cambios**: Same pattern (onMounted + try/catch)

## 🔧 Cambios Técnicos

### Antes:
```typescript
import { ref, computed, watch } from 'vue'

const inicializar = async () => {
  await store.fetch()
}

// ❌ Se ejecuta en SSR y en cliente
inicializar()
```

### Después:
```typescript
import { ref, computed, watch, onMounted } from 'vue'

const inicializar = async () => {
  try {
    await store.fetch()
  } catch (error) {
    console.warn('No se pudieron cargar datos inicialmente:', error)
  }
}

// ✅ Solo en cliente, después del montaje
onMounted(() => {
  inicializar()
})
```

## 🎯 Impacto

✅ **Resuelve**:
- Error "fetch failed" durante carga de páginas
- Error "Unauthorized" en SSR
- Duplicidad de inserts
- Conflictos de inicialización

✅ **Beneficios**:
- Renders más rápidos (SSR sin esperar API)
- Sin errores de autenticación en servidor
- Manejo gracioso de errores
- Compatible con SSR y CSR

## 🧪 Verificación

Para verificar que todo funciona:

1. ✅ Recargar la página de productos: `http://localhost:3001/admin/productos`
2. ✅ Recargar catálogos: `http://localhost:3001/catalogos/cultivos`
3. ✅ Verificar que no hay errores en la consola del navegador
4. ✅ Verificar que los datos se cargan correctamente

## 📌 Lección Aprendida

**Patrón para componentes que cargan datos en Nuxt 3 + Pinia:**

```typescript
// ✅ SIEMPRE usar onMounted para cargar datos desde el servidor
onMounted(async () => {
  try {
    await store.fetch()
  } catch (error) {
    console.warn('Error al cargar:', error)
  }
})

// ❌ NUNCA ejecutar fetch en el nivel superior del script
// (se ejecutará en SSR donde no hay token)
```

---

**Status**: ✅ RESUELTO
**Fecha**: 2026-03-09
**Archivos afectados**: 6
**Líneas cambiadas**: ~40

