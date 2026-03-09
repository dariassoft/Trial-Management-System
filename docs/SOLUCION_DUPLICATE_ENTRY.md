# 🔧 Solución: Error al Guardar Datos de Siembra (Duplicate Entry)

## 📋 Problema Identificado

**Error:** `Duplicate entry '30' for key 'Datos_Siembra.uk_parcela_siembra'`

**Causa:**
- La parcela 30 ya tenía datos de siembra guardados
- El modal intentaba hacer un INSERT nuevamente
- Pero debería haber hecho un UPDATE
- El problema era que `parcela.siembra` no estaba siendo cargado desde el backend

## ✅ Soluciones Aplicadas

### 1. Backend - Cargar relaciones de siembra y cosecha

**Archivo:** `src/parcelas/parcelas.service.ts`

**Cambios:**
- ✅ Método `findAll()` - Agregado `.leftJoinAndSelect('pa.siembra', 'siembra')` y `.leftJoinAndSelect('pa.cosecha', 'cosecha')`
- ✅ Método `findOne()` - Agregado carga de `siembra: true, cosecha: true` en relations

Ahora cuando se obtienen parcelas, **automáticamente traen los datos de siembra y cosecha** associated.

### 2. Frontend - Tipo actualizado en Store

**Archivo:** `tms-client-vue/stores/parcelas.ts`

**Cambios:**
- ✅ Actualizado tipo `ParcelaItem` para incluir:
  ```typescript
  siembra?: {
    id: number
    fechaSiembra?: string | null
    semillasPorMetro?: number | null
    densidadSiembra?: number | null
    germinacionPct?: number | null
    vigorPlantasEscala?: number | null
    observaciones?: string | null
  } | null
  cosecha?: { ... } | null
  ```

### 3. Frontend - Lógica mejorada en página siembra.vue

**Archivo:** `tms-client-vue/pages/siembra.vue`

**Cambios:**
- ✅ `abrirEditorSiembra()` - Mejor logging para debugging
- ✅ `guardarSiembra()` - Mejorada lógica de detección CREATE vs UPDATE
  - Verifica si `parcelaEditando.value.siembra?.id` existe
  - Si existe → PATCH (UPDATE)
  - Si no existe → POST (CREATE)
- ✅ Mejor manejo de errores con mensajes específicos

## 🔄 Flujo Correcto Ahora

### Primer intento (sin datos previos):
```
1. Usuario abre modal de siembra para parcela sin datos
2. Modal carga vacío (no hay siembra)
3. Usuario llena formulario
4. Click "Guardar Siembra"
5. Sistema detiene: "¿hay siembra.id?" → NO
6. Ejecuta POST /datos-siembra (CREATE)
7. Datos guardados en BD ✅
```

### Segundo intento (con datos previos):
```
1. Usuario abre modal de siembra para parcela CON datos
2. Backend traetrae siembra con toda la info (AHORA SÍ, gracias a leftJoinAndSelect)
3. Modal carga con datos previos
4. Usuario modifica datos
5. Click "Guardar Siembra"
6. Sistema detecta: "¿hay siembra.id?" → SÍ (es 123)
7. Ejecuta PATCH /datos-siembra/123 (UPDATE)
8. Datos actualizados en BD ✅
```

## 📊 Archivos Modificados

| Archivo | Líneas | Cambios |
|---------|--------|---------|
| `src/parcelas/parcelas.service.ts` | 65-68, 104-107 | Agregar leftJoinAndSelect para siembra/cosecha |
| `tms-client-vue/stores/parcelas.ts` | 6-42 | Tipos ParcelaItem actualizado |
| `tms-client-vue/pages/siembra.vue` | 416-425, 459-492 | Logging y manejo de errores mejorado |

## 🧪 Cómo Probar

### Test 1: Crear nueva siembra
```
1. Abre página /siembra
2. Filtra por un ensayo
3. Selecciona una parcela SIN datos de siembra
4. Click en ✏️ (Editar)
5. Llena los campos
6. Click en "✓ Guardar Siembra"
7. Debe guardar con POST ✅
```

### Test 2: Actualizar siembra existente
```
1. Abre página /siembra
2. Filtra por un ensayo
3. Selecciona una parcela CON datos de siembra (la que falló antes)
4. Click en ✏️ (Editar)
5. El modal DEBE cargar los datos previos
6. Modifica algún campo
7. Click en "✓ Guardar Siembra"
8. Debe actualizar con PATCH ✅
9. Los datos NO deben duplicarse ✅
```

### Test 3: Verificar que se recarga la información

```
1. Crea una siembra para parcela A
2. Edita la misma parcela
3. Los datos guardados DEBEN aparecer en el modal ✅
4. Crea otra parcela
5. Edita parcela B (nueva)
6. El modal DEBE estar vacío ✅
```

## 🎯 Resultado Esperado

✅ No más errores de "Duplicate entry"
✅ CREATE y UPDATE funcionan correctamente
✅ Los datos se cargan al abrir el modal
✅ Se puede editar múltiples veces sin conflictos
✅ Cada parcela tiene sus propios datos independientes

## 📝 Próximas Acciones

1. **Reinicia el servidor backend**
   ```bash
   Ctrl+C
   npm run start:dev
   ```

2. **Recarga el navegador** (Ctrl+F5)

3. **Prueba nuevamente** siguiendo los tests anteriores

## ✨ Nota Técnica

La mejora en el backend (`leftJoinAndSelect` para siembra y cosecha) es la clave. Ahora:

- **Antes:** Parcela venía sin relación siembra → siempre creaba INSERT → Duplicate entry
- **Ahora:** Parcela viene con siembra completa → Sistema detecta si existe → CREATE o UPDATE correcto ✅

