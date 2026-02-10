# ✅ CHECKLIST DE VALIDACIÓN - CORRECCIONES DE PRODUCCIÓN

**Fecha**: 2026-02-10  
**Objetivo**: Verificar que todas las correcciones funcionan correctamente

---

## 📋 PRE-DEPLOYMENT

### Backend
- [ ] Código compila sin errores: `npm run build`
- [ ] Servicio arranca correctamente: `npm start`
- [ ] Endpoint `/api/v1/auth/login` responde con JSON válido
- [ ] Error 401 devuelve JSON válido con estructura correcta

### Frontend
- [ ] Dependencias instaladas: `npm install`
- [ ] Componente `NotificationContainer.vue` existe
- [ ] Layout incluye `<NotificationContainer />`
- [ ] No hay errores de sintaxis en archivos modificados

---

## 🧪 PRUEBAS FUNCIONALES

### 1. Login con Credenciales Incorrectas
**Pasos**:
1. Limpiar localStorage: `localStorage.clear()`
2. Ir a `http://localhost:3001/login`
3. Ingresar email: `wrong@example.com`
4. Ingresar password: `wrongpassword`
5. Click "Iniciar sesión"

**Resultado Esperado**:
- [ ] Muestra notificación/mensaje: "Credenciales inválidas..."
- [ ] NO redirige al dashboard
- [ ] Permanece en página de login
- [ ] localStorage NO tiene `token` ni `user`
- [ ] Console muestra: "Login fallido: Credenciales inválidas..."

**Resultado Actual**: _____________

---

### 2. Login con Credenciales Correctas
**Pasos**:
1. Limpiar localStorage: `localStorage.clear()`
2. Ir a `http://localhost:3001/login`
3. Click "Usar credenciales de prueba" o ingresar:
   - Email: `dariassoft@gmail.com`
   - Password: `123456`
4. Click "Iniciar sesión"

**Resultado Esperado**:
- [ ] Console muestra: "Login exitoso, navegando al dashboard"
- [ ] Redirige a `http://localhost:3001/` (dashboard)
- [ ] localStorage tiene `token` y `user`
- [ ] Navbar muestra nombre del usuario
- [ ] Dashboard carga datos sin errores

**Resultado Actual**: _____________

---

### 3. Acceso sin Autenticación
**Pasos**:
1. Limpiar localStorage: `localStorage.clear()`
2. Intentar acceder directamente a `http://localhost:3001/ensayos`

**Resultado Esperado**:
- [ ] Console muestra: "Usuario no autenticado, no se cargan datos"
- [ ] Muestra notificación o mensaje
- [ ] Redirige a `http://localhost:3001/login`
- [ ] NO se intenta cargar datos de ensayos

**Resultado Actual**: _____________

---

### 4. Carga de Dashboard con Usuario Autenticado
**Pasos**:
1. Login exitoso (usar test #2)
2. Ir a `http://localhost:3001/` (dashboard)
3. Observar la carga de datos

**Resultado Esperado**:
- [ ] Console muestra: "Dashboard: Usuario autenticado, cargando datos..."
- [ ] Se cargan ensayos sin errores
- [ ] Widgets de estadísticas muestran datos
- [ ] Lista de ensayos recientes se muestra
- [ ] NO hay errores en console

**Resultado Actual**: _____________

---

### 5. Carga de Página Ensayos
**Pasos**:
1. Login exitoso (usar test #2)
2. Ir a `http://localhost:3001/ensayos`
3. Observar la carga de datos

**Resultado Esperado**:
- [ ] NO hay warnings "Usuario no autenticado"
- [ ] Se carga la tabla de ensayos
- [ ] Paginación funciona
- [ ] Búsqueda funciona
- [ ] NO hay errores "IDBKeyRange" en console
- [ ] NO hay errores "Cannot read 'length'"

**Resultado Actual**: _____________

---

### 6. Sesión Expirada (Simulación)
**Pasos**:
1. Login exitoso
2. En DevTools Console, eliminar token: `localStorage.removeItem('token')`
3. Intentar navegar a `/ensayos` o hacer cualquier acción que requiera API

**Resultado Esperado**:
- [ ] API devuelve 401
- [ ] Muestra notificación: "Tu sesión ha expirado..."
- [ ] Limpia localStorage
- [ ] Redirige a `/login`
- [ ] useApi intercepta el error correctamente

**Resultado Actual**: _____________

---

## 🔍 VALIDACIÓN EN BROWSER DEVTOOLS

### Console
- [ ] NO hay errores rojos (excepto los esperados al simular errores)
- [ ] Warnings de "Usuario no autenticado" solo aparecen cuando corresponde
- [ ] Logs muestran flujo correcto de autenticación

### Network
- [ ] POST `/api/v1/auth/login` con credenciales incorrectas → 401
- [ ] POST `/api/v1/auth/login` con credenciales correctas → 200/201
- [ ] GET `/api/v1/ensayos` sin token → 401 (si middleware está activo)
- [ ] GET `/api/v1/ensayos` con token → 200

### Application > Local Storage
- [ ] Login exitoso guarda `token` y `user`
- [ ] Login fallido NO guarda nada
- [ ] Logout limpia `token` y `user`
- [ ] Error 401 limpia `token` y `user`

---

## 📊 BACKEND LOGS

### Logs a Verificar (en terminal del backend)
```bash
docker-compose -f tms-backend/docker-compose.yml logs -f app | grep -E "login|auth|401"
```

**Buscar**:
- [ ] Login fallido → Log: "Usuario no encontrado" o "Contraseña incorrecta"
- [ ] Login exitoso → Log: "Usuario autenticado: [email]" (si existe)
- [ ] Error 401 → Response JSON válida con estructura correcta

---

## 🎯 CRITERIOS DE ACEPTACIÓN

| Criterio | Estado |
|----------|--------|
| Login fallido NO permite acceso | ⬜ |
| Login exitoso permite acceso | ⬜ |
| Acceso sin auth redirige a login | ⬜ |
| Error 401 limpia sesión y redirige | ⬜ |
| Notificaciones se muestran correctamente | ⬜ |
| NO hay errores IDBKeyRange | ⬜ |
| NO hay errores "Cannot read 'length'" | ⬜ |
| Backend siempre devuelve JSON válido | ⬜ |

---

## 🚀 DEPLOYMENT CHECKLIST

### Antes de Deploy
- [ ] Todas las pruebas funcionales pasadas
- [ ] Todos los criterios de aceptación cumplidos
- [ ] Código revisado y sin console.log innecesarios
- [ ] Documentación actualizada

### Durante Deploy
- [ ] Backend: `npm run build` exitoso
- [ ] Frontend: `npm run build` exitoso
- [ ] Variables de entorno configuradas
- [ ] Docker containers arrancados correctamente

### Después de Deploy
- [ ] Smoke test: Login con credenciales correctas
- [ ] Smoke test: Login con credenciales incorrectas
- [ ] Smoke test: Navegación a páginas principales
- [ ] Monitorear logs por 10 minutos

---

## 📝 NOTAS DE TESTING

### Ambiente de Prueba
- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:3001`
- **Base de Datos**: MySQL en Docker

### Credenciales de Prueba
- **Email**: `dariassoft@gmail.com`
- **Password**: `123456`

### Comandos Útiles
```bash
# Limpiar localStorage en DevTools Console
localStorage.clear()

# Ver token actual
localStorage.getItem('token')

# Ver usuario actual
JSON.parse(localStorage.getItem('user'))

# Ver logs backend
docker-compose -f tms-backend/docker-compose.yml logs -f app

# Ver logs frontend
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml logs -f nuxt
```

---

## ✅ FIRMA DE VALIDACIÓN

- **Tester**: _____________
- **Fecha**: _____________
- **Resultado**: ⬜ APROBADO / ⬜ RECHAZADO
- **Observaciones**: 

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

---

**Documento**: CHECKLIST_VALIDACION_CORRECCIONES.md  
**Versión**: 1.0  
**Última actualización**: 2026-02-10

