# 🔧 Solución: Gráficas Desbordadas en Reportes PDF

**Fecha:** 2026-04-08
**Problema:** Las gráficas de "Rendimiento Promedio" y "GIE Promedio" se salen de los recuadros y se rompen entre páginas
**Ensayo de prueba:** ID 76

---

## 🐛 Problema Identificado

### Gráfica de Rendimiento
- **Valores fijos hardcodeados:** `minVal=5200`, `maxVal=5900`
- Las barras se salían del recuadro cuando los valores reales estaban fuera de este rango
- No había ajuste dinámico a los datos

### Gráfica de GIE
- **Valores fijos hardcodeados:** `minVal=94`, `maxVal=100`
- Mismo problema: valores fuera del rango rompían el gráfico
- Usaba `doc.y` (posición relativa) en lugar de coordenadas fijas

### Gráfica de Plagas
- Usaba `doc.y` lo que causaba saltos de página inesperados

### Problemas Comunes
1. **Valores hardcodeados** no se ajustaban a datos reales
2. **Posiciones relativas** (`doc.y`) causaban saltos de página
3. **Sin verificación de espacio** en la página antes de dibujar
4. **Dimensiones fijas** no adaptables

---

## ✅ Solución Implementada

### 1. Cálculo Dinámico de Rangos

#### Gráfico de Rendimiento
```typescript
// Calcular rango dinámico
const maxRendimiento = Math.max(...rendimientos);
const minRendimiento = Math.min(...rendimientos);
const rangoRendimiento = maxRendimiento - minRendimiento;

// Agregar 10% de margen arriba y abajo
const margen = rangoRendimiento * 0.1 || 100;
const minVal = Math.max(0, minRendimiento - margen);
const maxVal = maxRendimiento + margen;
```

**Beneficios:**
- Se ajusta automáticamente a cualquier rango de datos
- Agrega margen visual (10%) para mejor legibilidad
- Evita valores negativos con `Math.max(0, ...)`

#### Gráfico de GIE
```typescript
// Calcular rango dinámico basado en valores reales
const maxGie = Math.max(...valores);
const minGie = Math.min(...valores);
const rangoGie = maxGie - minGie;

// Si el rango es muy pequeño (valores muy similares)
if (rangoGie < 2) {
  const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
  minVal = Math.max(0, promedio - 3);
  maxVal = Math.min(100, promedio + 3);
} else {
  const margen = rangoGie * 0.1;
  minVal = Math.max(0, minGie - margen);
  maxVal = Math.min(100, maxGie + margen);
}
```

**Beneficios:**
- Maneja valores similares (rango < 2%) con ventana fija de ±3%
- Para rangos normales, usa margen del 10%
- Limita valores entre 0-100% (lógico para GIE)

### 2. Posiciones Fijas en Página

**Antes:**
```typescript
const y = doc.y; // Posición relativa - causa saltos
```

**Después:**
```typescript
// Gráfico GIE
doc.addPage(); // Nueva página dedicada
const y = 120; // Posición fija desde el margen superior
```

**Beneficios:**
- Cada gráfico en su propia página
- Posición predecible y consistente
- No hay riesgo de corte entre páginas

### 3. Verificación de Espacio Disponible

```typescript
// Verificar espacio en página - altura necesaria:
// título(30) + gráfico(200) + margen(50) = 280px
if (doc.y > 550) {
  doc.addPage();
}
```

**Beneficios:**
- Previene cortes de gráficos
- Dimensiones predecibles en A4 (altura ~842px, margen ~40px)

### 4. Límites de Ancho de Barras

```typescript
const barWidth = Math.min((w / labels.length) * 0.6, 70); // Máximo 70px
```

**Beneficios:**
- Evita barras demasiado anchas con pocos tratamientos
- Mantiene proporciones visuales correctas

### 5. Mejoras en Grillas de Referencia

**Antes:**
```typescript
// Solo 4 líneas intermedias
for (let i = 1; i < gridLines; i++) { ... }
```

**Después:**
```typescript
// 5 líneas (0, 25%, 50%, 75%, 100% del rango)
for (let i = 0; i <= gridLines; i++) {
  const val = maxVal - (range / gridLines) * i;
  // Etiquetas desde máximo hacia mínimo
}
```

**Beneficios:**
- Mejor lectura visual del rango completo
- Etiquetas más claras (incluye min y max)

---

## 📊 Dimensiones Actualizadas

| Gráfico | Ancho | Alto | Posición Y | Página |
|---------|-------|------|------------|--------|
| Rendimiento | 450px | 200px | doc.y (con validación) | Misma o nueva |
| GIE | 450px | 240px | 120px (fija) | Nueva página |
| Plagas | 450px | 240px | 120px (fija) | Nueva página |

---

## 🎨 Mejoras Visuales Adicionales

1. **Colores adicionales:** Agregados más colores a la paleta para soportar más tratamientos
   - `['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E']`

2. **Bordes más definidos:** `lineWidth(1.5)` para marcos, `lineWidth(1)` para barras

3. **Fondo blanco explícito:** Evita transparencias no deseadas

4. **Texto condicional:** Solo muestra valores si hay espacio suficiente (h > 15px)

---

## 🧪 Pruebas Recomendadas

Para validar la solución, probar con:

1. **Ensayo con valores extremos de rendimiento** (ej: 1000 - 8000 kg/ha)
2. **Ensayo con GIE muy similares** (ej: todos entre 97-98%)
3. **Ensayo con muchos tratamientos** (ej: 8-10 tratamientos)
4. **Ensayo con pocos tratamientos** (ej: 2-3 tratamientos)
5. **Ensayo ID 76** (caso reportado originalmente)

---

## 📝 Archivos Modificados

- ✅ `src/reportes/pdf-generator.ts`
  - `generarGraficosPNG()` - Lógica de generación principal
  - `dibujarGraficoBarras()` - Gráfico de rendimiento con rango dinámico
  - `dibujarGraficoGIESimple()` - Gráfico de GIE con rango dinámico
  - `dibujarGraficoPlayasSimple()` - Gráfico de plagas con posición fija
  - ❌ Eliminados métodos obsoletos: `dibujarGraficoBarrasGIE()`, `dibujarGraficoComparativo()`

---

## ✨ Resultado Esperado

✅ Gráficos completamente contenidos dentro de sus recuadros
✅ Escalas que se ajustan automáticamente a los datos
✅ Sin cortes entre páginas
✅ Legibilidad mejorada con márgenes adecuados
✅ Soporta cualquier rango de valores (0 - infinito para rendimiento, 0-100% para GIE)

---

## 🚀 Próximos Pasos

1. ✅ **Compilar y reiniciar backend**
   ```bash
   docker compose restart app
   ```

2. ✅ **Generar reporte PDF del ensayo 76**
   - Verificar que las gráficas estén correctamente contenidas
   - Validar que los rangos sean legibles

3. 🔍 **Revisar otros ensayos** con diferentes rangos de datos

4. 📊 **Considerar mejoras futuras:**
   - Agregar línea de objetivo/testigo en gráficos
   - Barras de error (desviación estándar)
   - Tooltips informativos
   - Exportar gráficos como SVG independientes

---

**Estado:** ✅ Implementado y listo para pruebas
**Impacto:** Alto - Afecta a todos los reportes PDF generados
**Compatibilidad:** Totalmente compatible con datos existentes

