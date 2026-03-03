# 📊 Funcionalidad de Reportes - Sistema TMS

## 📋 Descripción General

El sistema de reportes permite generar reportes completos en formato **PDF** y **Excel** para cada ensayo registrado en el sistema. Los reportes incluyen análisis estadísticos, datos de campo, datos de cosecha y recomendaciones basadas en el desempeño de cada tratamiento.

---

## 🔧 Endpoints Disponibles

### 1. **Generar PDF**
```
GET /api/v1/reportes/ensayo/:ensayoId/pdf
```
**Descripción**: Descarga un PDF con análisis completo del ensayo.

**Parámetros**:
- `ensayoId` (path): ID del ensayo

**Respuesta**: Archivo PDF descargable

**Ejemplo**:
```bash
curl http://localhost:3000/api/v1/reportes/ensayo/74/pdf
```

---

### 2. **Generar Excel**
```
GET /api/v1/reportes/ensayo/:ensayoId/xls
```
**Descripción**: Descarga un Excel con análisis completo del ensayo en múltiples hojas.

**Parámetros**:
- `ensayoId` (path): ID del ensayo

**Respuesta**: Archivo Excel descargable

**Ejemplo**:
```bash
curl http://localhost:3000/api/v1/reportes/ensayo/74/xls
```

---

### 3. **Vista Previa**
```
GET /api/v1/reportes/ensayo/:ensayoId/vista-previa
```
**Descripción**: Obtiene una vista previa de los datos del reporte en JSON.

**Parámetros**:
- `ensayoId` (path): ID del ensayo

**Respuesta**: Objeto JSON con estadísticas y resumen

**Ejemplo**:
```bash
curl http://localhost:3000/api/v1/reportes/ensayo/74/vista-previa
```

**Respuesta ejemplo**:
```json
{
  "ensayoId": 74,
  "estadisticas": {
    "T1": {
      "n": 4,
      "promedio": 5432.5,
      "desviacion": 234.23,
      "minimo": 5100.2,
      "maximo": 5800.1,
      "coefVariacion": 4.31
    },
    "T2": {
      "n": 4,
      "promedio": 6100.75,
      "desviacion": 312.15,
      "minimo": 5750.5,
      "maximo": 6450.3,
      "coefVariacion": 5.12
    }
  },
  "resumen": {
    "ensayo": 74,
    "fechaReporte": "11/2/2026",
    "tratamientoRecomendado": "T2",
    "rendimientoMejor": "6100.8",
    "aumentoRendimiento": "12.3",
    "fitotoxicidadMejor": "0.5",
    "observaciones": ["T2 superó al testigo en 12.3%"],
    "recomendaciones": ["Usar T2 en condiciones similares"]
  },
  "datosCampoCount": 8,
  "datosTrillaCount": 8
}
```

---

## 📊 Contenido de los Reportes

### Reporte PDF (7 páginas)
1. **Portada**: Información básica del ensayo
2. **Resumen Ejecutivo**: Tratamiento recomendado, rendimientos, recomendaciones
3. **Datos del Ensayo**: Ubicación, cultivo, fecha de siembra
4. **Datos de Campo**: Tabla resumen de mediciones de campo
5. **Datos de Trilla**: Tabla resumen de datos de cosecha
6. **Estadísticas**: Análisis estadístico por tratamiento
7. **Conclusiones**: Observaciones y recomendaciones

### Reporte Excel (4 hojas)
1. **Resumen**: Información general del ensayo
2. **Datos Campo**: Datos completos de evaluaciones de campo
3. **Datos Trilla**: Datos completos de cosecha
4. **Estadísticas**: Análisis estadístico por tratamiento

---

## 📈 Análisis Incluido

### Estadísticas por Tratamiento
- **N**: Número de observaciones
- **Promedio**: Valor promedio de rendimiento
- **Desviación Estándar**: Variabilidad de los datos
- **Mínimo/Máximo**: Rango de valores
- **Coeficiente de Variación**: Medida de variabilidad relativa

### Análisis de Fitotoxicidad
- Análisis de evolución en días después de aplicación (DDA)
- Valores: 3DDA, 7DDA, 14DDA, 38DDA, 58DDA
- Métricas: Promedio, máximo y mínimo por DDA

### Análisis de Rendimiento
- Comparación con tratamiento testigo (T1)
- Diferencia absoluta (kg/ha)
- Porcentaje de diferencia respecto al testigo
- Germination percentage (GJE)

### Resumen Ejecutivo
- Tratamiento recomendado (mayor rendimiento)
- Rendimiento del mejor tratamiento
- Aumento porcentual vs testigo
- Nivel de fitotoxicidad
- Observaciones y recomendaciones automáticas

---

## 🔄 Flujo de Datos

```
Ensayo (BD)
    ↓
├─ Parcelas
│   ├─ Tratamiento
│   ├─ Bloque
│   ├─ Datos de Campo
│   │   └─ Mediciones (variables, valores)
│   └─ Datos de Cosecha
│       ├─ Humedad
│       ├─ kg/ha corregido
│       └─ GJE
    ↓
ReportesService.obtenerDatosEnsayo()
    ↓
├─ datosCampo: Array<{tratamiento, bloque, variable, valor}>
├─ datosTrilla: Array<{tratamiento, bloque, humedad, kgHa, gje}>
└─ metadadatos: {ensayoId, cultivo, provincia, ...}
    ↓
calcularEstadisticas() → estadisticas por tratamiento
analizarRendimiento() → comparativa vs testigo
analizarFitotoxicidad() → evolución por DDA
generarResumenEjecutivo() → recomendaciones
    ↓
PdfReportGenerator / ExcelReportGenerator
    ↓
Buffer (PDF/Excel)
```

---

## 🛠️ Tecnologías Utilizadas

- **PDF**: pdfkit
- **Excel**: exceljs
- **Backend**: NestJS + TypeORM
- **Base de Datos**: MySQL

---

## ⚠️ Notas Importantes

1. **Datos Requeridos**: Los reportes requieren que el ensayo tenga:
   - Al menos una parcela con datos de campo o cosecha
   - Mediciones registradas en los datos de campo
   - Datos de cosecha en las parcelas

2. **Tratamiento Testigo**: El sistema asume que T1 (Tratamiento 1) es el testigo para comparativas

3. **Rendimiento en kg/ha**: Se calcula desde `DatosCosecha.kgHaCorregido`

4. **Tratamiento Recomendado**: Se selecciona automáticamente como el de mayor promedio de rendimiento

---

## 📝 Ejemplos de Uso

### Generar PDF desde Frontend
```typescript
// En componente Vue/React
const ensayoId = 74;
window.location.href = `http://localhost:3000/api/v1/reportes/ensayo/${ensayoId}/pdf`;
```

### Generar Excel desde Frontend
```typescript
const ensayoId = 74;
window.location.href = `http://localhost:3000/api/v1/reportes/ensayo/${ensayoId}/xls`;
```

### Ver Vista Previa
```typescript
const response = await fetch(`http://localhost:3000/api/v1/reportes/ensayo/74/vista-previa`);
const data = await response.json();
console.log(data.resumen);
```

---

## 🚀 Próximas Mejoras Sugeridas

1. **Gráficos**: Agregar gráficos de distribución y comparativas
2. **Comparación Multiple**: Reportes comparando múltiples ensayos
3. **Filtros**: Permitir seleccionar rangos de datos específicos
4. **Exportación CSV**: Agregar formato CSV
5. **Email Automático**: Enviar reportes por email
6. **Plantillas Personalizadas**: Permitir personalizar el formato
7. **Análisis ANOVA**: Análisis de varianza estadística
8. **Heatmaps**: Visualización de datos geoespaciales

---

**Última Actualización**: 2026-02-11

