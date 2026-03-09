# 🔧 Solución: Error 400 Bad Request - Valores String en lugar de Número

## 📋 Problema

**Error:** 400 Bad Request al actualizar datos de siembra

**Response:**
```json
{
  "message": [
    "semillasPorMetro must be a number conforming to the specified constraints",
    "densidadSiembra must be a number conforming to the specified constraints",
    "germinacionPct must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Payload que se enviaba:**
```json
{
  "parcelaId": 30,
  "fechaSiembra": "2026-01-01",
  "semillasPorMetro": "140.00",        // ❌ STRING
  "densidadSiembra": "20000.00",       // ❌ STRING
  "germinacionPct": "80.00",           // ❌ STRING
  "vigorPlantasEscala": 8,             // ✅ NUMBER
  "observaciones": "-ghkgjh-"
}
```

## 🔴 Causa

Los inputs HTML devuelven valores como **strings**, no números. Aunque los validadores de Vue hacen `v-model.number`, cuando se cargan datos previos con `parseFloat` o cálculos complejos, pueden seguir siendo strings.

El backend valida con `class-validator` que estos campos sean números, pero recibe strings → **validación falla**.

## ✅ Solución

Se agregó conversión explícita de strings a números en dos lugares:

### 1. Al cargar datos previos (abrirEditorSiembra)

```typescript
// ANTES
formSiembra.value = {
  fechaSiembra: parcela.siembra.fechaSiembra ? new Date(...).toISOString().split('T')[0] : '',
  semillasPorMetro: parcela.siembra.semillasPorMetro || null,  // ❌ Puede ser string
  densidadSiembra: parcela.siembra.densidadSiembra || null,    // ❌ Puede ser string
  germinacionPct: parcela.siembra.germinacionPct || null,      // ❌ Puede ser string
  vigorPlantasEscala: parcela.siembra.vigorPlantasEscala || null,
  observaciones: parcela.siembra.observaciones || '',
}

// DESPUÉS
formSiembra.value = {
  fechaSiembra: parcela.siembra.fechaSiembra ? new Date(...).toISOString().split('T')[0] : '',
  semillasPorMetro: parcela.siembra.semillasPorMetro ? parseFloat(String(parcela.siembra.semillasPorMetro)) : null,  // ✅
  densidadSiembra: parcela.siembra.densidadSiembra ? parseFloat(String(parcela.siembra.densidadSiembra)) : null,    // ✅
  germinacionPct: parcela.siembra.germinacionPct ? parseFloat(String(parcela.siembra.germinacionPct)) : null,        // ✅
  vigorPlantasEscala: parcela.siembra.vigorPlantasEscala ? parseInt(String(parcela.siembra.vigorPlantasEscala), 10) : null,
  observaciones: parcela.siembra.observaciones || '',
}
```

### 2. Al guardar (guardarSiembra)

```typescript
// Convertir valores a números ANTES de enviar al API
const semillasPorMetro = formSiembra.value.semillasPorMetro !== null && formSiembra.value.semillasPorMetro !== ''
  ? parseFloat(String(formSiembra.value.semillasPorMetro))
  : null

const densidadSiembra = formSiembra.value.densidadSiembra !== null && formSiembra.value.densidadSiembra !== ''
  ? parseFloat(String(formSiembra.value.densidadSiembra))
  : null

const germinacionPct = formSiembra.value.germinacionPct !== null && formSiembra.value.germinacionPct !== ''
  ? parseFloat(String(formSiembra.value.germinacionPct))
  : null

const vigorPlantasEscala = formSiembra.value.vigorPlantasEscala !== null && formSiembra.value.vigorPlantasEscala !== ''
  ? parseInt(String(formSiembra.value.vigorPlantasEscala), 10)
  : null

const dto = {
  parcelaId: parcelaEditando.value.id,
  fechaSiembra: formSiembra.value.fechaSiembra || null,
  semillasPorMetro,    // ✅ Ahora es número
  densidadSiembra,     // ✅ Ahora es número
  germinacionPct,      // ✅ Ahora es número
  vigorPlantasEscala,  // ✅ Ahora es número
  observaciones: formSiembra.value.observaciones || null,
}
```

## 📊 Diferencia

| Antes | Después |
|-------|---------|
| `"140.00"` (string) | `140` (number) |
| `"20000.00"` (string) | `20000` (number) |
| `"80.00"` (string) | `80` (number) |
| Validación: ❌ FALLA | Validación: ✅ OK |

## 🧪 Verificación

Después de los cambios, el payload enviado será:

```json
{
  "parcelaId": 30,
  "fechaSiembra": "2026-01-01",
  "semillasPorMetro": 140,        // ✅ NUMBER
  "densidadSiembra": 20000,       // ✅ NUMBER
  "germinacionPct": 80,           // ✅ NUMBER
  "vigorPlantasEscala": 8,        // ✅ NUMBER
  "observaciones": "-ghkgjh-"
}
```

Backend validará correctamente → ✅ 200 OK

## 🚀 Próximos Pasos

1. **Recarga la página** (Ctrl+F5)
2. **Prueba nuevamente:**
   - Abre `/siembra`
   - Selecciona parcela con datos de siembra existentes
   - Edita un campo
   - Guarda
   - Debe funcionar sin errores 400 ✅

## ✅ Estado

**CORREGIDO** - El error 400 Bad Request por validación numérica debe estar resuelto.

Los campos ahora se convierten correctamente a números en dos puntos críticos:
- ✅ Al cargar datos previos
- ✅ Al enviar datos al servidor

