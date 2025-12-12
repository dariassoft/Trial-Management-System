# TMS Frontend - Vue 3 + Nuxt 3 SPA

Aplicación de Cliente para el Sistema de Gestión de Ensayos Agronómicos.

## Características

- ✅ **SPA (Single Page Application)** - Modo SSR deshabilitado
- ✅ **Autenticación JWT** - Login, logout, reset de contraseña
- ✅ **Theme Light/Dark** - Cambio de tema con persistencia
- ✅ **Responsive Design** - Diseño adaptable a todos los dispositivos
- ✅ **CORS Habilitado** - Conexión directa con la API
- ✅ **TypeScript** - Tipado completo
- ✅ **Tailwind CSS** - Framework de estilos

## Stack Tecnológico

### Frontend
- **Nuxt 3** - Framework Vue.js meta
- **Vue 3** - Framework progresivo
- **TypeScript** - Tipado estático
- **Pinia** - State management
- **Tailwind CSS** - Utilidades CSS
- **Axios** - Cliente HTTP

## Estructura del Proyecto

```
tms-client-vue/
├── assets/
│   └── css/
│       └── main.css          # Estilos globales
├── components/                # Componentes Vue reutilizables
├── composables/
│   ├── useApi.ts             # Composable para requests HTTP
│   └── useTheme.ts           # Composable para tema light/dark
├── layouts/
│   ├── default.vue           # Layout con header y footer
│   └── blank.vue             # Layout sin navegación
├── middleware/
│   └── auth.ts               # Middleware de autenticación
├── pages/
│   ├── index.vue             # Home page (Dashboard)
│   ├── login.vue             # Login page
│   └── reset-password.vue    # Reset password page
├── stores/
│   └── auth.ts               # Pinia store de autenticación
├── app.vue                   # Root component
├── nuxt.config.ts            # Configuración de Nuxt
├── tailwind.config.ts        # Configuración de Tailwind
└── package.json
```

## Instalación

```bash
cd tms-client-vue
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## Build para Producción

```bash
npm run build
npm run preview
```

## Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# API Base URL
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
```

## CORS

La API está configurada con CORS habilitado globalmente. El frontend puede hacer requests directamente sin configuración adicional.

## Flujo de Autenticación

1. **Login**: Usuario ingresa credenciales
2. **Validación**: Backend valida y retorna JWT token
3. **Almacenamiento**: Token guardado en localStorage
4. **Requests**: Token incluido en header `Authorization: Bearer <token>`
5. **Expiración**: Si token expira (401), usuario es redirigido a login

## Páginas Implementadas

### 1. Login (`/login`)
- Formulario de autenticación
- Credenciales de demo
- Enlace a "Olvidé contraseña"
- Manejo de errores

### 2. Reset Password (`/reset-password`)
- Verificación de email
- Ingreso de código de confirmación
- Actualización de contraseña
- Validación de contraseña

### 3. Home/Dashboard (`/`)
- Bienvenida personalizada
- Estadísticas rápidas
- Listado de ensayos recientes
- Acceso a detalles de ensayos

## Temas

### Light Theme (Defecto)
- Fondo blanco
- Texto oscuro
- Acentos en azul (primary-600)

### Dark Theme
- Fondo oscuro (gray-900)
- Texto claro
- Acentos en azul (primary-600)

El tema se guarda en localStorage y se restaura al recargar la página.

## Componentes y Composables

### Composable: `useApi`
```typescript
const api = useApi()
await api.get('/ensayos')
await api.post('/ensayos', data)
```

### Composable: `useTheme`
```typescript
const { isDark, initializeTheme, toggleTheme } = useTheme()
```

### Store: `useAuthStore`
```typescript
const authStore = useAuthStore()
authStore.login(username, password)
authStore.logout()
authStore.resetPassword(email)
```

## Manejo de Errores

- **401 Unauthorized**: Redirige a login
- **Errores de validación**: Mostrados en formularios
- **Errores de red**: Capturados y mostrados al usuario

## Consideraciones de Desarrollo

### CORS
✅ API con CORS habilitado
✅ Frontend puede hacer requests directamente
✅ Credenciales en header Authorization

### Seguridad
✅ Token JWT almacenado en localStorage
✅ Contraseñas nunca se envían sin SSL en producción
✅ Middleware de autenticación en rutas protegidas

### Performance
✅ SPA: Carga de página rápida
✅ Lazy loading de componentes
✅ Compresión de assets

## Deploy

### Docker (Recomendado)
```bash
docker build -t tms-client .
docker run -p 3001:3001 tms-client
```

### Vercel/Netlify
```bash
npm run build
# Subir carpeta `.output/public` o `.dist`
```

## Próximas Funcionalidades

- [ ] Gestión de ensayos
- [ ] Carga de datos de campo
- [ ] Reportes y gráficos
- [ ] Gestión de usuarios (admin)
- [ ] Integración de cámara para fotos
- [ ] Sincronización offline

---

**Última actualización**: 2024-11-26

