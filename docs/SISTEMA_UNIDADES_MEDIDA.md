# Sistema de Unidades de Medida - Variables de Ensayo

## 📍 Ubicación del Código

El sistema de unidades de medida está implementado en el componente de mediciones del frontend:

**Archivo principal:** `tms-client-vue/pages/mediciones/[id]/momento/[momentoId].vue`

**Líneas clave:**
- **380-395**: Funciones de detección de tipo de variable
- **397-410**: Función de generación de rango de escala
- **106-137**: Renderizado de controles según tipo de variable

## 🎯 Cómo Funciona

### 1. Almacenamiento en Base de Datos

La unidad de medida se almacena en la tabla `Protocolo_Variable`:

```typescript
// src/entities/protocolo-variable.entity.ts
@Column({ type: 'varchar', length: 30, nullable: true })
unidad_medida: string | null;
```

- **Campo libre de texto** (VARCHAR 30 caracteres)
- **Opcional** (puede ser null)
- **NO hay validación de valores permitidos** en el backend
- El usuario puede escribir **cualquier texto** al crear/editar variables

### 2. Detección de Tipo en el Frontend

El sistema usa **3 funciones JavaScript** para detectar el tipo de control a mostrar:

#### A) `isTextVariable(variable)` - Variables de Texto

```javascript
function isTextVariable(variable: any) {
  const unit = (variable.unidad_medida || '').toLowerCase()
  const name = (variable.nombre_variable || '').toLowerCase()
  return unit.includes('texto') ||
         unit.includes('text') ||
         name.includes('observ') ||
         name.includes('nota') ||
         name.includes('comentario')
}
```

**Detecta:**
- Unidad contiene "texto" o "text"
- Nombre contiene "observ", "nota" o "comentario"

**Renderiza:** `<textarea>` multi-línea

#### B) `hasScale(variable)` - Variables con Escala

```javascript
function hasScale(variable: any) {
  const unit = variable.unidad_medida?.toLowerCase() || ''
  return unit.includes('escala') || unit.includes('1-') || unit.includes('0-')
}
```

**Detecta:**
- Unidad contiene "escala"
- Unidad contiene "1-" (ejemplo: "1-5", "1-9")
- Unidad contiene "0-" (ejemplo: "0-1", "0-100")

**Renderiza:** Input numérico + **botones de selección rápida** (si ≤ 10 valores)

#### C) Variables Numéricas Genéricas

Si no cumple ninguna de las anteriores:

**Renderiza:** `<input type="number">` simple

### 3. Generación de Rango de Escala

```javascript
function getScaleRange(variable: any): number[] {
  const unit = variable.unidad_medida || ''
  const match = unit.match(/(\d+)-(\d+)/)
  if (match) {
    const min = parseInt(match[1])
    const max = parseInt(match[2])
    const range: number[] = []
    for (let i = min; i <= max; i++) range.push(i)
    return range
  }
  return [0, 1, 2, 3, 4, 5]  // Default si no se detecta patrón
}
```

**Patrón regex:** `/(\d+)-(\d+)/`
- Busca el patrón "número-número" en la unidad de medida
- Genera array de botones del mínimo al máximo
- Si no encuentra patrón, usa [0,1,2,3,4,5] por defecto

## 📊 Tipos de Unidades Soportadas (Hardcoded)

### ✅ Escalas con Botones (≤ 10 valores)

| Unidad de Medida | Rango Detectado | Botones Generados |
|------------------|-----------------|-------------------|
| `ESCALA 1-5` | 1 a 5 | 5 botones: 1, 2, 3, 4, 5 |
| `ESCALA 0-5` | 0 a 5 | 6 botones: 0, 1, 2, 3, 4, 5 |
| `ESCALA 1-9` | 1 a 9 | 9 botones: 1, 2, 3, 4, 5, 6, 7, 8, 9 |
| `ESCALA 0-1` | 0 a 1 | 2 botones: 0, 1 |
| `1-5` | 1 a 5 | 5 botones |
| `0-10` | 0 a 10 | 11 botones |

### ⚠️ Escalas sin Botones (> 10 valores)

| Unidad de Medida | Rango Detectado | Renderizado |
|------------------|-----------------|-------------|
| `ESCALA 0-100` | 0 a 100 | Solo input numérico (101 botones = UX malo) |
| `1-50` | 1 a 50 | Solo input numérico |

**Código de límite:**
```vue
<div v-if="hasScale(variable) && getScaleRange(variable).length <= 10">
  <!-- Botones solo si ≤ 10 valores -->
</div>
```

### 📝 Variables de Texto

| Unidad de Medida | Renderizado |
|------------------|-------------|
| `TEXTO` | `<textarea>` |
| `texto` | `<textarea>` |
| `text` | `<textarea>` |
| Cualquier nombre con "observ", "nota", "comentario" | `<textarea>` |

### 🔢 Variables Numéricas Genéricas

| Unidad de Medida | Renderizado | Placeholder |
|------------------|-------------|-------------|
| `%` | `<input type="number">` | "0-100" |
| `CM` | `<input type="number">` | "Valor" |
| `g` | `<input type="number">` | "Valor" |
| `kg` | `<input type="number">` | "Valor" |
| `N°` | `<input type="number">` | "Valor" |
| Cualquier otro | `<input type="number">` | "Valor" |

## 🐛 Casos que Pueden Romper el Formulario

### 1. Escalas Muy Grandes (>100 valores)

**Problema:**
```
Unidad: "ESCALA 1-1000"
→ getScaleRange() genera array de 1000 elementos
→ NO renderiza botones (límite ≤10)
→ Funciona, pero podría causar lentitud si se elimina el límite
```

**Solución actual:** Límite de 10 botones previene este problema.

### 2. Patrones Ambiguos

**Problema:**
```
Unidad: "Entre 1-5 y 10-20"
→ Regex match detecta solo "1-5" (primer patrón)
→ Genera botones 1,2,3,4,5 (incorrecto)
```

**Solución:** Usar formato consistente "ESCALA X-Y" sin texto adicional.

### 3. Rangos Invertidos

**Problema:**
```
Unidad: "ESCALA 9-1"
→ min=9, max=1
→ Loop for(i=9; i<=1; i++) no ejecuta
→ Retorna array vacío → Sin botones
```

**Solución:** No hay validación. Usuario debe ingresar min < max.

### 4. Números Decimales en Escala

**Problema:**
```
Unidad: "ESCALA 0.5-5.5"
→ Regex no captura decimales (solo \d+)
→ No detecta patrón
→ Retorna default [0,1,2,3,4,5]
```

**Solución:** Las escalas solo funcionan con enteros.

### 5. Unidades Mixtas

**Problema:**
```
Unidad: "CM (ESCALA 1-100)"
→ hasScale() detecta "ESCALA" → true
→ getScaleRange() detecta "1-100" → 100 botones
→ Se filtran por límite ≤10, solo muestra input
```

**Solución actual:** Funciona por el límite de botones.

### 6. Case Sensitivity

**IMPORTANTE:** Las detecciones usan `.toLowerCase()`:
```javascript
unit.includes('escala')  // ✅ Funciona con ESCALA, Escala, escala
unit.includes('texto')   // ✅ Funciona con TEXTO, Texto, texto
```

**Esto está bien implementado y previene errores.**

## 🎨 Renderizado en el Formulario

```vue
<!-- Líneas 93-137 de momentoId.vue -->
<div v-for="variable in variables" :key="variable.id">

  <!-- TIPO 1: Textarea para variables de texto -->
  <textarea
    v-if="isTextVariable(variable)"
    v-model="formMediciones[variable.id]"
  ></textarea>

  <!-- TIPO 2: Input numérico para todo lo demás -->
  <input
    v-else
    v-model="formMediciones[variable.id]"
    type="number"
    inputmode="decimal"
  />

  <!-- TIPO 3: Botones de escala (solo si tiene escala y ≤10 valores) -->
  <div v-if="hasScale(variable) && getScaleRange(variable).length <= 10">
    <button
      v-for="n in getScaleRange(variable)"
      @click="formMediciones[variable.id] = String(n)"
    >
      {{ n }}
    </button>
  </div>
</div>
```

## 🔧 Mejoras Potenciales

### 1. Validación en Backend

Actualmente NO hay validación. Se podría crear un enum:

```typescript
export enum UnidadMedida {
  TEXTO = 'TEXTO',
  PORCENTAJE = '%',
  ESCALA_1_5 = 'ESCALA 1-5',
  ESCALA_1_9 = 'ESCALA 1-9',
  ESCALA_0_100 = 'ESCALA 0-100',
  CENTIMETROS = 'CM',
  GRAMOS = 'g',
  NUMERO = 'N°',
  // ...
}

// En DTO
@IsEnum(UnidadMedida, { message: 'Unidad de medida no válida' })
@IsOptional()
unidad_medida?: UnidadMedida;
```

### 2. Configuración Flexible

Almacenar metadatos de la variable:

```typescript
{
  nombre_variable: "Severidad enfermedad",
  tipo_control: "escala",  // 'escala', 'texto', 'numero', 'porcentaje'
  config_escala: {
    min: 1,
    max: 9,
    etiquetas: {
      1: "Muy bajo",
      5: "Medio",
      9: "Muy alto"
    }
  }
}
```

### 3. Regex Más Robusto

```javascript
// Soportar decimales y múltiples formatos
const patterns = [
  /ESCALA\s+(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/i,
  /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/,
]
```

### 4. Validación de Rangos

```javascript
function getScaleRange(variable: any): number[] {
  const match = unit.match(/(\d+)-(\d+)/)
  if (match) {
    const min = parseInt(match[1])
    const max = parseInt(match[2])

    // Validar
    if (min >= max) {
      console.warn(`Rango inválido: ${min}-${max}`)
      return []
    }
    if (max - min > 1000) {
      console.warn(`Rango muy grande: ${max-min} valores`)
      return []
    }

    // Generar
    return Array.from({length: max - min + 1}, (_, i) => min + i)
  }
  return [0, 1, 2, 3, 4, 5]
}
```

## 📋 Resumen

| Aspecto | Estado Actual |
|---------|---------------|
| **Almacenamiento** | Campo libre VARCHAR(30), sin validación |
| **Detección** | Hardcoded en 3 funciones JavaScript |
| **Tipos Soportados** | Texto, Escalas (enteros), Numérico genérico |
| **Límites** | Escalas ≤ 10 valores muestran botones |
| **Robustez** | Funcional pero puede dar problemas con formatos inesperados |
| **Extensibilidad** | Baja - requiere modificar código para nuevos tipos |

**Recomendación:** El sistema funciona bien para casos comunes. Para mayor robustez, considerar agregar validación en backend y/o migrar a configuración basada en JSON.

