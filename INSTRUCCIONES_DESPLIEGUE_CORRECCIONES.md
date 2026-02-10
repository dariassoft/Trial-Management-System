# Instrucciones de Despliegue - Correcciones Login

## 📦 Pre-Despliegue

### 1. Verificar Cambios Localmente

```bash
# En tu máquina local
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

# Ver cambios realizados
git status

# Ver diferencias
git diff tms-client-vue/
```

### 2. Verificar que no hay errores de compilación

```bash
cd tms-client-vue

# Instalar dependencias (si es necesario)
npm install

# Build
npm run build

# Si hay warnings ⚠️ es OK, pero no debe haber errores ❌
```

---

## 🐳 Despliegue en Docker

### En VPS - Frontend

```bash
# SSH a tu VPS
ssh usuario@tu-vps.com

# Entrar en carpeta del proyecto
cd /ruta/a/tms-backend

# Actualizar código
git pull origin main

# Detener contenedor frontend (si está corriendo)
docker-compose down frontend

# Build nuevo
docker-compose build frontend

# Levantar de nuevo
docker-compose up -d frontend

# Ver logs
docker-compose logs -f frontend
```

### En VPS - Verificar que funciona

```bash
# Ver que el contenedor está corriendo
docker ps | grep tms-frontend

# Ver logs en tiempo real
docker-compose logs -f frontend

# Esperar a que muestre "localhost:3000"
```

### En VPS - Limpiar caché (si es necesario)

```bash
# Entrar al contenedor
docker exec -it tms-frontend sh

# Dentro del contenedor
rm -rf .nuxt
npm run build
npm run dev
```

---

## ✅ Post-Despliegue - Validación

### 1. Verificar que Frontend está corriendo

```bash
# En tu navegador, ir a:
https://tu-dominio.com
# o
http://tu-vps.com:3000
```

### 2. Test Login - Credenciales Incorrectas

1. Ir a `/login`
2. Email: `test@invalid.com`
3. Password: `wrongpassword`
4. Presionar "Iniciar sesión"

**Verificar:**
- ✅ Muestra error: "Credenciales inválidas..."
- ✅ Se queda en login
- ✅ Password está vacío
- ✅ Abrir DevTools (F12) → Console → No hay errores rojos

### 3. Test Login - Credenciales Correctas

1. Ir a `/login`
2. Email: `dariassoft@gmail.com` (o usuario válido)
3. Password: `123456` (o contraseña válida)
4. Presionar "Iniciar sesión"

**Verificar:**
- ✅ Redirige a `/` (dashboard)
- ✅ Muestra: "Bienvenido, [nombre]"
- ✅ Ve "Ensayos Recientes"
- ✅ Abrir DevTools (F12) → Console → Ver logs positivos:
  - "Dashboard: Usuario autenticado, cargando datos..."
  - "Ensayos cargados en dashboard: [número]"

### 4. Test Ensayos Page

1. Ir a `/ensayos`

**Verificar:**
- ✅ Carga tabla de ensayos
- ✅ Se muestran ensayos correctamente
- ✅ Abrir DevTools → No hay errores

### 5. Test Error Handling

En DevTools Console:

```javascript
// Limpiar tokens
localStorage.removeItem('token')
localStorage.removeItem('user')

// Ir a ensayos
```

**Verificar:**
- ✅ Redirige a `/login`
- ✅ Mensaje: "Sesión expirada..."
- ✅ No hay loops de redirección

---

## 🔧 Troubleshooting

### Problema: "Frontend no carga"

```bash
# Ver logs
docker-compose logs frontend

# Reiniciar
docker-compose restart frontend

# Ver si hay errores de conexión a backend
curl http://backend:3001/auth/login
```

### Problema: "Error 500 en login"

```bash
# Ver logs del backend
docker-compose logs backend

# Verificar que backend está corriendo
docker ps | grep backend

# Probar conectar directamente
curl http://localhost:3001/auth/login
```

### Problema: "LocalStorage errors"

```javascript
// En browser console
localStorage.clear()
location.reload()
```

### Problema: "Ensayos no cargan"

```bash
# Ver logs del frontend
docker-compose logs -f frontend

# Ver logs del backend
docker-compose logs -f backend

# Verificar que BD está correcta
docker exec tms-backend mysql -u root -p[password] -e "SELECT COUNT(*) FROM ensayos;"
```

---

## 📊 Verificación de Logs

### Logs que DEBEN aparecer (Éxito)

```
✅ "Dashboard: Usuario autenticado, cargando datos..."
✅ "Ensayos cargados en dashboard: 15"
✅ "Ensayos cargados exitosamente: { count: 5, total: 15, page: 1 }"
✅ "Cultivos cargados: 8"
✅ "Variedades cargadas: 12"
```

### Logs que NO DEBEN aparecer (Error)

```
❌ "undefined is not valid JSON"
❌ "Cannot read properties of undefined"
❌ "DataError: Failed to execute 'only' on 'IDBKeyRange'"
❌ "Converting circular structure to JSON"
❌ Loops de "Usuario no autenticado" (repetido)
```

---

## 🚀 Rollback (Si algo falla)

```bash
# En VPS, revertir cambios
git log --oneline

# Ver el commit anterior
git checkout [commit-anterior]

# Rebuild
docker-compose build frontend

# Reiniciar
docker-compose up -d frontend

# Verificar logs
docker-compose logs -f frontend
```

---

## 📝 Cambios Desplegados

| Archivo | Cambios |
|---------|---------|
| `stores/auth.ts` | ✅ Validación JSON, diferenciación errores |
| `pages/login.vue` | ✅ Limpiar password, validar autenticación |
| `composables/useApi.ts` | ✅ Evitar loops, logs detallados |
| `stores/ensayos.ts` | ✅ Validar array, protección undefined |
| `composables/useEnsayos.ts` | ✅ Validar userId, fallback seguro |
| `pages/ensayos/index.vue` | ✅ Validar respuesta, protección array |
| `pages/index.vue` | ✅ Carga segura, logs mejorados |
| `components/dashboard/RecentEnsayos.vue` | ✅ Validar auth, import useAuthStore |

---

## 🎯 Resultados Esperados

### Antes de los cambios ❌
- Error 500: "undefined is not valid JSON"
- Credenciales incorrectas dejan entrar
- Error de IndexedDB
- Error de array.length
- Error de circular JSON

### Después de los cambios ✅
- Error 500: "Error en el servidor. Por favor intenta más tarde."
- Credenciales incorrectas: "Credenciales inválidas..."
- No hay errores de IndexedDB
- Arrays validados antes de usar
- localStorage sin errores

---

## 📞 Soporte Post-Despliegue

Si hay problemas después del despliegue:

1. **Revisar logs en tiempo real:**
   ```bash
   docker-compose logs -f frontend
   ```

2. **Revisar browser console (F12):**
   - Buscar errores rojos
   - Ver si los logs positivos aparecen

3. **Revisar localStorage:**
   ```javascript
   console.log(localStorage)
   ```

4. **Limpiar y reintentar:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

5. **Si todo falla, hacer rollback:**
   ```bash
   git revert HEAD
   docker-compose build frontend
   docker-compose up -d frontend
   ```

---

## ✅ Checklist Final

- [ ] Código actualizado en VPS
- [ ] Build sin errores críticos
- [ ] Frontend corriendo correctamente
- [ ] Login con credenciales incorrectas rechaza
- [ ] Login con credenciales correctas funciona
- [ ] Dashboard carga sin errores
- [ ] Ensayos carga sin errores
- [ ] Logs en console son esperados
- [ ] No hay loops de redirección
- [ ] localStorage funciona correctamente

Cuando todos estos ✅ están marcados, **DESPLIEGUE EXITOSO**


