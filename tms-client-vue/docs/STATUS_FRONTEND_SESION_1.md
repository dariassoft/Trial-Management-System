# 🎨 STATUS FRONTEND - TRIAL MANAGEMENT SYSTEM

**Fecha**: 27 de Noviembre 2025  
**Versión**: 1.0  
**Status**: ✅ OPERATIVO Y LISTO PARA DESARROLLO DE PANTALLAS

---

## 📱 VISIÓN DEL FRONTEND

El frontend es la interfaz web moderna donde los usuarios interactúan con el sistema de gestión de ensayos agronómicos.

**Tecnología**: Nuxt 3 (Vue 3 + SSR)  
**Estilo**: TailwindCSS  
**Estado**: Pinia  
**API**: Axios + Composables

---

## ✅ ESTADO ACTUAL

### 🏗️ Infraestructura
| Componente | Status | Detalles |
|-----------|--------|----------|
| **Nuxt 3** | ✅ Corriendo | Puerto 3001 |
| **Pinia** | ✅ Configurado | State management |
| **TailwindCSS** | ✅ Listo | Sistema de estilos |
| **Composables** | ✅ Funcionales | useApi, useTheme |
| **Docker** | ✅ Automático | npm install + npm run dev |

### 📦 Dependencias Principales
```json
{
  "@pinia/nuxt": "^0.4.11",
  "pinia": "^2.1.7",
  "nuxt": "^3.9.1",
  "vue": "^3.3.9",
  "@headlessui/vue": "^1.7.17",
  "@heroicons/vue": "^2.0.18",
  "tailwindcss": "^3.3.6",
  "axios": "^1.6.2"
}
```

### 🗂️ Estructura de Carpetas

```
tms-client-vue/
│
├── app.vue                    # Root component
├── nuxt.config.ts            # Nuxt config
├── tailwind.config.ts        # TailwindCSS config
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
│
├── composables/
│   ├── useApi.ts            # ✅ API calls wrapper
│   └── useTheme.ts          # ✅ Dark mode toggle
│
├── stores/
│   ├── auth.ts              # ✅ Pinia auth store
│   └── (más stores por crear)
│
├── layouts/
│   ├── default.vue          # ✅ Main layout
│   └── blank.vue            # ✅ Auth layout
│
├── pages/
│   ├── index.vue            # ✅ Dashboard
│   ├── login.vue            # ✅ Login form
│   └── reset-password.vue   # ✅ Password reset
│
├── middleware/
│   └── auth.ts              # ✅ Route protection
│
├── components/
│   └── (Componentes reutilizables - por crear)
│
├── assets/
│   └── css/
│       └── main.css         # ✅ Base styles
│
└── docs/
    └── (Documentación - por crear)
```

---

## 🔐 AUTENTICACIÓN

### Flujo de Login
```
1. Usuario ingresa credentials
   ↓
2. composable useApi.login() envía POST a /auth/login
   ↓
3. Backend retorna { accessToken, user }
   ↓
4. Store auth.ts guarda:
   - jwt_token en localStorage
   - user info en Pinia state
   ↓
5. Middleware auth.ts protege rutas
   ↓
6. Usuario accede a dashboard
```

### Store Auth (Pinia)
```typescript
useAuthStore()
├── state.user             // Datos del usuario
├── state.token            // JWT token
├── state.isAuthenticated  // Boolean
├── actions.login()        // Login action
├── actions.logout()       // Logout action
└── getters.isAdmin()      // Check role
```

### Composable API
```typescript
useApi()
├── login(credentials)           // Autenticación
├── getEnsayos()                // Listar ensayos
├── getEnsayoById(id)           // Detalle ensayo
├── createEnsayo(data)          // Crear
├── updateEnsayo(id, data)      // Editar
├── deleteEnsayo(id)            // Eliminar
└── (más métodos por agregar)
```

---

## 🎨 PÁGINAS ACTUALES

### 1. Login (`pages/login.vue`)
- ✅ Formulario con validación
- ✅ Integración con API
- ✅ Redirección a dashboard si está autenticado
- ✅ Manejo de errores
- ✅ Link a reset password

**Campos**:
- Email (required, email format)
- Contraseña (required, min 6)

### 2. Dashboard (`pages/index.vue`)
- ✅ Página protegida (requiere auth)
- ✅ Saludo personalizado
- ✅ Botón logout
- ✅ Layout default

### 3. Reset Password (`pages/reset-password.vue`)
- ✅ Formulario básico
- ✅ Link a login

### 4. Layouts
- **default.vue**: Sidebar, header, footer
- **blank.vue**: Solo contenido (para login)

---

## 🎨 ESTILOS

### Configuración TailwindCSS
- ✅ Colores personalizados (primary: azul cielo)
- ✅ Dark mode soportado
- ✅ Componentes base (btn, input, card)
- ✅ Responsive design

### Temas CSS Disponibles
```css
/* Componentes reutilizables */
.btn-primary       /* Botón principal */
.btn-secondary     /* Botón secundario */
.input-base        /* Inputs estándar */
.card              /* Tarjetas */
```

---

## 🔄 FLUJO DE DATOS

```
┌─────────────────────────────────────────┐
│         PÁGINA NUXT (Vue 3)             │
│  - Componente template                  │
│  - Manejo de eventos                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│    COMPOSABLE (useApi.ts)               │
│  - Llamadas a API                       │
│  - Transformación de datos              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│    PINIA STORE (auth.ts)                │
│  - Estado global                        │
│  - Lógica compartida                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   AXIOS HTTP CLIENT                     │
│  - Headers con JWT                      │
│  - Base URL configurada                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   BACKEND API (localhost:3000)          │
│  - NestJS endpoints                     │
│  - Validación                           │
│  - Base de datos                        │
└─────────────────────────────────────────┘
```

---

## 🚀 PRÓXIMAS PANTALLAS A CREAR

### Fase 1: CRUD Básico (Próxima Sesión)
1. **Ensayos - Listar** (`/ensayos`)
   - Tabla con paginación
   - Búsqueda y filtros
   - Acciones (ver, editar, eliminar)

2. **Ensayos - Crear** (`/ensayos/new`)
   - Formulario con campos
   - Validación
   - Integración API

3. **Ensayos - Detalle** (`/ensayos/:id`)
   - Ver información
   - Editar
   - Eliminar con confirmación

### Fase 2: Diseño Experimental
1. **Bloques** - Crear/editar bloques
2. **Parcelas** - Crear/editar parcelas
3. **Tratamientos** - Gestión de tratamientos

### Fase 3: Carga de Datos
1. **Datos de Campo** - Formulario de mediciones
2. **Fotos** - Upload de imágenes
3. **Momentos de Evaluación** - Planificación

### Fase 4: Reportes
1. **Tabla de Datos** - Vista de mediciones
2. **Gráficos** - Análisis visual
3. **Exportar** - PDF y Excel

### Fase 5: Administración
1. **Usuarios** - Gestión
2. **Laboratorios** - Asignación
3. **Roles** - Permisos

---

## 🎯 CONVENCIONES DE DESARROLLO

### Estructura de Componentes
```typescript
// pages/ensayos/index.vue
<template>
  <div class="page">
    <!-- Contenido -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

// Variables reactivas
const ensayos = ref([])
const loading = ref(false)

// Composables y stores
const api = useApi()
const auth = useAuthStore()

// Métodos
onMounted(async () => {
  loading.value = true
  ensayos.value = await api.getEnsayos()
  loading.value = false
})
</script>

<style scoped>
/* Estilos locales */
</style>
```

### Nombres de Archivos
- Componentes: `PascalCase.vue`
- Páginas: `kebab-case.vue`
- Stores: `camelCase.ts`
- Composables: `useCamelCase.ts`

### Imports
```typescript
// Siempre usar alias @
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
```

---

## 🔗 INTEGRACIÓN BACKEND-FRONTEND

### URL Base API
```typescript
// En nuxt.config.ts
runtimeConfig: {
  public: {
    apiBase: 'http://localhost:3000/api/v1'
  }
}
```

### Headers HTTP
```typescript
// Axios automáticamente añade:
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Manejo de Errores
```typescript
try {
  const data = await api.getEnsayos()
} catch (error) {
  // 401 → Redirect a login
  // 403 → Mostrar "Sin permisos"
  // 500 → Mostrar error genérico
}
```

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Backend
- `/docs/README.md` - Punto de entrada
- `/docs/API_DOCUMENTATION.md` - Endpoints
- `/docs/TMS_Postman_2025.postman_collection.json` - Tests

### URLs Útiles
- Swagger UI: http://localhost:3000/docs
- API REST: http://localhost:3000/api/v1
- Frontend Dev: http://localhost:3001

### Credenciales Test
```
Email: dariassoft@gmail.com
Pass:  123456
```

---

## ✅ CHECKLIST ANTES DE PRÓXIMA SESIÓN

- ✅ Entender el flujo de trabajo del proyecto
- ✅ Familiarizarse con Nuxt 3 + Pinia
- ✅ Revisar API documentation
- ✅ Probar login en el frontend
- ✅ Revisar estructura de carpetas
- ✅ Entender composables y stores

---

## 🎯 OBJETIVO DE PRÓXIMA SESIÓN

**Crear pantalla completa de Listado de Ensayos**

1. Tabla con datos de BD
2. Búsqueda y filtros
3. Paginación
4. Acciones (ver, editar, eliminar)
5. Botón "Nuevo Ensayo"

---

**✨ FRONTEND LISTO PARA EXPANSIÓN ✨**

**Próxima sesión**: Pantalla de Ensayos CRUD


