# 🔧 Correcciones Adicionales - Gráficas PDF

**Fecha:** 2026-04-09
**Problemas corregidos:** 2

---

## 🐛 Problema 1: Barras de GIE por Fuera del Recuadro

### Descripción del Problema
Las barras de la gráfica "GIE Promedio por Tratamiento (%)" se dibujaban **por debajo del recuadro contenedor**.

### Causa Raíz
```typescript
// ❌ ANTES - Sin validación de rango
valores.forEach((valor, idx) => {
  const bh = ((valor - minVal) / range) * h;  // ← Si valor < minVal, bh es negativa
  const by = y + h - bh;  // ← by queda fuera del recuadro
  // ...
});
```

Cuando un valor de GIE era menor que `minVal` calculado, la altura de la barra (`bh`) se volvía negativa, haciendo que `by` (posición Y) quedara por debajo del recuadro.

### Solución Implementada
```typescript
// ✅ DESPUÉS - Con validación de rango
valores.forEach((valor, idx) => {
  // Asegurar que el valor esté dentro del rango calculado
  const valorAjustado = Math.max(minVal, Math.min(maxVal, valor));

  // Calcular altura de la barra basado en el valor ajustado
  const bh = ((valorAjustado - minVal) / range) * h;  // ← Siempre positivo
  const bx = x + idx * (w / labels.length) + spacing;
  const by = y + h - bh;  // ← Siempre dentro del recuadro

  // Valor encima de la barra (mostrar valor real, no ajustado)
  doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold')
    .text(`${valor.toFixed(1)}%`, bx, by - 15, { width: barWidth, align: 'center' });
  // ...
});
```

### Beneficios
- ✅ Las barras siempre se dibujan dentro del recuadro
- ✅ Se muestra el valor real (no ajustado) en la etiqueta
- ✅ Previene barras negativas o posiciones incorrectas
- ✅ Funciona con cualquier rango de valores de GIE

---

## 🐛 Problema 2: Distribución de Tratamientos Muestra 0

### Descripción del Problema
En la página 4 del PDF, la sección "Distribución de Tratamientos" mostraba:
```
Diseño: No especificado
Repeticiones: 0 bloques
Tratamientos: 0
```

Aún cuando el ensayo **sí tenía** tratamientos y bloques.

### Causa Raíz
```typescript
// ❌ ANTES - No se pasaban protocolo y diseno al PDF
const pdfData = {
  metadatos: datosRaw.metadatos,
  datosCampo: datosRaw.datosCampo || [],
  datosTrilla: datosRaw.datosTrilla || [],
  estadisticas: datosRaw.estadisticas,
  resumen,
  fotos: datosRaw.fotos || [],
  evaluacionesFechas: datosRaw.evaluacionesFechas || [],
  evaluacionesDetalle: datosRaw.evaluacionesDetalle || [],
  headerEvaluaciones: datosRaw.headerEvaluaciones || [],
  // ❌ Faltaban protocolo y diseno
};
```

El método `obtenerDatosEnsayoRaw()` **sí calculaba** correctamente `protocolo` y `diseno`:
```typescript
const diseno = {
  nombre: ensayo.nombreEnsayo || 'No especificado',
  repeticiones: new Set(ensayo.parcelas?.map((p: any) => p.bloque?.bloque_id)).size || 0,
  tratamientos: new Set(ensayo.parcelas?.map((p: any) => p.tratamiento?.tratamiento_id)).size || 0,
};

return {
  // ...
  protocolo,
  diseno,  // ← Se calculaba pero no se pasaba al PDF
};
```

Pero estos no se incluían en el objeto `pdfData` que se pasaba al generador de PDF.

### Solución Implementada
```typescript
// ✅ DESPUÉS - Incluir protocolo y diseno
const pdfData = {
  metadatos: datosRaw.metadatos,
  datosCampo: datosRaw.datosCampo || [],
  datosTrilla: datosRaw.datosTrilla || [],
  estadisticas: datosRaw.estadisticas,
  resumen,
  fotos: datosRaw.fotos || [],
  evaluacionesFechas: datosRaw.evaluacionesFechas || [],
  evaluacionesDetalle: datosRaw.evaluacionesDetalle || [],
  headerEvaluaciones: datosRaw.headerEvaluaciones || [],
  protocolo: datosRaw.protocolo || {},    // ✅ Agregado
  diseno: datosRaw.diseno || {},          // ✅ Agregado
};
```

### Resultado Esperado
Ahora la página 4 del PDF mostrará correctamente:
```
Distribución de Tratamientos
Diseño: Nombre del Ensayo
Repeticiones: 3 bloques  ← Valor real
Tratamientos: 5          ← Valor real
```

---

## 📊 Archivos Modificados

### 1. `src/reportes/pdf-generator.ts`
**Líneas modificadas:** 548-568 (función `dibujarGraficoGIESimple`)

**Cambios:**
- Agregada validación de rango con `Math.max` y `Math.min`
- Asegurar que `valorAjustado` esté siempre entre `minVal` y `maxVal`
- Comentarios explicativos

### 2. `src/reportes/reportes.service.ts`
**Líneas modificadas:** 716-728 (función `generarPDFEnsayo`)

**Cambios:**
- Agregadas líneas 727-728:
  ```typescript
  protocolo: datosRaw.protocolo || {},
  diseno: datosRaw.diseno || {},
  ```

---

## 🧪 Cómo Verificar las Correcciones

### Verificar Problema 1 (GIE)
1. Generar PDF del ensayo #76
2. Ir a la página con "GIE Promedio por Tratamiento (%)"
3. Verificar que:
   - ✅ Todas las barras están dentro del recuadro negro
   - ✅ No hay barras dibujadas debajo del recuadro
   - ✅ Los valores sobre las barras son correctos
   - ✅ Las barras están alineadas con las etiquetas inferiores

### Verificar Problema 2 (Distribución)
1. Generar PDF del ensayo #76
2. Ir a la página 4: "PROTOCOLO, CONDICIONES Y DISTRIBUCIÓN"
3. Buscar la sección "Distribución de Tratamientos"
4. Verificar que:
   - ✅ "Diseño" muestra el nombre del ensayo (no "No especificado")
   - ✅ "Repeticiones" muestra número > 0 (ej: "3 bloques")
   - ✅ "Tratamientos" muestra número > 0 (ej: "5")

---

## 🎯 Ejemplo Visual

### Antes ❌ - GIE con barras fuera
```
┌─────────────────────────────────────┐
│ GIE Promedio por Tratamiento (%)    │
├─────────────────────────────────────┤
│ 98% ─────────────────────────       │
│                                      │
│ 96% ─────────────────────────       │
│                                      │
│ 94% ─────────────────────────       │
└─────────────────────────────────────┘
  ████  ← Barra dibujada FUERA (debajo)
  T1
```

### Después ✅ - GIE con barras dentro
```
┌─────────────────────────────────────┐
│ GIE Promedio por Tratamiento (%)    │
├─────────────────────────────────────┤
│ 98% ─────────────────────────       │
│     ████████                         │ ← Dentro del recuadro
│ 96% ─────────────────────────       │
│     ████████████                     │ ← Dentro del recuadro
│ 94% ─────────────────────────       │
└─────────────────────────────────────┘
      T1        T2
```

---

## 📝 Tests Realizados

- [x] Compilación: Sin errores
- [x] Backend reiniciado: OK
- [x] Código revisado: Sin errores lógicos
- [ ] **Pendiente:** Validación visual con ensayo #76 real

---

## 🔍 Casos Edge Considerados

### Para el Problema 1 (GIE)
1. ✅ Valores de GIE < minVal calculado
2. ✅ Valores de GIE > maxVal calculado
3. ✅ Valores de GIE exactamente = minVal
4. ✅ Valores de GIE exactamente = maxVal
5. ✅ Valores de GIE dentro del rango normal

### Para el Problema 2 (Distribución)
1. ✅ Ensayos con protocolo definido
2. ✅ Ensayos sin protocolo definido
3. ✅ Ensayos con múltiples bloques
4. ✅ Ensayos con múltiples tratamientos
5. ✅ Ensayos sin bloques o tratamientos (mostrará 0)

---

## 🚀 Deployment

**Estado:** ✅ Implementado y desplegado

**Pasos realizados:**
1. ✅ Código modificado
2. ✅ Errores verificados (solo warnings menores)
3. ✅ Backend reiniciado: `docker compose restart app`
4. ✅ Backend corriendo sin errores

**Pendiente:**
- [ ] Generar PDF de ensayo #76 para validación final
- [ ] Verificar visualmente ambas correcciones
- [ ] Confirmar con usuario que los problemas están resueltos

---

## 📞 Comandos de Validación

```bash
# Generar PDF de prueba
curl -X GET "http://localhost:3000/api/v1/reportes/ensayo/76/pdf" \
  -H "Authorization: Bearer TU_TOKEN" \
  --output ensayo_76_corregido_v2.pdf

# Ver logs en tiempo real
docker compose logs -f app | grep -E "(GIE|Distribución|diseno|protocolo)"

# Verificar estado del backend
docker compose ps app
```

---

## ✨ Resumen Ejecutivo

### Problema 1: Gráfica de GIE
**Antes:** Barras por fuera del recuadro ❌
**Después:** Barras siempre dentro del recuadro ✅
**Solución:** Validación de rango con `Math.max` y `Math.min`

### Problema 2: Distribución de Tratamientos
**Antes:** Mostraba "0 bloques" y "0 tratamientos" ❌
**Después:** Muestra valores reales del ensayo ✅
**Solución:** Incluir `protocolo` y `diseno` en `pdfData`

---

**Implementado por:** GitHub Copilot
**Fecha:** 2026-04-09
**Archivos modificados:** 2
**Líneas modificadas:** ~25
**Estado:** ✅ Listo para validación

