# Referencia Rápida - Correcciones Login y Autenticación

## 🚀 Cambios Rápidos Resumen

### Cambio 1: Auth Store (`stores/auth.ts`)
**Qué cambió:** Validación robusta de respuesta JSON en login  
**Líneas clave:**
- Try-catch separado para errores de parsing JSON
- Validación de tipo de objeto antes de procesar
- Diferenciación de errores 401, 400, 500

```typescript
// Antes ❌
const response = await $fetch(`${apiBase}/auth/login`, {...})

// Después ✅
let response: any
try {
  response = await $fetch<{...}>(`${apiBase}/auth/login`, {
    ...
    responseType: 'json',
  })
} catch (fetchErr: any) {
  if (fetchErr.status === 401) throw new Error('401_INVALID_CREDENTIALS')
  // ... manejo específico de errores
}

if (!response || typeof response !== 'object') {
  throw new Error('INVALID_RESPONSE_FORMAT')
}
```

---

### Cambio 2: Login Page (`pages/login.vue`)
**Qué cambió:** Limpiar password en error + validación antes de navegar  
**Líneas clave:**
- Limpiar password: `password.value = ''`
- Validar `isFullyAuthenticated` antes de navegar
- Mantener en login si hay error

```typescript
// Antes ❌
error.value = authStore.error

// Después ✅
password.value = '' // Seguridad
if (!authStore.isFullyAuthenticated) {
  error.value = 'Error: Datos de usuario incompletos.'
  return
}
await navigateTo('/')
```

---

### Cambio 3: API Composable (`composables/useApi.ts`)
**Qué cambió:** Evitar loops de redirección + logs detallados  
**Líneas clave:**
- Flag `isRedirecting` para evitar múltiples redirecciones
- Logs con status code y mensaje

```typescript
// Antes ❌
if (error.status === 401) {
  authStore.logout()
  await navigateTo('/login')
}

// Después ✅
let isRedirecting = false

if (error.status === 401) {
  authStore.logout()
  if (!isRedirecting && process.client) {
    isRedirecting = true
    try {
      await navigateTo('/login')
    } finally {
      isRedirecting = false
    }
  }
}
```

---

### Cambio 4: Ensayos Store (`stores/ensayos.ts`)
**Qué cambió:** Validación de array antes de usar  
**Líneas clave:**
- Validar que data es array
- Fallback a [] si no es array

```typescript
// Antes ❌
ensayos.value = response.data || []

// Después ✅
const responseData = Array.isArray(response.data) 
  ? response.data 
  : (response.data?.data || [])
ensayos.value = responseData || []
```

---

### Cambio 5: Ensayos Composable (`composables/useEnsayos.ts`)
**Qué cambió:** Validar userId antes de operaciones  
**Líneas clave:**
- Checkear `authStore.isFullyAuthenticated` primero
- Retornar [] si usuario no autenticado

```typescript
// Antes ❌
const fetchCultivos = async () => {
  const response = await $fetch(`${apiBase}/catalogos/cultivos`, ...)
  cultivos.value = response.data || response || []
}

// Después ✅
const fetchCultivos = async () => {
  if (!authStore.isFullyAuthenticated || !authStore.user?.id) {
    console.warn('userId no disponible todavía')
    cultivos.value = []
    return []
  }
  const response = await $fetch(...)
  const data = Array.isArray(response) ? response : (response?.data || [])
  cultivos.value = data
}
```

---

### Cambio 6: Ensayos Page (`pages/ensayos/index.vue`)
**Qué cambió:** Validar respuesta antes de usar  
**Líneas clave:**
- Validar que response es objeto
- Validar que data es array
- Validar que meta es objeto

```typescript
// Antes ❌
ensayos.value = response.data || []
meta.value = response.meta || { total: 0, ... }

// Después ✅
if (!response || typeof response !== 'object') {
  throw new Error('Respuesta inválida')
}
const data = Array.isArray(response.data) ? response.data : []
ensayos.value = data

if (response.meta && typeof response.meta === 'object') {
  meta.value = response.meta
} else {
  meta.value = { total: data.length, ... }
}
```

---

### Cambio 7: Dashboard Page (`pages/index.vue`)
**Qué cambió:** Carga segura de ensayos con validación  
**Líneas clave:**
- Validar respuesta como objeto
- Validar data como array
- Logs detallados

```typescript
// Similar a Cambio 6
const response = await api.get('/ensayos?limit=100&page=1')

if (!response || typeof response !== 'object') {
  throw new Error('Respuesta inválida')
}

const data = Array.isArray(response.data) ? response.data : []
ensayos.value = data
```

---

### Cambio 8: RecentEnsayos Component (`components/dashboard/RecentEnsayos.vue`)
**Qué cambió:** Validar autenticación + importar useAuthStore  
**Líneas clave:**
- Importar useAuthStore
- Validar antes de cargar

```typescript
// Antes ❌
const loadEnsayos = () => {
  ensayosStore.fetchEnsayos(params)
}

// Después ✅
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()

const loadEnsayos = async () => {
  if (!authStore.isFullyAuthenticated || !authStore.user?.id) {
    console.warn('Usuario no autenticado')
    return
  }
  await ensayosStore.fetchEnsayos(params)
}
```

---

## 🎯 Patrones de Protección

### Patrón 1: Validar Objeto
```typescript
if (!response || typeof response !== 'object') {
  throw new Error('Respuesta inválida')
}
```

### Patrón 2: Validar Array
```typescript
const data = Array.isArray(response.data) ? response.data : []
```

### Patrón 3: Validar Autenticación
```typescript
if (!authStore.isFullyAuthenticated || !authStore.user?.id) {
  console.warn('Usuario no autenticado')
  return
}
```

### Patrón 4: Diferenciar Errores
```typescript
if (error.status === 401) {
  // Sesión expirada
} else if (error.status === 500) {
  // Error del servidor
} else {
  // Otro error
}
```

---

## 🔍 Validación Rápida

### En Login - ¿Funciona?
```
1. Credenciales incorrectas → Error + stay en login ✅
2. Credenciales correctas → Dashboard ✅
3. Server error 500 → Mensaje amigable ✅
```

### En Dashboard - ¿Funciona?
```
1. Ensayos cargan ✅
2. No hay error de IndexedDB ✅
3. No hay error de array.length ✅
```

### En Ensayos - ¿Funciona?
```
1. Tabla se muestra ✅
2. Cultivos cargan ✅
3. Variedades cargan ✅
```

---

## 📋 Checklist para Nuevo Dev

Si haces cambios similares en futuro:

- [ ] Valida que response es objeto
- [ ] Valida que data es array
- [ ] Valida userId antes de IndexedDB
- [ ] Diferencia errores HTTP (401, 400, 500)
- [ ] Try-catch alrededor de localStorage
- [ ] Log con status en errores
- [ ] Evita loops de redirección
- [ ] Mensaje de error claro para usuario
- [ ] Mensaje de warning en console
- [ ] Fallback a valor seguro ([], null, etc)

---

## 🐛 Common Fixes

| Problema | Solución |
|----------|----------|
| "undefined is not valid JSON" | Validar tipo de response |
| "Cannot read properties of undefined (reading 'length')" | Array.isArray() check |
| "IDBKeyRange.only parameter not valid" | Validar userId !== undefined |
| "Converting circular structure to JSON" | Try-catch en localStorage |
| "Sesión expirada" redirige múltiples veces | isRedirecting flag |

---

## 💡 Tips para Debugging

### Ver qué está en localStorage:
```javascript
console.log('Token:', localStorage.getItem('token'))
console.log('User:', JSON.parse(localStorage.getItem('user')))
```

### Ver qué está en auth store:
```javascript
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()
console.log('Is Authenticated:', auth.isFullyAuthenticated)
console.log('User:', auth.user)
console.log('Token:', auth.token)
```

### Limpiar todo:
```javascript
localStorage.clear()
location.href = '/login'
```

---

## 🚀 Deploy Checklist

- [ ] Todos los 8 archivos actualizado
- [ ] Build sin errores críticos
- [ ] npm run build funciona
- [ ] Ningún import falta
- [ ] Logs en console tienen sense
- [ ] Error messages son user-friendly


