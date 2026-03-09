# ✅ SOLUCIÓN: Error 400 Bad Request - Nombre de Campo Incorrecto

## 📋 Problema

Al intentar guardar datos de cosecha, error 400:
```
{
    "message": [
        "property granosDañados should not exist"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

## 🔴 Causa Raíz

**Mismatch entre frontend y backend en el nombre del campo:**

- **Frontend enviaba:** `granosDañados` (con ñ)
- **Backend esperaba:** `granosDanados` (sin ñ)

El DTO del backend estaba definido como `granosDanados` sin la letra ñ, pero el frontend usaba `granosDañados` con ñ. Los DTOs de validación de NestJS rechazaban campos desconocidos.

## ✅ Solución

Se cambió **TODOS** los referencias de `granosDañados` a `granosDanados` (sin ñ) en cosecha.vue:

### Lugares Modificados:

1. **Template (input)** - línea 350
   ```html
   <input v-model.number="formCosecha.granosDanados" />
   ```

2. **formCosecha ref** - línea 585
   ```typescript
   granosDanados: null as number | null
   ```

3. **abrirEditorCosecha() - Cargando datos** - línea 654
   ```typescript
   granosDanados: roundToDecimals(parcela.cosecha.granosDanados, 2)
   ```

4. **abrirEditorCosecha() - Formulario vacío** - línea 676
   ```typescript
   granosDanados: null
   ```

5. **cerrarModalCosecha()** - línea 703
   ```typescript
   granosDanados: null
   ```

6. **guardarCosecha() - DTO** - línea 733
   ```typescript
   granosDanados: formCosecha.value.granosDanados
   ```

## 📊 Mapa de Cambios

```
Antes:  granosDañados ❌ (con ñ)
Después: granosDanados ✅ (sin ñ)

Ahora coincide con:
- DTO Backend: CreateDatosCosechaDto
- BD: Tabla Datos_Cosecha (columna granos_danados)
- Entidad: DatosCosecha entity
```

## 🧪 Cómo Funciona Ahora

```
1. Usuario ingresa datos de cosecha
2. Click "Guardar"
3. Frontend construye DTO con:
   {
     ...otros campos...,
     granosDanados: 5.2  ✅ Correcto (sin ñ)
   }
4. Backend valida: ✅ Campo conocido
5. Se guarda en BD correctamente
```

## 📁 Archivo Modificado

✅ `tms-client-vue/pages/cosecha.vue`
- 6 ocurrencias de `granosDañados` → `granosDanados`

## ✨ Lección Aprendida

Siempre mantener **nombres de campos consistentes** entre:
- ✅ Frontend (Vue)
- ✅ Backend DTO (NestJS)
- ✅ Entidad (TypeORM)
- ✅ Base de datos (MySQL)

Los caracteres especiales como ñ pueden causar problemas de mismatch. Es mejor usar ASCII en nombres de propiedades.

## 🚀 Para Probar

1. **Recarga el navegador** (Ctrl+F5)
2. **Abre cosecha**
3. **Ingresa datos de cosecha**
4. **Haz clic en Guardar**
5. ✅ **Debe guardar sin error 400**

---

**Problema resuelto: El error de validación debe desaparecer completamente.** 🎉

