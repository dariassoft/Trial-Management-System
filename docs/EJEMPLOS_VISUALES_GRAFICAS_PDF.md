# 📊 Ejemplos Visuales - Gráficas PDF Corregidas


Comparación visual del antes y después de la corrección de las gráficas en reportes PDF.

---

## 🔴 ANTES - Gráfica de Rendimiento con Valores Fijos

### Problema: Valores hardcodeados (5200-5900 kg/ha)

```
Ensayo 76 - Rendimiento Real: 2800 - 4200 kg/ha
Pero la gráfica mostraba:

┌───────────────────────────────────────────────────┐
│ Rendimiento Promedio por Tratamiento (kg/ha)     │
├───────────────────────────────────────────────────┤
│                                                   │
│ 5900 ─────────────────────────────────────       │
│                                                   │ Espacio vacío
│ 5700 ─────────────────────────────────────       │ (valores reales
│                                                   │  muy por debajo)
│ 5500 ─────────────────────────────────────       │
│                                                   │
│ 5300 ─────────────────────────────────────       │
│      ██                                           │ ← Barras invisibles
│ 5200 ████████ ──────────────────────────         │    (fuera de rango)
│      T1    T2    T3    T4                         │
└───────────────────────────────────────────────────┘
     ❌ PROBLEMA: No se ven las diferencias
```

### Lo que pasaba:
- Los datos reales (2800-4200) estaban muy por debajo del rango (5200-5900)
- Las barras aparecían como líneas casi invisibles
- Imposible comparar tratamientos visualmente
- Espacio desperdiciado en la gráfica

---

## 🟢 DESPUÉS - Gráfica de Rendimiento con Rango Dinámico

### Solución: Rango calculado automáticamente

```
Ensayo 76 - Rendimiento Real: 2800 - 4200 kg/ha
Rango calculado: 2660 - 4340 kg/ha (con 10% margen)

┌───────────────────────────────────────────────────┐
│ Rendimiento Promedio por Tratamiento (kg/ha)     │
├───────────────────────────────────────────────────┤
│                                                   │
│ 4340 ─────────────────────────────────────       │ ← Margen superior
│      ████████                                     │
│ 3920 ─────────────────────────────────────       │
│      ████████████                                 │
│ 3500 ─────────────────────────────────────       │ ← Grillas dinámicas
│      ████████████████                             │
│ 3080 ─────────────────────────────────────       │
│      ████████████████████                         │
│ 2660 ─────────────────────────────────────       │ ← Margen inferior
│      T1     T2     T3     T4                      │
│     2,800  3,200  3,600  4,100                    │
└───────────────────────────────────────────────────┘
     ✅ SOLUCIÓN: Diferencias claras y visibles
```

### Ventajas:
- ✅ Rango ajustado a los datos reales
- ✅ Diferencias entre tratamientos claramente visibles
- ✅ Uso eficiente del espacio vertical
- ✅ Márgenes apropiados (10% arriba y abajo)
- ✅ Grillas de referencia útiles

---

## 🔴 ANTES - Gráfica de GIE con Valores Fijos

### Problema: Rango fijo (94-100%)

```
Ensayo 76 - GIE Real: 96.2 - 97.8%
Pero la gráfica mostraba:

┌───────────────────────────────────────────────────┐
│ GIE Promedio por Tratamiento (%)                  │
├───────────────────────────────────────────────────┤
│                                                   │
│ 100% ─────────────────────────────────────       │
│                                                   │ Mucho espacio
│  99% ─────────────────────────────────────       │ vacío arriba
│                                                   │
│  98% ─────────────────────────────────────       │
│      ████████████████                             │
│  97% ████████████████████████████                 │ ← Diferencias
│      ████████████████████████████████████         │    poco claras
│  96% ████████████████████████████████████         │
│                                                   │
│  95% ─────────────────────────────────────       │
│                                                   │
│  94% ─────────────────────────────────────       │ Mucho espacio
│      T1         T2         T3         T4          │ vacío abajo
└───────────────────────────────────────────────────┘
     ❌ PROBLEMA: Difícil ver pequeñas diferencias
```

---

## 🟢 DESPUÉS - Gráfica de GIE con Rango Dinámico

### Solución: Rango ajustado a datos reales

```
Ensayo 76 - GIE Real: 96.2 - 97.8%
Rango calculado: 96.0 - 98.0% (con margen)

┌───────────────────────────────────────────────────┐
│ GIE Promedio por Tratamiento (%)                  │
├───────────────────────────────────────────────────┤
│                                                   │
│ 98.0% ─────────────────────────────────────      │ ← Margen superior
│       ██████████████████████████████████████      │
│ 97.5% ─────────────────────────────────────      │
│       ████████████████████████████████            │
│ 97.0% ─────────────────────────────────────      │ ← Zoom en el
│       ██████████████████████                      │    rango relevante
│ 96.5% ─────────────────────────────────────      │
│       ██████████                                  │
│ 96.0% ─────────────────────────────────────      │ ← Margen inferior
│       T1        T2        T3        T4            │
│      96.2%    96.8%    97.3%    97.8%            │
└───────────────────────────────────────────────────┘
     ✅ SOLUCIÓN: Diferencias pequeñas ahora visibles
```

### Ventajas:
- ✅ "Zoom" en el rango que realmente importa
- ✅ Pequeñas diferencias (0.5-1%) ahora son visibles
- ✅ Mejor aprovechamiento del espacio vertical
- ✅ Más fácil identificar el mejor tratamiento

---

## 📐 Caso Especial: Valores Muy Similares

### Cuando GIE son casi idénticos (rango < 2%)

```
Caso: GIE entre 97.1 - 97.4% (rango = 0.3%)

Si usáramos margen del 10%:
- Rango sería 97.07 - 97.43% (ventana muy pequeña)
- Difícil de leer

✅ SOLUCIÓN IMPLEMENTADA:
Cuando rango < 2%, usar ventana fija de ±3%

┌───────────────────────────────────────────────────┐
│ GIE Promedio por Tratamiento (%)                  │
├───────────────────────────────────────────────────┤
│                                                   │
│ 100.0% ────────────────────────────────────      │
│        ██████████████████████████████████         │
│  99.0% ────────────────────────────────────      │
│        ████████████████████████████               │
│  98.0% ────────────────────────────────────      │
│        ██████████████████                         │ ← Ventana de
│  97.0% ────────────────────────────────────      │    ±3% desde
│        ████                                       │    promedio
│  96.0% ────────────────────────────────────      │
│        T1       T2       T3       T4              │
│       97.1%   97.2%   97.3%   97.4%              │
└───────────────────────────────────────────────────┘
     ✅ Ventana más amplia para valores similares
```

---

## 🎯 Caso Real: Ensayo #76

### Datos Hipotéticos del Ensayo 76

Supongamos que el ensayo 76 tiene:

**Rendimientos:**
- T1: 3,100 kg/ha
- T2: 3,450 kg/ha
- T3: 2,900 kg/ha
- T4: 3,800 kg/ha

**GIE:**
- T1: 96.5%
- T2: 97.2%
- T3: 95.8%
- T4: 97.8%

---

### ❌ ANTES (con valores fijos)

**Rendimiento:** Rango 5200-5900 kg/ha
```
Las 4 barras aparecerían como líneas delgadas
cerca del 50% inferior del gráfico.
Imposible ver diferencias.
```

**GIE:** Rango 94-100%
```
Barras ocupando el 40-60% del gráfico.
Diferencia de 2% apenas visible.
```

---

### ✅ DESPUÉS (con rangos dinámicos)

**Rendimiento:** Rango 2,610 - 4,180 kg/ha (min-max + 10%)
```
┌─────────────────────────────────────────────┐
│ 4,180 ─────────────────────────────────     │
│       ████████████████████████████████       │ T4: 3,800
│ 3,785 ─────────────────────────────────     │
│       ████████████████████████               │ T2: 3,450
│ 3,395 ─────────────────────────────────     │
│       ████████████████████                   │ T1: 3,100
│ 3,000 ─────────────────────────────────     │
│       ████████████                           │ T3: 2,900
│ 2,610 ─────────────────────────────────     │
│       T1     T2     T3     T4                │
└─────────────────────────────────────────────┘
```

**GIE:** Rango 95.6 - 98.0% (min-max + 0.2%)
```
┌─────────────────────────────────────────────┐
│ 98.0% ─────────────────────────────────     │
│       ████████████████████████████████       │ T4: 97.8%
│ 97.4% ─────────────────────────────────     │
│       ████████████████████████               │ T2: 97.2%
│ 96.8% ─────────────────────────────────     │
│       ████████████████████                   │ T1: 96.5%
│ 96.2% ─────────────────────────────────     │
│       ██████████                             │ T3: 95.8%
│ 95.6% ─────────────────────────────────     │
│       T1     T2     T3     T4                │
└─────────────────────────────────────────────┘
```

---

## 🎨 Mejoras Adicionales Implementadas

### 1. Más Colores para Tratamientos

**Antes:** 3 colores (limitado)
```
T1: 🟥 Rojo
T2: 🟦 Azul
T3: 🟩 Verde
T4: 🟥 Rojo (repetido) ← Confuso
```

**Después:** 6 colores (mejor distinción)
```
T1: 🟥 Rojo
T2: 🩵 Cyan
T3: 🔵 Azul
T4: 🟩 Verde
T5: 🟨 Amarillo
T6: 🟫 Marrón
T7: 🟥 Rojo (se repite cada 6)
```

### 2. Límite de Ancho de Barras

**Antes:** Sin límite
```
Con 2 tratamientos:
┌────────────────┐
│ ██████████████ │ ← Barras muy anchas
│ ██████████████ │    (poco estéticas)
│ T1          T2 │
└────────────────┘
```

**Después:** Máximo 70-80px
```
Con 2 tratamientos:
┌────────────────┐
│   ████   ████  │ ← Barras proporcionales
│   ████   ████  │    (mejor aspecto)
│   T1      T2   │
└────────────────┘
```

### 3. Páginas Dedicadas

**Antes:**
```
Página X:
- [Final de tabla]
- [Inicio gráfico rendimiento]
Página X+1:
- [Continuación gráfico] ← ROTO ❌
```

**Después:**
```
Página X:
- [Tablas y datos]
Página X+1:
- [Gráfico rendimiento completo] ✅
Página X+2:
- [Gráfico GIE completo] ✅
Página X+3:
- [Gráfico plagas completo] ✅
```

---

## 📏 Dimensiones Finales

| Elemento | Ancho | Alto | Posición |
|----------|-------|------|----------|
| Recuadro gráfico | 450px | 200-240px | x=50, y=120 (fijo) o validado |
| Barras (rendimiento) | Variable, máx 70px | Proporcional a valor | - |
| Barras (GIE) | Variable, máx 80px | Proporcional a valor | - |
| Márgenes laterales | 50px | - | Izquierda: 50px |
| Espacio para etiquetas | - | 50px | Debajo del gráfico |

---

## 🎯 Resultado Visual Final

### Vista General del PDF

```
┌─────────────────────────────────────────────────┐
│ Página 1: Portada                               │
│ Página 2: Resumen Ejecutivo                     │
│ Página 3: Datos del Ensayo                      │
│ Página 4: Protocolo y Condiciones               │
│ Página 5: Evaluaciones (fechas)                 │
│ Página 6: Detalle Evaluaciones (landscape)      │
│ Página 7: Datos de Campo                        │
│ Página 8: Datos de Cosecha                      │
│ Página 9: Estadísticas (tabla)                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Página 10: GRÁFICO RENDIMIENTO              │ │
│ │                                             │ │
│ │ ✅ Rango dinámico                           │ │
│ │ ✅ Barras dentro del recuadro               │ │
│ │ ✅ Valores legibles                         │ │
│ │ ✅ Sin cortes                               │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Página 11: GRÁFICO GIE                      │ │
│ │                                             │ │
│ │ ✅ Rango ajustado                           │ │
│ │ ✅ Diferencias visibles                     │ │
│ │ ✅ Página dedicada                          │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Página 12: GRÁFICO PLAGAS (si hay datos)    │ │
│ │                                             │ │
│ │ ✅ Dos series (larvas y benéficos)          │ │
│ │ ✅ Leyenda clara                            │ │
│ │ ✅ Colores distintivos                      │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🌟 Beneficios Finales

1. ✅ **Adaptación Automática:** Funciona con cualquier rango de datos
2. ✅ **Profesionalismo:** Gráficas limpias y bien presentadas
3. ✅ **Legibilidad:** Diferencias claras incluso en rangos pequeños
4. ✅ **Sin Mantenimiento:** No hay que ajustar valores manualmente
5. ✅ **Escalabilidad:** Soporta 2-10+ tratamientos sin problemas
6. ✅ **Consistencia:** Mismo formato para todos los ensayos

---

**¡Las gráficas ahora son dinámicas, profesionales y siempre se ven bien!** 🎉

