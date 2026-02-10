# Checklist de Validación de Errores Corregidos

## ✅ Pre-Despliegue

### Verificación en Desarrollo
- [ ] Clonar/actualizar cambios del repositorio
- [ ] Ejecutar `npm install` si es necesario
- [ ] Verificar que no hay errores TypeScript (warnings están OK)
- [ ] Hacer build local: `npm run build`

```bash
# Comandos a ejecutar
cd tms-client-vue
npm install
npm run build
```

---

## 🧪 Testing Manual - Error 1: JSON 500

### Escenario 1.1: Error del Servidor (500)
**¿Cómo reproducir?**
1. Ir a `/login`
2. Ingresar cualquier credencial
3. (Simular error 500 en backend - opcional)

**Verificar:**
- [ ] No aparece error crudo "undefined is not valid JSON"
- [ ] Aparece mensaje: "Error en el servidor. Por favor, intenta más tarde."
- [ ] Usuario se queda en página de login
- [ ] Console no tiene error sin captura

**Script de Test:**
```javascript
// En console del navegador (F12)
localStorage.clear()
location.href = '/login'
```

---

## 🧪 Testing Manual - Error 2: Credenciales Incorrectas

### Escenario 2.1: Email incorrecto
**Pasos:**
1. Ir a `/login`
2. Email: `invalido@test.com`
3. Password: `123456`
4. Click "Iniciar sesión"

**Verificar:**
- [ ] Aparece error: "Credenciales inválidas. Por favor, verifica tu email y contraseña."
- [ ] Se queda en `/login` (NO redirige)
- [ ] Campo password está vacío
- [ ] Puede reintentar login

**❌ No debe pasar:**
- [ ] ❌ No debe entrar al dashboard
- [ ] ❌ No debe mostrar error técnico
- [ ] ❌ No debe haber error en consola sobre parsing JSON

### Escenario 2.2: Password incorrecto
**Pasos:**
1. Ir a `/login`
2. Email: `dariassoft@gmail.com` (válido)
3. Password: `incorrectpassword`
4. Click "Iniciar sesión"

**Verificar:**
- [ ] Aparece error: "Credenciales inválidas..."
- [ ] Se queda en login
- [ ] Password limpiado

---

## 🧪 Testing Manual - Error 3: Login Exitoso

### Escenario 3.1: Login correcto
**Pasos:**
1. Ir a `/login`
2. Email: `dariassoft@gmail.com`
3. Password: `123456`
4. Click "Iniciar sesión"

**Verificar:**
- [ ] Redirige a `/` (dashboard)
- [ ] Muestra: "Bienvenido, [nombre]"
- [ ] Carga "Ensayos Recientes"
- [ ] No hay error de IndexedDB
- [ ] No hay error de circular JSON

**En Console (F12):**
- [ ] Aparece: "Dashboard: Usuario autenticado, cargando datos..."
- [ ] Aparece: "Ensayos cargados en dashboard: [número]"
- [ ] NO aparece: "DataError: Failed to execute 'only' on 'IDBKeyRange'"

**❌ No debe pasar:**
- [ ] ❌ No debe mostrar "Converting circular structure to JSON"
- [ ] ❌ No debe mostrar "Cannot read properties of undefined (reading 'length')"
- [ ] ❌ No debe haber error de "Cannot read properties of undefined"

---

## 🧪 Testing Manual - Error 4: IndexedDB & Array Length

### Escenario 4.1: Cargar página de Ensayos
**Pasos:**
1. Login exitoso
2. Ir a `/ensayos`

**Verificar:**
- [ ] Carga tabla de ensayos
- [ ] Muestra cantidad correcta de ensayos
- [ ] No hay error: "IDBKeyRange.only parameter is not a valid key"
- [ ] No hay error: "Cannot read properties of undefined (reading 'length')"

**En Console:**
- [ ] Aparece: "Ensayos cargados exitosamente: [count]"
- [ ] No hay errores de IndexedDB

### Escenario 4.2: Crear nuevo ensayo
**Pasos:**
1. Login
2. Ir a `/ensayos`
3. Click "Nuevo Ensayo"
4. Llenar formulario
5. Click "Guardar"

**Verificar:**
- [ ] Muestra cultivos correctamente
- [ ] Muestra variedades cuando selecciona cultivo
- [ ] No hay error de `fetchCultivos` o `fetchVariedades`

**En Console:**
- [ ] Aparece: "Cultivos cargados: [count]"
- [ ] Aparece: "Variedades cargadas: [count]"
- [ ] No hay: "userId no disponible"

---

## 🧪 Testing Manual - Error 5: Circular JSON

### Escenario 5.1: Guardar objeto en localStorage
**Pasos:**
1. Login exitoso
2. Abrir DevTools (F12)
3. Console → ejecutar:

```javascript
// Esto debe funcionara sin errores
const user = JSON.parse(localStorage.getItem('user'))
console.log('User:', user)
console.log('Token:', localStorage.getItem('token'))
```

**Verificar:**
- [ ] No aparece error de parsing JSON
- [ ] User object se serializa correctamente
- [ ] Token existe y es válido

---

## 🧪 Testing Manual - Sesión Expirada (401)

### Escenario 6.1: Expiración de sesión
**Pasos:**
1. Login exitoso
2. Abrir DevTools (F12) → Console
3. Ejecutar:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
```
4. Ir a `/ensayos`

**Verificar:**
- [ ] Redirige automáticamente a `/login`
- [ ] Aparece mensaje: "Sesión expirada..."
- [ ] **NO aparece loop infinito de redirecciones**

**En Console:**
- [ ] Aparece: "Usuario no autenticado, redirigiendo al login..."
- [ ] Solo aparece UNA vez (no repetido)

---

## 🧪 Testing Manual - Acceso Sin Autenticación

### Escenario 7.1: Acceso directo a ruta protegida
**Pasos:**
1. Abrir DevTools (F12)
2. Ejecutar para limpiar:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
```
3. Ir directamente a `/ensayos` (sin login)

**Verificar:**
- [ ] Redirige inmediatamente a `/login`
- [ ] Middleware lo detiene (no intenta cargar datos)
- [ ] Mensaje de error claro

---

## 🧪 Testing en Diferentes Navegadores

### Firefox
- [ ] Login funciona
- [ ] Ensayos cargan
- [ ] No hay errores de IndexedDB

### Chrome
- [ ] Login funciona
- [ ] Ensayos cargan
- [ ] Revisar DevTools → Console

### Safari
- [ ] Login funciona
- [ ] localStorage funciona
- [ ] Sin errores de localStorage

### Edge
- [ ] Login funciona
- [ ] Ensayos cargan
- [ ] Sin problemas de CORS

---

## 📊 Matriz de Errores - Antes vs Después

| Error | Antes | Después |
|-------|-------|---------|
| JSON 500 | ❌ Crash | ✅ Manejo graceful |
| Credenciales incorrectas | ❌ Entra al dashboard | ✅ Error claro + stay en login |
| IndexedDB userId undefined | ❌ DataError | ✅ Validación + fallback |
| Array undefined.length | ❌ TypeError | ✅ Validación array |
| Circular JSON | ❌ Crash localStorage | ✅ Try-catch |
| Sesión expirada | ⚠️ Redirige varias veces | ✅ Una sola redirección |

---

## 🔍 Debugging - Qué Verificar en Console

### Logs Esperados al Login Exitoso:
```
✅ "Dashboard: Usuario autenticado, cargando datos..."
✅ "Ensayos cargados en dashboard: 15" (o número que sea)
✅ "Ensayos cargados exitosamente: { count: 5, total: 15, page: 1 }"
```

### Logs Esperados en Ensayos:
```
✅ "Cultivos cargados: 8"
✅ "Variedades cargadas: 12" (cuando selecciona cultivo)
```

### Logs de Error Aceptables:
```
✅ "[warn] IndexedDB: userId no disponible todavía" (en init, antes de auth)
✅ "Usuario no autenticado, redirigiendo al login..." (si sin token)
```

### Logs de Error NO ACEPTABLES:
```
❌ "undefined is not valid JSON"
❌ "Cannot read properties of undefined (reading 'length')"
❌ "DataError: Failed to execute 'only' on 'IDBKeyRange'"
❌ "Converting circular structure to JSON"
❌ Loops de "Usuario no autenticado" (repetido muchas veces)
```

---

## 💾 Verificación de Storage

### localStorage debe contener:
```javascript
localStorage.getItem('token')          // JWT válido
localStorage.getItem('user')           // JSON object con user
localStorage.getItem('nuxt-color-mode')// Tema (opcional)
```

### localStorage NO debe contener:
```javascript
// Evitar objetos circulares:
localStorage.getItem('user')           // ✅ Debe ser serializable
JSON.parse(localStorage.getItem('user')) // ✅ Debe parsear sin error
```

---

## 📝 Reporte de Testing

### Formato para reportar si algo falla:

```
FALLA: [Error description]
Paso: [Paso que causó el error]
Resultado esperado: [Lo que debería pasar]
Resultado actual: [Lo que pasó]
Console error: [Error en F12]
localStorage: [Qué contiene]
Navegador: [Chrome/Firefox/Safari]
Versión: [Version]
```

---

## ✅ Test de Aceptación Final

Todos estos deben ser ✅ para aprobar:

```
[ ] Login con credenciales incorrectas → Error + stay en login
[ ] Login con credenciales correctas → Dashboard
[ ] Dashboard carga ensayos correctamente
[ ] Página ensayos carga sin errores
[ ] No hay errores de IndexedDB
[ ] No hay errores de array.length
[ ] localStorage no tiene errores de circular
[ ] Sesión expirada redirige correctamente
[ ] Acceso sin token redirige al login
[ ] No hay loops de redirección
[ ] Console sin errores técnicos para el usuario
```

---

## 🎯 Criterio de Aceptación

**✅ EXITOSO si:**
- Todos los tests pasan en al menos 2 navegadores
- No hay errores técnicos en Console
- Flujo de login es claro y seguro
- Datos cargan correctamente

**❌ FALLIDO si:**
- Alguno de los 5 errores principales aparece
- Credenciales incorrectas dejan entrar
- Hay loops de redirección
- Circular JSON error aparece


