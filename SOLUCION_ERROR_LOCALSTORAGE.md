# Solución: ERROR `localStorage is not defined`

## Problema Identificado

Error durante la inicialización del servidor:
```
ERROR  Error cargando settings: localStorage is not defined
```

**Causa raíz:** El código estaba intentando acceder a `localStorage` durante la ejecución del servidor (SSR - Server-Side Rendering) en Nuxt. `localStorage` es una API del navegador y no existe en el contexto del servidor Node.js.

**Ubicación del error:** `stores/settings.ts`, línea 21 y 53
- La función `loadSettings()` se ejecuta al inicializar el store
- El store se instancia en el servidor durante SSR
- `localStorage` no existe en el servidor → Error

---

## Solución Implementada

### Cambio en `/tms-client-vue/stores/settings.ts`

Se agregó una verificación para detectar si el código se está ejecutando en el cliente o en el servidor:

#### Función `loadSettings()` (líneas 38-54)
```typescript
function loadSettings() {
  try {
    // Verificar si estamos en el cliente (no SSR)
    if (typeof window === 'undefined') {
      isLoaded.value = true
      return
    }
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      settings.value = { ...DEFAULT_SETTINGS, ...parsed }
    }
    isLoaded.value = true
  } catch (err) {
    console.error('Error cargando settings:', err)
    settings.value = { ...DEFAULT_SETTINGS }
    isLoaded.value = true
  }
}
```

#### Función `saveSettings()` (líneas 57-68)
```typescript
function saveSettings() {
  try {
    // Verificar si estamos en el cliente (no SSR)
    if (typeof window === 'undefined') {
      return
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
  } catch (err) {
    console.error('Error guardando settings:', err)
  }
}
```

### Patrón Utilizado

La verificación `typeof window === 'undefined'` es el estándar para detectar SSR:

- **En el servidor (Node.js):** `typeof window === 'undefined'` → `true`
- **En el navegador (cliente):** `typeof window === 'undefined'` → `false`

---

## Alternativas Consideradas

1. **`process.client`** - Disponible en Nuxt pero requiere disponibilidad del módulo
   - Ya está siendo usado en `auth.ts` línea 61
   
2. **`process.server`** - Equivalente para el servidor

3. **Configuración de Nuxt** - Deshabilitar SSR completamente (no recomendado para performance)

Se eligió `typeof window === 'undefined'` porque:
- ✅ Funciona en cualquier contexto (Nuxt, Vue 3, etc.)
- ✅ No depende de módulos específicos
- ✅ Estándar de la industria
- ✅ Compatible con la verificación ya usada en `useTheme.ts` línea 9

---

## Archivos Afectados

### Modificados
- ✅ `/tms-client-vue/stores/settings.ts` - Agregadas protecciones SSR

### Ya Protegidos (sin cambios necesarios)
- ✅ `/tms-client-vue/stores/auth.ts` - Ya usa `process.client` (línea 61)
- ✅ `/tms-client-vue/stores/offline.ts` - Protege `navigator` e `indexedDB` (líneas 36-37)
- ✅ `/tms-client-vue/composables/useTheme.ts` - Usa `process.client` (línea 8)
- ✅ `/tms-client-vue/composables/useVersionCheck.ts` - Usa `process.client` (línea 18)

---

## Comportamiento Esperado

### En Servidor (SSR)
1. Store se inicializa
2. `loadSettings()` detecta SSR (`typeof window === 'undefined'`)
3. Retorna sin intentar acceder a `localStorage`
4. `isLoaded.value = true`
5. **Sin error** ✅

### En Cliente (Browser)
1. Store se inicializa
2. `loadSettings()` detecta cliente (`typeof window !== 'undefined'`)
3. Lee configuración de `localStorage`
4. Restaura valores guardados
5. **Funcionalidad normal** ✅

---

## Verificación

### Antes de la corrección
```
ERROR  Error cargando settings: localStorage is not defined
    at loadSettings (stores/settings.ts:21:22)
    at stores/settings.ts:53:3
```

### Después de la corrección
✅ No hay errores de `localStorage is not defined`
✅ Store se inicializa correctamente en servidor
✅ Configuración se carga desde `localStorage` en cliente

---

## Notas Importantes

1. **Reconstruir después de cambios:** Los cambios en `.ts` requieren recompilación
   ```bash
   npm run build
   ```

2. **Caché de build:** Limpiar si persisten problemas
   ```bash
   rm -rf .nuxt
   npm run build
   ```

3. **Otros stores:** Revisar si otros stores también acceden a APIs del navegador
   - ✅ Ya verificados todos los archivos en `/stores`
   - ✅ Ya verificados todos los archivos en `/composables`

---

## Referencias

- [Nuxt SSR Documentation](https://nuxt.com/docs/guide/concepts/rendering#universal-code)
- [typeof operator - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- [Process Node Helper - Nuxt](https://nuxt.com/docs/guide/going-further/internals#modules)

---

## Estado

✅ **Resuelto** - Fecha: 2026-02-11

