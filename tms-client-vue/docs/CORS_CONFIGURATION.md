# CORS Configuration - TMS Frontend & Backend

Documentación sobre la configuración de CORS entre el frontend Vue/Nuxt y el backend NestJS.

## 1. Situación Actual

### Backend (NestJS)
```typescript
// src/main.ts
app.enableCors(); // Permite todos los orígenes
```

**Problema**: En producción, esto es muy permisivo y representa un riesgo de seguridad.

### Frontend (Vue/Nuxt)
```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1',
  },
}
```

**Status**: Funciona correctamente, pero depende de CORS en backend.

---

## 2. Configuración Recomendada

### Desarrollo Local

**Backend**
```typescript
// src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
});
```

**Frontend** (.env.local)
```env
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
```

### Producción

**Backend** (.env)
```env
FRONTEND_URL=https://app.example.com
# o múltiples orígenes
FRONTEND_URLS=https://app.example.com,https://www.app.example.com
```

**Backend** (main.ts)
```typescript
const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || ['http://localhost:3001'];

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
});
```

**Frontend** (.env.production)
```env
NUXT_PUBLIC_API_BASE=https://api.example.com/api/v1
```

---

## 3. Errores CORS Comunes

### Error: "Access to XMLHttpRequest blocked by CORS policy"

**Causa**: El backend no permite el origen del frontend.

**Solución**:
1. Verificar que `FRONTEND_URL` está configurado en backend
2. Verificar que el origen del frontend coincide exactamente (incluir protocolo)
3. Si se usa puerto personalizado, asegurar que esté incluido

### Error: "Credentials mode is 'include' but CORS header 'Access-Control-Allow-Credentials' is missing"

**Causa**: Se envían credenciales pero CORS no está configurado para aceptarlas.

**Solución**:
```typescript
app.enableCors({
  credentials: true, // Esto es necesario
  origin: 'http://localhost:3001',
});
```

### Error: "Request header is not allowed by Access-Control-Allow-Headers"

**Causa**: Un header no está en la lista de permitidos.

**Solución**:
```typescript
app.enableCors({
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
});
```

---

## 4. Testing de CORS

### Script de Testing Local

```bash
#!/bin/bash
# test-cors.sh

BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"

# Test 1: Verificar que el backend responde
echo "Test 1: Backend disponible"
curl -v "$BACKEND_URL/api/v1" 2>&1 | grep -E "HTTP|Access-Control"

# Test 2: CORS preflight
echo -e "\nTest 2: CORS Preflight"
curl -X OPTIONS \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v "$BACKEND_URL/api/v1/auth/login" 2>&1 | grep -E "Access-Control"

# Test 3: POST con credenciales
echo -e "\nTest 3: POST con JSON"
curl -X POST \
  -H "Origin: $FRONTEND_URL" \
  -H "Content-Type: application/json" \
  -d '{"username":"test@test.com","password":"123456"}' \
  -v "$BACKEND_URL/api/v1/auth/login" 2>&1 | head -20
```

Ejecutar:
```bash
chmod +x test-cors.sh
./test-cors.sh
```

---

## 5. Verificación en el Navegador

### Verificar CORS en DevTools

1. Abrir DevTools (F12)
2. Ir a "Network"
3. Hacer una request a la API
4. Ver response headers:
   - `Access-Control-Allow-Origin: http://localhost:3001` ✅
   - `Access-Control-Allow-Credentials: true` ✅
   - Si no aparecen, hay error CORS

### Console Errors

**Error rojo en console**:
```
Access to XMLHttpRequest at 'http://localhost:3000/api/v1/auth/login' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Soluciones**:
- Verificar origen en el log del backend
- Agregar a `allowedOrigins`
- Usar proxy en desarrollo (alternativa)

---

## 6. Proxy Alternativo en Desarrollo

Si CORS causa problemas, usar proxy en Nuxt (alternativa):

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: false,
    },
    proxy: {
      '/api/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

Luego acceder a:
```typescript
const response = await $fetch('/api/v1/auth/login', {
  method: 'POST',
  body: { username, password },
})
```

**Ventaja**: No requiere CORS
**Desventaja**: Solo funciona en desarrollo con SSR

---

## 7. Checklist de CORS

### Desarrollo Local
- [ ] Backend tiene `app.enableCors()` habilitado
- [ ] Frontend puede hacer requests a `http://localhost:3000`
- [ ] DevTools no muestra errores CORS
- [ ] Login funciona
- [ ] Tokens se envían correctamente

### Before Deploy
- [ ] Backend CORS solo permite origen de producción
- [ ] Frontend .env tiene URL correcta
- [ ] SSL/HTTPS habilitado en producción
- [ ] Credentials se manejan correctamente
- [ ] Headers requeridos están permitidos

### Producción
- [ ] Origin coincide exactamente (protocolo, dominio, puerto)
- [ ] Credentials: true si se usan cookies/auth
- [ ] HTTPS en ambos lados
- [ ] Headers personalizados están permitidos
- [ ] Métodos HTTP necesarios están permitidos

---

## 8. Guía Rápida: Solucionar CORS

1. **Verificar error exacto en DevTools**
   - Network → Ver response headers
   - Console → Ver mensaje de error

2. **Identificar el problema**
   - ¿CORS error en preflight (OPTIONS)?
   - ¿Error en header específico?
   - ¿Error en credenciales?

3. **Aplicar solución según tabla abajo**

| Error | Causa | Solución |
|-------|-------|----------|
| "origin not allowed" | Backend no acepta origen | Agregar a `allowedOrigins` o usar `*` en dev |
| "credentials mode error" | Falta `credentials: true` | Agregar `credentials: true` en CORS config |
| "header not allowed" | Header no en whitelist | Agregar header a `allowedHeaders` |
| "method not allowed" | Método no en whitelist | Agregar método a `methods` |

4. **Verificar con curl**
   ```bash
   curl -H "Origin: http://localhost:3001" \
        -H "Content-Type: application/json" \
        -X POST \
        -d '{"username":"test","password":"test"}' \
        http://localhost:3000/api/v1/auth/login -v
   ```

---

## 9. Monitoreo en Producción

### Logs del Servidor

Agregar logging de CORS rechazados:

```typescript
// Backend
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && !allowedOrigins.includes(origin)) {
    console.warn(`CORS rejected origin: ${origin}`);
  }
  next();
});
```

### Métricas

- Contar requests con CORS error
- Alertar si hay muchos rechazos
- Revisar logs regularmente

---

## 10. Referencias

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [NestJS: CORS](https://docs.nestjs.com/security/cors)
- [OWASP: CORS](https://owasp.org/www-community/attacks/CSRF)

---

**Última actualización**: 2024-11-26

