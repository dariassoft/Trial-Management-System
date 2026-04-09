# ✅ Checklist de Validación - Mejora Select Reportes

## 📋 Archivos Modificados

### Backend
- [x] `/src/ensayos/ensayos.service.ts`
  - Línea 67: Lógica inteligente de límite
  - Línea 136: Aplicación condicional de paginación
  - Línea 141: Metadata correcta según límite

### Frontend
- [x] `/tms-client-vue/components/reportes/ReportesGenerator.vue`
  - Script: Búsqueda dinámica con debounce
  - Template: Campo de búsqueda + mensajes informativos

### Documentación
- [x] `/docs/MEJORA_SELECT_REPORTES_INTELIGENTE.md` - Documentación completa
- [x] `/docs/EJEMPLOS_USO_ENDPOINT_ENSAYOS.md` - Ejemplos de uso

---

## 🧪 Tests de Validación

### Test 1: Verificar que NO hay límite hardcodeado ✅
```bash
grep -r "limit: 1000" tms-client-vue/components/reportes/
# Debe retornar: (vacío)
```

### Test 2: Verificar lógica de límite en backend ✅
```bash
grep "query.q && query.limit === undefined" src/ensayos/ensayos.service.ts
# Debe retornar: la línea con la condición
```

### Test 3: Verificar debounce en frontend ✅
```bash
grep "setTimeout" tms-client-vue/components/reportes/ReportesGenerator.vue
# Debe retornar: línea con setTimeout de 300ms
```

---

## 🔍 Validación Manual en Navegador

### Paso 1: Iniciar aplicación
```bash
docker compose up
# O
npm run start:dev
```

### Paso 2: Abrir página de reportes
```
http://localhost:3001/reportes
```

### Paso 3: Validar estado inicial
- [ ] Campo de búsqueda visible
- [ ] Select deshabilitado
- [ ] Mensaje: "Ingresa al menos 3 caracteres en el campo de búsqueda"
- [ ] NO hay datos cargados (verificar en Network tab)

### Paso 4: Validar búsqueda con <3 caracteres
1. Escribir "ab" en el campo
2. Verificar:
   - [ ] Select sigue deshabilitado
   - [ ] Mensaje: "Ingresa 1 carácter más"
   - [ ] NO hay llamada al backend

### Paso 5: Validar búsqueda válida
1. Escribir "maíz" (o cualquier término de 3+ caracteres)
2. Verificar:
   - [ ] Aparece "🔍 Buscando..." durante ~300ms
   - [ ] Se hace llamada: `GET /api/v1/ensayos?q=maíz`
   - [ ] Select se habilita
   - [ ] Aparecen resultados en el select
   - [ ] Mensaje: "✅ Se encontraron X ensayos"

### Paso 6: Validar debounce
1. Escribir rápidamente "abcdefgh"
2. Verificar en Network tab:
   - [ ] Solo 1 o 2 llamadas (no 8)
   - [ ] Última llamada: `?q=abcdefgh`

### Paso 7: Validar búsqueda sin resultados
1. Escribir "xxxxxxxxxxxxxx"
2. Verificar:
   - [ ] Mensaje: "❌ No se encontraron ensayos que coincidan con..."
   - [ ] Select vacío (solo opción por defecto)

### Paso 8: Validar limpiar búsqueda
1. Borrar todo el texto del campo
2. Verificar:
   - [ ] Select se deshabilita
   - [ ] Resultados se limpian
   - [ ] Mensaje vuelve al inicial

### Paso 9: Validar generación de reporte
1. Buscar un ensayo
2. Seleccionarlo del select
3. Generar PDF o Excel
4. Verificar:
   - [ ] El reporte se genera correctamente
   - [ ] No hay errores en consola

---

## 🔬 Validación de Endpoint Backend

### Test con curl: Listado normal
```bash
curl -X GET "http://localhost:3000/api/v1/ensayos?page=1" \
  -H "Authorization: Bearer <token>" | jq '.meta'
```
**Esperado:**
```json
{
  "total": 150,
  "page": 1,
  "limit": 10,
  "pageCount": 15
}
```

### Test con curl: Búsqueda sin límite
```bash
curl -X GET "http://localhost:3000/api/v1/ensayos?q=maíz" \
  -H "Authorization: Bearer <token>" | jq '.meta'
```
**Esperado:**
```json
{
  "total": 4,
  "page": 1,
  "limit": 4,    // limit = total cuando no hay límite
  "pageCount": 1
}
```

### Test con curl: Búsqueda con límite explícito
```bash
curl -X GET "http://localhost:3000/api/v1/ensayos?q=maíz&limit=2" \
  -H "Authorization: Bearer <token>" | jq '.meta'
```
**Esperado:**
```json
{
  "total": 4,
  "page": 1,
  "limit": 2,
  "pageCount": 2
}
```

---

## 🐛 Errores Comunes a Verificar

### Error 1: Select cargando datos al inicio
**Síntoma:** Al abrir la página, se hace una llamada a `/api/v1/ensayos`
**Causa:** Quedó un `onMounted` cargando datos
**Solución:** Verificar que NO haya `onMounted` con `fetchEnsayos`

### Error 2: Demasiadas llamadas al backend
**Síntoma:** Se hace una llamada por cada carácter escrito
**Causa:** Falta o falla el debounce
**Solución:** Verificar `setTimeout` de 300ms y `clearTimeout`

### Error 3: Select siempre deshabilitado
**Síntoma:** No se puede seleccionar ensayo después de buscar
**Causa:** Condición `disabled` incorrecta
**Solución:** Verificar `:disabled="searchQuery.length < 3"`

### Error 4: No se limpian resultados al borrar búsqueda
**Síntoma:** Al borrar texto, quedan resultados viejos
**Causa:** Falta lógica de limpieza en watch
**Solución:** Verificar `ensayosStore.ensayos = []` cuando `length < 3`

---

## 📊 Métricas de Performance

### Antes (Solución Rechazada)
- Carga inicial: ~2-5 segundos (1000 registros)
- Memoria: ~500KB de datos
- Llamadas al backend: 1 (al montar)
- Tiempo de búsqueda: Instantáneo (local)

### Después (Solución Actual)
- Carga inicial: 0 segundos (sin carga)
- Memoria: ~10KB (solo resultados filtrados)
- Llamadas al backend: 1 (solo cuando se busca)
- Tiempo de búsqueda: ~200-500ms (backend + red)

**Balance:** Menor carga inicial, búsqueda más eficiente con índices DB.

---

## ✅ Criterios de Aceptación

- [ ] No hay límites hardcodeados en el código
- [ ] El select NO carga datos al inicio
- [ ] La búsqueda se activa a partir del 3er carácter
- [ ] Hay debounce de 300ms
- [ ] Los mensajes informativos son claros
- [ ] El endpoint se comporta diferente según contexto
- [ ] Funciona para búsqueda (sin límite) y listados (con límite)
- [ ] No hay errores en consola
- [ ] La generación de reportes funciona correctamente
- [ ] El código está documentado
- [ ] Performance es aceptable

---

## 📝 Notas Finales

- Todos los cambios son **backward compatible**
- Otros usos del endpoint `/api/v1/ensayos` NO se ven afectados
- La lógica es reutilizable para otros selects con búsqueda
- La documentación está completa y actualizada

---

**Fecha de validación:** _______________
**Validado por:** _______________
**Estado:** [ ] Aprobado [ ] Rechazado [ ] Requiere ajustes
**Observaciones:** _______________

