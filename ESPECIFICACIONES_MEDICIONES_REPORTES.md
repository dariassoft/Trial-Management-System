# 📊 ESPECIFICACIONES DE MEDICIONES PARA REPORTES

**Documento:** Guía técnica de mediciones, cálculos y parámetros para reportes
**Versión:** 1.0
**Fecha:** 2026-03-03
**Estado:** ✅ ACTIVO

---

## 🎯 PROPÓSITO

Este documento define **todos los campos de medición** que se capturan por parcela y cómo se utilizarán para:
- ✅ Cálculos de rendimiento
- ✅ Análisis de calidad
- ✅ Comparación por tratamiento
- ✅ Generación de reportes
- ✅ Toma de decisiones agronómicas

---

## 📋 CAMPOS DE MEDICIÓN CAPTURADOS

### Sección 1: Datos Básicos de Cosecha

| Campo | Tipo | Unidad | Propósito | Ejemplo |
|-------|------|--------|-----------|---------|
| **fechaCosecha** | Date | YYYY-MM-DD | Fecha de cosecha | 2026-03-03 |
| **humedadPct** | Decimal | % | Porcentaje de humedad en grano | 12.5 |
| **kgHaCorregido** | Decimal | kg/ha | Rendimiento corregido a humedad estándar | 5450.20 |
| **gie** | Decimal | % | Germinación/Integridad/Especificidad | 97.3 |
| **observaciones** | Text | - | Notas generales del proceso | "Cosecha en condiciones óptimas" |

---

### Sección 2: Gramaje y Calidad de Grano (NUEVOS)

| Campo | Tipo | Unidad | Propósito | Ejemplo | Fórmula |
|-------|------|--------|-----------|---------|---------|
| **gramajePorGrano** | Decimal | g | Peso de un grano individual | 0.045 | P.Individual |
| **granosPorurf** | Decimal | granos/m² | Cantidad de granos por m² | 48500 | Conteo directo |
| **pesoGranosPorUrf** | Decimal | g/m² | Peso total de granos por m² | 2182.5 | **granosPorurf × gramajePorGrano** |
| **granosDañados** | Decimal | % | Porcentaje de granos dañados | 4.2 | (Dañados/Total) × 100 |
| **granosVerdes** | Decimal | % | Porcentaje de granos verdes (inmaduros) | 2.1 | (Verdes/Total) × 100 |
| **granosVanos** | Decimal | % | Porcentaje de granos vanos (sin germen) | 1.8 | (Vanos/Total) × 100 |

---

### Sección 3: Mediciones de la Parcela por m² (NUEVOS)

| Campo | Tipo | Unidad | Propósito | Ejemplo | Relevancia |
|-------|------|--------|-----------|---------|------------|
| **hojasPorUrf** | Decimal | hojas/m² | Cantidad total de hojas | 4850 | Área foliar, fotosíntesis |
| **larvasPorUrf** | Decimal | count/m² | Cantidad de larvas/plagas | 12 | Presión de plagas |
| **insectosBeneficiosPorUrf** | Decimal | count/m² | Insectos benéficos (polinizadores, depredadores) | 28 | Control natural |
| **diametroEspiga** | Decimal | mm | Diámetro de la espiga principal | 8.5 | Robustez, resistencia |
| **alturaParcela** | Decimal | cm | Altura media de plantas | 75.5 | Desarrollo vegetativo |
| **densidadPlantasFinal** | Decimal | plantas/m² | Densidad final de plantas | 8.2 | Supervivencia, población |

---

## 🧮 CÁLCULOS Y MÉTRICAS DERIVADAS

### Cálculos Automáticos (Para Reportes)

```
1. RENDIMIENTO AJUSTADO AL TRATAMIENTO
   Rendimiento = kgHaCorregido / densidadPlantasFinal

2. PRODUCCIÓN DE GRANO PURO (sin defectos)
   Grano_Puro (%) = 100 - (granosDañados + granosVerdes + granosVanos)
   Kg_Ha_Puro = kgHaCorregido × (Grano_Puro / 100)

3. CALIDAD FINAL DEL GRANO
   Índice_Calidad = (gie × Grano_Puro) / 100
   (Escala 0-100, donde 100 = máxima calidad)

4. EFICIENCIA DE CONVERSIÓN
   Eficiencia = (pesoGranosPorUrf × 10) / kgHaCorregido
   (Esperado: cercano a 100, validación de datos)

5. PRESIÓN DE PLAGAS (ÍNDICE)
   Índice_Plagas = larvasPorUrf / (insectosBeneficiosPorUrf + 1)
   (Menor = mejor; >1 indica desequilibrio)

6. ÍNDICE DE SANIDAD
   Sanidad = (gie × Grano_Puro) / (Índice_Plagas + 1)
   (Mayor = mejor estado general)

7. EFICIENCIA FOLIAR
   Índice_Foliar = kgHaCorregido / (hojasPorUrf / 100)
   (Producción por unidad de área foliar)

8. VIGOR Y DESARROLLO
   Índice_Vigor = (alturaParcela × diametroEspiga × densidadPlantasFinal) / 1000
   (Indicador de capacidad productiva)
```

---

## 📊 AGRUPACIÓN DE DATOS PARA REPORTES

### Por Tratamiento
```
Tratamiento: T1
├─ Rendimiento promedio: 5450 kg/ha
├─ Calidad promedio: 94.2%
├─ Granos/m² promedio: 48,500
├─ Plagas/m² promedio: 8.5
└─ Altura promedio: 76 cm
```

### Por Bloque
```
Bloque: 1
├─ Plantas/m² final: 8.3
├─ Hojas/m² promedio: 4920
├─ Índice plagas promedio: 0.35
└─ Humedad promedio: 12.1%
```

### Por Ensayo
```
Ensayo: Ensayo-001
├─ Total parcelas: 12
├─ Rendimiento rango: 5200-5800 kg/ha
├─ Mejor tratamiento: T2 (5750 kg/ha)
├─ Calidad general: 92.5%
└─ Presión plagas: MEDIA
```

---

## 📈 REPORTES A GENERAR

### Reporte 1: Rendimiento y Calidad por Tratamiento

**Contenido:**
```
Tabla con columnas:
- Tratamiento
- Parcelas (N)
- Rendimiento (kg/ha) - promedio ± std
- Humedad (%) - promedio
- GIE (%) - promedio
- Grano Puro (%) - promedio
- Calidad Final (0-100) - promedio
- Granos/m² - promedio
- Peso grano/m² (g) - promedio

Gráficos:
- Barras: Rendimiento por tratamiento
- Línea: Variabilidad (CV%)
- Cajas: Distribución de rendimientos
```

---

### Reporte 2: Sanidad e Incidencia de Plagas

**Contenido:**
```
Tabla con columnas:
- Tratamiento
- Larvas/m² (promedio)
- Insectos benéficos/m² (promedio)
- Índice plagas (Larvas / Benéficos+1)
- Hojas dañadas (%)
- Observaciones sanidad

Gráficos:
- Barras comparativas: Plagas vs. Benéficos
- Línea: Evolución de presión a lo largo del ensayo
- Heatmap: Distribución espacial de plagas
```

---

### Reporte 3: Análisis de Desarrollo Vegetativo

**Contenido:**
```
Tabla con columnas:
- Tratamiento
- Altura (cm) - promedio ± std
- Diámetro espiga (mm) - promedio
- Hojas/m² - promedio
- Plantas/m² final - promedio
- Supervivencia (%) vs. siembra
- Índice vigor

Gráficos:
- Barras: Altura por tratamiento
- Línea: Crecimiento comparativo
- Scatter: Relación altura vs. rendimiento
```

---

### Reporte 4: Composición del Grano

**Contenido:**
```
Tabla con columnas:
- Tratamiento
- % Granos sanos
- % Granos dañados
- % Granos verdes
- % Granos vanos
- Gramaje/grano (g)
- Granos/m² (promedio)
- Estimado kg/ha (gramaje × granos/m² ÷ 1000)

Gráficos:
- Pie: Composición de grano (sanos, dañados, verdes, vanos)
- Barras stacked: Comparativa por tratamiento
- Línea: Evolución de defectos
```

---

### Reporte 5: Análisis de Eficiencia

**Contenido:**
```
Tabla con columnas:
- Tratamiento
- Eficiencia conversión (%) - validación de datos
- Eficiencia foliar (kg/ha por cada 100 hojas/m²)
- Índice vigor (desarrollo general)
- Índice sanidad (calidad × plagas)
- Rendimiento/planta (kg/planta)

Gráficos:
- Radar: Múltiples índices de eficiencia
- Barras: Comparativa de eficiencias
- Scatter: Rendimiento vs. Eficiencia foliar
```

---

### Reporte 6: Resumen Ejecutivo Comparativo

**Contenido:**
```
Por cada Tratamiento:
┌─────────────────────────────────┐
│ TRATAMIENTO: T1                 │
├─────────────────────────────────┤
│ Rendimiento:     5450 ± 150 kg/ha
│ Calidad:         94.2% (Buena)
│ Plagas:          MEDIA (8.5/m²)
│ Desarrollo:      NORMAL (76 cm)
│ Recomendación:   VIABLE
└─────────────────────────────────┘
```

---

## 🔐 VALIDACIÓN DE DATOS

Antes de generar reportes, validar:

```
1. COHERENCIA GRAMAJE
   ✓ pesoGranosPorUrf ≈ granosPorurf × gramajePorGrano / 1000
   (Margen de error: ±10%)

2. COHERENCIA RENDIMIENTO
   ✓ kgHaCorregido ≈ pesoGranosPorUrf × 10
   (Debe estar dentro de 15% de tolerancia)

3. PORCENTAJES DE DEFECTOS
   ✓ granosDañados + granosVerdes + granosVanos ≤ 100
   (No pueden superar 100% en total)

4. DENSIDAD FINAL
   ✓ densidadPlantasFinal > 0
   ✓ densidadPlantasFinal ≤ densidadSiembra
   (No puede haber más plantas de las sembradas)

5. ALTURAS LÓGICAS
   ✓ alturaParcela > 0 y < 200 cm
   ✓ diametroEspiga > 0 y < 20 mm

6. CONTEOS LÓGICOS
   ✓ hojasPorUrf > 1000 (mínimo esperado)
   ✓ larvasPorUrf ≥ 0
   ✓ insectosBeneficiosPorUrf ≥ 0
```

---

## 🧪 CASOS DE USO PARA ANÁLISIS

### Caso 1: Evaluación de Tratamiento Fitosanitario
```
Comparar:
- larvasPorUrf entre Tratado vs. Testigo
- insectosBeneficiosPorUrf (efecto en fauna útil)
- Resultado en rendimiento (kgHaCorregido)
- Conclusión: Efectividad del producto
```

### Caso 2: Evaluación de Calidad de Grano
```
Priorizar:
- GIE (germinación/integridad)
- Grano_Puro (% granos sanos)
- Índice_Calidad derivado
- Valorar: Gramaje, defectos específicos
- Conclusion: Aptitud comercial
```

### Caso 3: Análisis de Desarrollo Vegetativo
```
Observar:
- alturaParcela y diametroEspiga
- densidadPlantasFinal y supervivencia
- Correlación con rendimiento final
- Validar: Potencial genético del tratamiento
```

### Caso 4: Detección de Problemas
```
Investigar si:
- Rendimiento bajo pero Eficiencia normal → Problemas de cosecha
- Plagas altas pero Benéficos bajos → Desequilibrio biológico
- Granos/m² normal pero peso bajo → Inmadurez, sequia
- Altura baja pero hojas altas → Estrés hídrico
```

---

## 🔄 FLUJO DE CAPTURA Y ANÁLISIS

```
1. CAMPO (Cosecha)
   └─→ Capturar 18 campos nuevos
        + 5 campos básicos existentes
        = 23 campos total por parcela

2. VALIDACIÓN (Automática)
   └─→ Verificar coherencia de datos
       Alertar si hay inconsistencias

3. CÁLCULO (Automático)
   └─→ Derivar 8+ métricas
       Índices de calidad, eficiencia, etc.

4. AGREGACIÓN (Por grupo)
   └─→ Promediar por Tratamiento
       Promediar por Bloque
       Promediar por Ensayo

5. REPORTES (Generación)
   └─→ 6 reportes principales
       Gráficos y tablas
       Análisis comparativos

6. DECISIONES (Agronómicas)
   └─→ Recomendaciones por tratamiento
       Validación de resultados
       Próximos ensayos
```

---

## 📁 ESTRUCTURA EN BASE DE DATOS

### Tabla: Datos_Cosecha (AMPLIADA)

```sql
CREATE TABLE Datos_Cosecha (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parcelaId INT NOT NULL,

  -- Campos originales
  fechaCosecha DATE,
  humedadPct DECIMAL(5,2),
  kgHaCorregido DECIMAL(8,2),
  gie DECIMAL(5,2),

  -- Nuevos: Gramaje y calidad
  gramajePorGrano DECIMAL(8,6),
  granosPorurf DECIMAL(10,1),
  pesoGranosPorUrf DECIMAL(8,2),
  granosDañados DECIMAL(5,2),
  granosVerdes DECIMAL(5,2),
  granosVanos DECIMAL(5,2),

  -- Nuevos: Mediciones de parcela
  hojasPorUrf DECIMAL(10,1),
  larvasPorUrf DECIMAL(8,2),
  insectosBeneficiosPorUrf DECIMAL(8,2),
  diametroEspiga DECIMAL(5,2),
  alturaParcela DECIMAL(5,1),
  densidadPlantasFinal DECIMAL(6,2),

  -- Común
  observaciones TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (parcelaId) REFERENCES Parcela(id)
);
```

---

## 📊 EJEMPLO DE DATOS COMPLETOS

```json
{
  "parcelaId": 30,
  "fechaCosecha": "2026-03-03",
  "humedadPct": 12.5,
  "kgHaCorregido": 5450.20,
  "gie": 97.3,

  "gramajePorGrano": 0.0450,
  "granosPorurf": 48500,
  "pesoGranosPorUrf": 2182.50,
  "granosDañados": 4.2,
  "granosVerdes": 2.1,
  "granosVanos": 1.8,

  "hojasPorUrf": 4850,
  "larvasPorUrf": 12,
  "insectosBeneficiosPorUrf": 28,
  "diametroEspiga": 8.5,
  "alturaParcela": 75.5,
  "densidadPlantasFinal": 8.2,

  "observaciones": "Cosecha en condiciones óptimas, buena población final"
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Campos agregados a parcelas.vue
- [ ] Modal expandido con todos los campos
- [ ] DTO actualizado en backend
- [ ] Tabla Datos_Cosecha ampliada en BD
- [ ] Validación de datos implementada
- [ ] Funciones de cálculo derivadas creadas
- [ ] Reportes generador implementado
- [ ] Testing de captura completo
- [ ] Testing de cálculos validado
- [ ] Documentación de reportes completada
- [ ] Training de usuarios realizado
- [ ] Go live a producción

---

## 🎯 PRÓXIMOS PASOS

1. **Actualizar BD:** Agregar nuevos campos a tabla Datos_Cosecha
2. **Backend:** Crear DTO con nuevos campos
3. **Validación:** Implementar validación de coherencia
4. **Cálculos:** Crear servicios para derivadas
5. **Reportes:** Generar plantillas de reportes
6. **Testing:** Validar con datos reales
7. **Training:** Capacitar usuarios

---

**Documento Completo:** Guía técnica para mediciones y reportes
**Estado:** ✅ LISTO PARA IMPLEMENTACIÓN
**Revisión:** Próxima sesión


