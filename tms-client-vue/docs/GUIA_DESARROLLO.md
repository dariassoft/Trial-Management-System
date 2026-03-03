# Guía de Desarrollo - TMS Frontend

Guía práctica para desarrolladores que trabajan en el frontend de Trial Management System.

## 1. Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Setup Inicial
```bash
# Clonar o navegar al proyecto
cd tms-client-vue

# Instalar dependencias
npm install

# Crear archivo .env
echo "NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

Acceder en: `http://localhost:3001`

---

## 2. Estructura de Carpetas

```
tms-client-vue/
├── assets/
│   └── css/
│       └── main.css          # Estilos globales con Tailwind
├── components/
│   └── (componentes reutilizables)
├── composables/
│   ├── useApi.ts             # Cliente HTTP
│   └── useTheme.ts           # Gestión de tema
├── layouts/
│   ├── default.vue           # Layout principal con header
│   └── blank.vue             # Layout sin header
├── middleware/
│   └── auth.ts               # Protección de rutas
├── pages/
│   ├── index.vue             # Home/Dashboard
│   ├── login.vue             # Página de login
│   └── reset-password.vue    # Reset de contraseña
├── stores/
│   └── auth.ts               # Pinia store de autenticación
├── app.vue                   # Root component
├── nuxt.config.ts            # Config de Nuxt
├── tailwind.config.ts        # Config de Tailwind
└── package.json
```

---

## 3. Flujo de Trabajo Típico

### Crear una Nueva Página

1. **Crear archivo en `pages/`**
```vue
<!-- pages/ensayos.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

// Tu lógica aquí
</script>

<template>
  <!-- Tu contenido aquí -->
</template>
```

2. **Usar composables si necesitas datos**
```typescript
const api = useApi()
const ensayos = ref([])

onMounted(async () => {
  ensayos.value = await api.get('/ensayos')
})
```

3. **Agregar al navegador (header)**
Editar `layouts/default.vue` para agregar link de navegación.

---

### Crear un Componente Reutilizable

1. **Crear archivo en `components/`**
```vue
<!-- components/EnsayoCard.vue -->
<script setup lang="ts">
defineProps<{
  ensayo: any
}>()
</script>

<template>
  <div class="card">
    <h3 class="font-bold">{{ ensayo.nombre }}</h3>
    <!-- ... -->
  </div>
</template>
```

2. **Usarlo en páginas** (auto-importado)
```vue
<template>
  <EnsayoCard :ensayo="ensayo" />
</template>
```

---

### Agregar una Nueva Funcionalidad a Auth

1. **Editar `stores/auth.ts`**
```typescript
const myNewFunction = async (param: string) => {
  try {
    const response = await $fetch(`${apiBase}/endpoint`, {
      method: 'POST',
      body: { param },
    })
    return response
  } catch (err: any) {
    error.value = err.data?.message || 'Error'
    throw err
  }
}

return {
  // ...
  myNewFunction,
}
```

2. **Usar en componentes**
```vue
<script setup lang="ts">
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.myNewFunction('valor')
})
</script>
```

---

## 4. Trabajar con la API

### Usar el Composable `useApi`

```typescript
const api = useApi()

// GET
const data = await api.get('/ensayos')

// POST
const created = await api.post('/ensayos', {
  nombre_ensayo: 'Mi Ensayo',
  // ...
})

// PATCH
const updated = await api.patch('/ensayos/1', {
  nombre_ensayo: 'Nombre Actualizado',
})

// DELETE
await api.delete('/ensayos/1')
```

### Manejo de Errores
```typescript
try {
  const data = await api.get('/endpoint')
} catch (err: any) {
  console.error('Error:', err.data?.message)
  // Mostrar error al usuario
}
```

### Headers Automáticos
- Token JWT se agrega automáticamente en Authorization header
- Content-Type se maneja automáticamente
- 401 automáticamente redirige a login

---

## 5. Gestión de Estado (Pinia)

### Acceder a Store
```typescript
const authStore = useAuthStore()

// Leer estado
console.log(authStore.token)
console.log(authStore.isAuthenticated)

// Llamar acciones
await authStore.login(username, password)
authStore.logout()
```

### Crear un Nuevo Store
```typescript
// stores/myStore.ts
export const useMyStore = defineStore('myStore', () => {
  const myRef = ref(null)
  const myComputed = computed(() => myRef.value?.name)
  
  const myAction = async () => {
    // ...
  }
  
  return { myRef, myComputed, myAction }
})
```

---

## 6. Estilos con Tailwind

### Clases Disponibles

**Botones**
```html
<!-- Primary -->
<button class="btn-primary">Enviar</button>

<!-- Secondary -->
<button class="btn-secondary">Cancelar</button>
```

**Inputs**
```html
<input class="input-base" type="text" />
```

**Cards**
```html
<div class="card">
  <p>Contenido</p>
</div>
```

### Dark Mode
Usar prefijo `dark:` para estilos en modo oscuro
```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Contenido
</div>
```

### Responsive
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <!-- 1 col en mobile, 2 en tablet, 4 en desktop -->
</div>
```

---

## 7. Autenticación

### Login
```typescript
const authStore = useAuthStore()
await authStore.login('usuario@email.com', 'password')
// Token se guarda automáticamente
```

### Verificar si está autenticado
```typescript
if (authStore.isAuthenticated) {
  // Usuario autenticado
}
```

### Logout
```typescript
authStore.logout()
navigateTo('/login')
```

### Obtener información del usuario
```typescript
console.log(authStore.user.nombre)
console.log(authStore.userRole) // Ej: 'Manager'
```

---

## 8. Tema Light/Dark

### Toggle Tema
```typescript
const { isDark, toggleTheme } = useTheme()

// En un botón
<button @click="toggleTheme">
  {{ isDark ? '☀️' : '🌙' }}
</button>
```

### Verificar tema actual
```typescript
const { isDark } = useTheme()

if (isDark.value) {
  // Dark mode activo
}
```

### Aplicar automáticamente al montar
```typescript
onMounted(() => {
  const { initializeTheme } = useTheme()
  initializeTheme()
})
```

---

## 9. Debugging

### DevTools de Nuxt
Presionar `Shift + Option + D` (Mac) o `Shift + Alt + D` (Windows) para abrir DevTools.

### Console del navegador
```typescript
// Ver estado de Pinia
console.log(useAuthStore())

// Ver configuración
console.log(useRuntimeConfig())
```

### Vue DevTools
Instalar extensión de Chrome/Firefox para debugging avanzado.

---

## 10. Build y Deploy

### Desarrollo
```bash
npm run dev
```

### Build para producción
```bash
npm run build
# Genera carpeta .output/public
```

### Preview del build
```bash
npm run preview
# Simula el build en localhost
```

### Typecheck
```bash
npm run typecheck
# Verifica tipos sin compilar
```

---

## 11. Environment Variables

### Archivo `.env.local`
```env
# URL de la API
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
```

### En el código
```typescript
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
```

### Variables según ambiente

**Desarrollo**
```env
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
```

**Producción**
```env
NUXT_PUBLIC_API_BASE=https://api.example.com/api/v1
```

---

## 12. Características Útiles

### Auto-import de Composables
Los composables se importan automáticamente, no necesitas hacer `import`:

```typescript
// Así funciona directamente:
const api = useApi()
const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()
```

### Auto-import de Componentes
Los componentes en `components/` se importan automáticamente:

```vue
<template>
  <!-- No necesitas importar MyComponent -->
  <MyComponent />
</template>
```

### Navegación
```typescript
// Nuxt Link (recomendado)
<NuxtLink to="/login">Ir a login</NuxtLink>

// En código
navigateTo('/ensayos')
```

---

## 13. Testing (Opcional)

Para agregar tests:

```bash
npm install -D vitest @vue/test-utils
```

Crear archivo `tests/myComponent.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('MyComponent', () => {
  it('renderiza correctamente', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('texto esperado')
  })
})
```

---

## 14. Checklist de Desarrollo

### Antes de hacer commit
- [ ] Código sigue convenciones (camelCase, PascalCase)
- [ ] Sin console.log() en producción
- [ ] Manejo de errores correcto
- [ ] Responsive (probado en mobile)
- [ ] Dark mode funciona
- [ ] No hay TypeScript errors

### Antes de hacer deploy
- [ ] `npm run build` sin errores
- [ ] `npm run preview` funciona
- [ ] Todas las variables de env configuradas
- [ ] URLs de API correctas
- [ ] Testing en navegadores principales

---

## 15. Troubleshooting

### Error: "Cannot find module 'composable'"
- Asegurar archivo está en `composables/`
- Naming: archivo debe ser `useXXX.ts`

### Token no persiste
- Verificar localStorage está habilitado
- Revisar console de browser
- Probar en modo incógnito

### API retorna CORS error
- Backend debe tener `app.enableCors()`
- Verificar origin en desarrollo

### Estilos no aplican
- Verificar clase de Tailwind en whitelist
- Ejecutar `npm run build` para ver si el warning aparece

---

**Última actualización**: 2024-11-26

