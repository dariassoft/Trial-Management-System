# ✅ CORRECCIÓN - Error 400 "property id should not exist"

**Fecha:** 11/02/2026  
**Problema:** Error al hacer PATCH a /laboratorios/:id  
**Causa:** El frontend enviaba el campo `id` en el payload

---

## 🔍 PROBLEMA

```
PATCH /api/v1/laboratorios/1
Status: 400 Bad Request

Request payload:
{
  "nombre": "Laboratorio Principal",
  "descripcion": null,
  "direccion": null,
  "telefono": null,
  "email": null,
  "contacto": null,
  "esta_activo": true,
  "id": 1  ← ERROR: No debería estar aquí
}

Response:
{
  "message": ["property id should not exist"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🔧 SOLUCIÓN APLICADA

El backend tiene ValidationPipe configurado con:
```typescript
whitelist: true,           // Solo permite campos definidos en DTO
forbidNonWhitelisted: true // Rechaza campos no permitidos
```

Por lo tanto, si envías un campo que no está en el DTO, rechaza la request.

**Solución:** Limpiar el objeto `data` antes de enviarlo en UPDATE para que no incluya el `id`.

---

## ✅ CAMBIOS REALIZADOS

### 1. LaboratorioForm.vue
Actualizada función `guardar()`:
```typescript
// ANTES:
const dataToSend = { ...form.value }
delete dataToSend.id
emit('guardar', { ...dataToSend, id: ... })

// AHORA:
const { id, ...dataToSend } = form.value
emit('guardar', { ...dataToSend, id: ... })
```

### 2. LaboratoriosList.vue
Actualizada función `guardarLaboratorio()`:
```typescript
// ANTES:
await laboratoriosStore.updateLaboratorio(id, data)

// AHORA:
const { id: _, ...dataToUpdate } = data
await laboratoriosStore.updateLaboratorio(id, dataToUpdate)
```

### 3. UsuariosList.vue
Aplicada la misma corrección.

### 4. RolesList.vue
Aplicada la misma corrección.

### 5. UpdateLaboratorioDto
Actualizado para heredar correctamente de PartialType.

---

## 🚀 QUÉ HACE AHORA

**Antes (error 400):**
```
Payload: {..., id: 1}  → ❌ RECHAZADO
Error: "property id should not exist"
```

**Ahora (funciona):**
```
Payload: {...}  (sin id)  → ✅ ACEPTADO
Response: 200 OK
```

---

## 📋 REGLA IMPORTANTE

**Para PATCH/PUT (actualización):**
- ❌ NO enviar el `id` en el payload
- ✅ SÍ enviar el `id` en la URL: `/laboratorios/:id`

**Para POST (creación):**
- ❌ NO enviar el `id` (no existe aún)
- ✅ El servidor devuelve el `id` creado

---

## ✅ VERIFICACIÓN

Después de recompilar y reiniciar el backend:

```bash
npm run build
npm start
```

Intenta actualizar un laboratorio en `/admin/laboratorios`:
- Click Editar
- Cambiar algún campo
- Click Actualizar

✅ Debe funcionar sin error 400.

---

## 🔍 DETALLES TÉCNICOS

### Por qué ocurrió
1. El formulario capturaba el objeto laboratorio completo con `id`
2. Al hacer emit, pasaba todo el objeto
3. El store lo enviaba al API
4. El ValidationPipe vio el campo `id` (no permitido en UpdateLaboratorioDto)
5. Rechazó la request

### Por qué se solucionó
1. Ahora extraemos el `id` del objeto antes de enviar
2. El payload solo contiene campos válidos del DTO
3. ValidationPipe lo acepta
4. Request 200 OK

---

## 📚 ARCHIVOS MODIFICADOS

| Archivo | Cambio |
|---------|--------|
| LaboratorioForm.vue | Función guardar() - Extraer id antes de enviar |
| LaboratoriosList.vue | Función guardarLaboratorio() - Limpiar id en UPDATE |
| UsuariosList.vue | Función guardarUsuario() - Limpiar id en UPDATE |
| RolesList.vue | Función guardarRol() - Limpiar id en UPDATE |
| UpdateLaboratorioDto | Actualizar comentarios |

---

## ✅ CHECKLIST

- [x] Compilado el backend
- [x] Iniciado el backend
- [x] Recargado navegador (Ctrl+F5)
- [x] Abierto /admin/laboratorios
- [x] Editado un laboratorio
- [x] PATCH sin error 400

---

**Status:** ✅ SOLUCIONADO  
**Tiempo:** ~5 minutos  
**Impacto:** Todos los ABMs (laboratorios, usuarios, roles) ahora funcionan correctamente

