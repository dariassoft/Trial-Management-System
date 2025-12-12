# Quick Reference - TMS Frontend

## 🚀 Comandos Esenciales

```bash
# Desarrollo
npm run dev                    # Iniciar servidor dev (port 3001)
npm run build                  # Build producción
npm run preview               # Preview del build
npm run typecheck             # Verificar tipos TS

# Testing (cuando lo configures)
npm run test                   # Ejecutar tests
npm run test:ui               # UI interactiva
npm run test:coverage         # Coverage report
```

## 🔑 Endpoints API

```
Autenticación:
POST   /api/v1/auth/login              → { accessToken, user }
POST   /api/v1/auth/bootstrap-hash     → { updated: boolean }

Usuarios:
GET    /api/v1/users                   → { data, meta }
POST   /api/v1/users                   → Nueva usuario
GET    /api/v1/users/{id}              → Usuario detalle
PATCH  /api/v1/users/{id}              → Actualizar usuario
DELETE /api/v1/users/{id}              → Eliminar usuario

Ensayos:
GET    /api/v1/ensayos?limit=10&page=1  → { data, meta }
POST   /api/v1/ensayos                 → Crear ensayo
GET    /api/v1/ensayos/{id}            → Ensayo detalle
PATCH  /api/v1/ensayos/{id}            → Actualizar ensayo
DELETE /api/v1/ensayos/{id}            → Eliminar ensayo
```

## 🏪 Pinia Store - useAuthStore

```typescript
// Leer estado
authStore.token              // JWT token
authStore.user               // Usuario info
authStore.isAuthenticated    // Computed: ¿autenticado?
authStore.userRole           // Computed: rol del usuario

// Acciones
await authStore.login(email, password)
authStore.logout()
await authStore.resetPassword(email)

// Inicializar
authStore.initializeAuth()   // Restaurar desde localStorage
```

## 🎣 Composables

### useApi
```typescript
const api = useApi()

// Métodos
await api.get('/endpoint')
await api.post('/endpoint', data)
await api.patch('/endpoint', data)
await api.delete('/endpoint')

// Manejo de errores
try {
  await api.get('/data')
} catch (err: any) {
  console.error(err.data?.message)
}

// Token se agrega automáticamente
// 401 redirige automáticamente a login
```

### useTheme
```typescript
const { isDark, toggleTheme, initializeTheme } = useTheme()

// Inicializar al montar
onMounted(() => {
  initializeTheme()
})

// Toggle
<button @click="toggleTheme">
  {{ isDark ? '☀️' : '🌙' }}
</button>
```

## 📄 Middleware - auth.ts

```typescript
// Rutas públicas
/login, /reset-password, /

// Rutas protegidas
Todas las demás

// Comportamiento
Si no autenticado → redirige a /login
Si autenticado en /login → redirige a /
```

## 🎨 Clases Tailwind Disponibles

```html
<!-- Botones -->
<button class="btn-primary">Primario</button>
<button class="btn-secondary">Secundario</button>

<!-- Inputs -->
<input class="input-base" type="text" />
<textarea class="input-base"></textarea>

<!-- Cards -->
<div class="card">Contenido</div>

<!-- Dark Mode -->
<div class="bg-white dark:bg-gray-800">
  Light/Dark
</div>
```

## 📱 Layouts

```typescript
// Layout con header/footer
definePageMeta({
  layout: 'default'
})

// Layout sin navegación
definePageMeta({
  layout: 'blank'
})
```

## 🔐 Autenticación - Flujo

```
1. Usuario llena login form
   ↓
2. authStore.login(email, password)
   ↓
3. POST /api/v1/auth/login
   ↓
4. Backend retorna: { accessToken, user }
   ↓
5. Store guarda en localStorage
   ↓
6. Redirige a /
   ↓
7. Token se envía en Authorization header automáticamente
   ↓
8. Si 401 → logout automático
```

## 📝 Crear Nueva Página

```typescript
// pages/nueva-pagina.vue
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const api = useApi()
const authStore = useAuthStore()

onMounted(async () => {
  // Tu lógica
})
</script>

<template>
  <!-- Tu HTML -->
</template>
```

## 🛠️ Debugging

```bash
# DevTools de Nuxt
Shift + Alt + D (Windows/Linux)
Shift + Option + D (Mac)

# Console del navegador
F12 → Console

# Ver estado de Pinia
useAuthStore() en console

# Ver configuración
useRuntimeConfig() en console
```

## ⚙️ Variables de Entorno

```env
# .env.local (desarrollo)
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1

# .env.production (producción)
NUXT_PUBLIC_API_BASE=https://api.example.com/api/v1

# Uso en código
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
```

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| CORS error | API no permite origen | Ver CORS_CONFIGURATION.md |
| 401 Unauthorized | Token inválido/expirado | Hacer login nuevamente |
| Cannot find module | Ruta incorrecta | Usar `~` para raíz: `~/components` |
| Theme no aplica | Clase `dark` no en HTML | Reiniciar dev server |
| API retorna error | Endpoint incorrecto | Verificar en Swagger del backend |

## 📚 Documentación Rápida

- **INDEX.md** - Índice central
- **GUIA_DESARROLLO.md** - Cómo desarrollar
- **DECISIONES_ARQUITECTONICAS.md** - Por qué así
- **CORS_CONFIGURATION.md** - Resolver CORS
- **GUIA_TESTING.md** - Cómo testear
- **GUIA_DEPLOYMENT.md** - Cómo deployar

## 💾 Archivos Importantes

```
/tms-client-vue/
├── pages/index.vue            Home page
├── pages/login.vue            Login page
├── pages/reset-password.vue   Reset page
├── stores/auth.ts             Auth store
├── composables/useApi.ts      HTTP client
├── composables/useTheme.ts    Theme management
├── middleware/auth.ts         Route protection
├── layouts/default.vue        Main layout
├── layouts/blank.vue          Auth layout
├── nuxt.config.ts             Config
└── tailwind.config.ts         Tailwind config
```

## 🔗 Enlaces Útiles

- Nuxt Docs: https://nuxt.com
- Vue 3 Docs: https://vuejs.org
- Tailwind Docs: https://tailwindcss.com
- Pinia Docs: https://pinia.vuejs.org
- TypeScript Docs: https://www.typescriptlang.org

## 📞 Soporte

1. Lee la documentación relevante en `/docs/`
2. Busca ejemplos en el código
3. Usa DevTools para debugging
4. Revisa console de errores
5. Consulta README.md

---

**Última actualización**: 2024-11-26

