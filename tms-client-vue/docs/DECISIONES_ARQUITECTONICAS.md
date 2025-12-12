# Decisiones Arquitectónicas - TMS Frontend

Documento que registra las decisiones técnicas clave tomadas en la construcción del frontend de Trial Management System.

## 1. Arquitectura SPA (Single Page Application)

### Decisión
Implementar TMS Frontend como una **SPA con SSR deshabilitado** usando Nuxt 3 en modo cliente-only.

### Razón
- **Experiencia de usuario**: Transiciones suaves sin recargas de página
- **Rendimiento**: Carga inicial rápida, navegación instantánea
- **Simplicidad**: No requiere server-side rendering para este caso de uso
- **Despliegue**: Puede servirse desde CDN estático

### Implementación
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // SPA Mode
  // ...
})
```

### Implicaciones
- ✅ Toda la lógica ocurre en el cliente
- ✅ Primera carga incluye toda la aplicación
- ⚠️ No es ideal para SEO (pero es CMS interno)
- ✅ Reducción de carga en el servidor

---

## 2. Estado Global con Pinia

### Decisión
Usar **Pinia** para state management en lugar de Vuex o composables simples.

### Razón
- **Recomendado por Vue**: Pinia es la successor oficial de Vuex
- **TypeScript-friendly**: Mejor soporte de tipos
- **Simplicidad**: API más intuitiva que Vuex
- **Composables-first**: Compatible con Vue 3 Composition API

### Implementación
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any>(null)
  
  const isAuthenticated = computed(() => !!token.value)
  
  const login = async (username: string, password: string) => {
    // ...
  }
  
  return { token, user, isAuthenticated, login }
})
```

### Alternativas Consideradas
- Vuex: Demasiada boilerplate para esta aplicación
- Context API (React): No es Vue
- Composables simples: Difícil de compartir estado entre componentes

---

## 3. Autenticación JWT con localStorage

### Decisión
Almacenar JWT en **localStorage** con verificación en middleware de rutas.

### Razón
- **Simplicidad**: No requiere backend de sesiones
- **Stateless**: API no necesita guardar estado
- **Portabilidad**: Token puede enviarse en cualquier header
- **Seguridad**: Token expira automáticamente (backend)

### Implementación
```typescript
// stores/auth.ts
const login = async (username: string, password: string) => {
  const response = await $fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    body: { username, password },
  })
  
  localStorage.setItem('token', response.accessToken)
  token.value = response.accessToken
}
```

### Middleware de Autenticación
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})
```

### Consideraciones de Seguridad
- ⚠️ localStorage está expuesto a XSS
- ✅ HTTPS en producción (previene MITM)
- ✅ HttpOnly cookie sería más seguro (requiere backend)
- ✅ Token con tiempo de expiración corto (recomendar 15 min)

---

## 4. Tema Light/Dark con Class Toggle

### Decisión
Implementar theme toggle usando clase `dark` en `<html>` + Tailwind CSS.

### Razón
- **Integración Tailwind**: Soporte nativo con `dark:` prefix
- **Persistencia**: localStorage guardar preferencia
- **Performance**: Solo CSS, sin cambios en DOM
- **UX**: Respeta preferencia del sistema si no hay guardada

### Implementación
```typescript
// composables/useTheme.ts
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
```

### Configuración Tailwind
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // Basado en clase, no en prefers-color-scheme
  // ...
}
```

---

## 5. Composables para Lógica Reutilizable

### Decisión
Crear composables para `useApi` y `useTheme` en lugar de servicios globales.

### Razón
- **Vue 3 idiomático**: Composables es el patrón recomendado
- **Reactividad**: Acceso directo a refs y computeds
- **Type-safe**: TypeScript inference automático
- **Testeable**: Más fácil de mockear que servicios

### Composables Creados

#### `useApi`
```typescript
const api = useApi()
await api.get('/endpoint')
await api.post('/endpoint', data)
```

Maneja:
- Base URL automática
- Token en headers
- Redirección en 401

#### `useTheme`
```typescript
const { isDark, toggleTheme, initializeTheme } = useTheme()
```

Maneja:
- Inicialización de tema
- Toggle tema
- Persistencia en localStorage

---

## 6. CORS y API Base URL

### Decisión
Usar variable de entorno `NUXT_PUBLIC_API_BASE` para la URL de la API.

### Razón
- **Flexibility**: Diferente URL en dev vs. producción
- **Seguridad**: No hardcodear URLs
- **Build-time**: Compilado en el build, no runtime

### Implementación
```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1',
  },
}

// En componentes
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
```

### CORS en el Backend
```typescript
// src/main.ts (Backend)
app.enableCors() // Permite todas las origins por defecto
```

### Configuración Recomendada para Producción
```typescript
// Backend: configurar CORS específicamente
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
})
```

---

## 7. Estructura de Layouts

### Decisión
Crear dos layouts: **default** (con header) y **blank** (sin navegación).

### Razón
- **Separation of concerns**: Login no necesita header
- **Reusabilidad**: Fácil agregar más layouts
- **Mantenibilidad**: Cambios en navegación en un solo lugar

### Layouts

#### default.vue
- Header con logo, theme toggle, user menu
- Footer
- Protegido por middleware auth

#### blank.vue
- Sin navegación
- Ideal para login y reset-password
- Público

### Cómo Usar
```vue
<script setup>
definePageMeta({
  layout: 'default', // o 'blank'
  middleware: 'auth', // si es protegido
})
</script>
```

---

## 8. Gestión de Rutas y Middleware

### Decisión
Usar middleware declarativo en `definePageMeta` para proteger rutas.

### Razón
- **Declarativo**: Fácil de entender qué rutas son públicas
- **Type-safe**: Soporte completo de TypeScript
- **Automático**: Nuxt maneja la ejecución

### Rutas Públicas
- `/` → Home (con redirección condicional)
- `/login` → Login
- `/reset-password` → Reset password

### Rutas Protegidas
- Todas excepto las públicas
- Middleware redirige a login si no autenticado

---

## 9. Validación de Formularios

### Decisión
Validación **cliente-side** manual con mensajes de error en formularios.

### Razón
- **UX**: Feedback inmediato
- **Simplicidad**: No agregar librerías pesadas (Vee-Validate)
- **Control**: Lógica simple y transparente

### Implementación
```vue
<script setup>
const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }
  
  try {
    await authStore.login(username.value, password.value)
  } catch (err) {
    error.value = err.data?.message || 'Error'
  }
}
</script>
```

### Validación Servidor
- El servidor valida todos los datos (nunca confiar solo en cliente)
- Errores del servidor se muestran en el formulario

---

## 10. Estilos con Tailwind CSS

### Decisión
Usar **Tailwind CSS** como framework de estilos con custom colors.

### Razón
- **Utility-first**: Desarrollo rápido
- **Responsive**: Breakpoints built-in
- **Dark mode**: Soporte nativo
- **Performance**: Purge automático en build

### Colores Custom
```typescript
// tailwind.config.ts
colors: {
  primary: {
    50: '#f0f9ff',
    // ...
    600: '#0284c7',
    700: '#0369a1',
    // ...
  },
}
```

### Clases de Componentes
```css
/* assets/css/main.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-600 text-white rounded-lg...
  }
  
  .input-base {
    @apply w-full px-4 py-2 border border-gray-300...
  }
}
```

---

## 11. Manejo de Errores

### Decisión
Capturar errores en nivel de composable y store, mostrar en UI.

### Razón
- **Centralized**: Lógica de error en un lugar
- **Consistent**: Mensajes de error uniformes
- **User-friendly**: Mensajes claros en español

### Error Handling
```typescript
try {
  await api.post('/endpoint', data)
} catch (err: any) {
  error.value = err.data?.message || 'Error desconocido'
}
```

### 401 Unauthorized
```typescript
// useApi.ts
if (error.status === 401) {
  authStore.logout()
  navigateTo('/login')
}
```

---

## 12. Build y Deploy

### Decisión
Build estático para despliegue en cualquier host.

### Razón
- **Hosting flexible**: CDN, S3, cualquier servidor web
- **Cost-effective**: Sin necesidad de servidor Node.js
- **Performance**: Archivos estáticos servidos rápidamente

### Build
```bash
npm run build
# Genera carpeta `.output/public`
```

### Docker (Opcional)
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3001
CMD ["npm", "run", "preview"]
```

---

## 13. DevTools y TypeScript

### Decisión
Habilitar TypeScript estricto y Nuxt DevTools en desarrollo.

### Razón
- **Type safety**: Detecta errores en desarrollo
- **Developer experience**: Debugging más fácil
- **Maintenance**: Código más mantenible

### Configuración
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  // ...
})

// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
  }
}
```

---

## Resumen de Decisiones

| Decisión | Tecnología | Razón |
|----------|-----------|-------|
| Arquitectura | SPA | Experiencia de usuario, rendimiento |
| State | Pinia | Recomendado, TypeScript-friendly |
| Auth | JWT + localStorage | Simple, stateless |
| Tema | Class + localStorage | Integración Tailwind |
| Lógica | Composables | Vue 3 idiomático |
| API URL | Env variable | Flexibility, seguridad |
| Layouts | default/blank | Separación de concerns |
| Routing | Middleware | Type-safe, declarativo |
| Validación | Manual | Simplicidad, control |
| Estilos | Tailwind | Utility-first, responsive |
| Errores | Try/catch | Centralized, consistent |
| Deploy | Build estático | Hosting flexible, performante |

---

**Documento actualizado**: 2024-11-26
**Autor**: AI Copilot

