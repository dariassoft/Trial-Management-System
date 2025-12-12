# ✅ CORRECCIÓN - Error 404: /api/v1/api/v1/protocolos

**Fecha**: Diciembre 12, 2025  
**Error**: `[GET] "http://localhost:3000/api/v1/api/v1/protocolos?page=1&limit=10" 404 Not Found`  
**Causa**: URLs con prefijo `/api/v1/` duplicado  
**Status**: ✅ CORREGIDO

---

## 🐛 Problema

La URL se construía como: `http://localhost:3000/api/v1/api/v1/protocolos`

**Causa raíz**: 
- `apiBase` en `nuxt.config.ts` = `http://localhost:3000/api/v1`
- Endpoints en stores tenían = `/api/v1/protocolos`
- Resultado: `apiBase` + endpoint = `/api/v1` + `/api/v1/protocolos` = `/api/v1/api/v1/protocolos` ❌

---

## ✅ Solución

Cambié todos los endpoints en los stores para usar solo `/protocolos` (sin `/api/v1`):

### Archivos corregidos:

#### 1. `/stores/protocolos.ts`
```typescript
// ANTES
const res = await api.get('/api/v1/protocolos', ...)
const res = await api.get(`/api/v1/protocolos/${id}`, ...)
const res = await api.post('/api/v1/protocolos', payload)
const res = await api.patch(`/api/v1/protocolos/${id}`, payload)
await api.delete(`/api/v1/protocolos/${id}`)

// DESPUÉS
const res = await api.get('/protocolos', ...)
const res = await api.get(`/protocolos/${id}`, ...)
const res = await api.post('/protocolos', payload)
const res = await api.patch(`/protocolos/${id}`, payload)
await api.delete(`/protocolos/${id}`)
```

#### 2. `/stores/tratamientos.ts`
```typescript
// ANTES
const res = await api.get('/api/v1/tratamientos', ...)
const res = await api.get(`/api/v1/tratamientos/${id}`, ...)
const res = await api.post('/api/v1/tratamientos', payload)
const res = await api.patch(`/api/v1/tratamientos/${id}`, payload)
await api.delete(`/api/v1/tratamientos/${id}`)
const res = await api.post('/api/v1/tratamientos-producto', payload)
await api.delete(`/api/v1/tratamientos-producto/${id}`)
const res = await api.patch(`/api/v1/tratamientos-producto/${id}`, payload)

// DESPUÉS
const res = await api.get('/tratamientos', ...)
const res = await api.get(`/tratamientos/${id}`, ...)
const res = await api.post('/tratamientos', payload)
const res = await api.patch(`/tratamientos/${id}`, payload)
await api.delete(`/tratamientos/${id}`)
const res = await api.post('/tratamientos-producto', payload)
await api.delete(`/tratamientos-producto/${id}`)
const res = await api.patch(`/tratamientos-producto/${id}`, payload)
```

---

## 📊 Resumen de cambios

| Archivo | Cambios |
|---------|---------|
| `/stores/protocolos.ts` | 5 endpoints corregidos |
| `/stores/tratamientos.ts` | 8 endpoints corregidos |
| **Total** | **13 URLs arregladas** |

---

## ✔️ Verificación

```bash
# ✅ No hay más /api/v1/ duplicados
grep -n "/api/v1/" stores/protocolos.ts stores/tratamientos.ts
# Resultado: ninguna línea encontrada
```

---

## 🔍 Cómo funciona ahora

```
useApi() → apiBase = "http://localhost:3000/api/v1"
                ↓
api.get('/protocolos')
                ↓
useApi combina: apiBase + endpoint
                ↓
"http://localhost:3000/api/v1" + "/protocolos"
                ↓
✅ "http://localhost:3000/api/v1/protocolos" (CORRECTO)
```

---

## 🚀 Próximos pasos

1. **Reiniciar frontend**:
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml restart nuxt
```

2. **Probar en navegador**:
```
http://localhost:3001/protocolos
```

3. **Verificar en Network**:
- Debería llamar a: `http://localhost:3000/api/v1/protocolos`
- No a: `http://localhost:3000/api/v1/api/v1/protocolos`

---

**Corrección Finalizada** ✅  
*Diciembre 12, 2025*

