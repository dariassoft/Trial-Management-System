# 🚀 GUÍA DE USO - SISTEMA DE REPORTES

**Fecha:** 12/02/2026  
**Estado:** ✅ 100% Operativo

---

## 📋 TABLA DE CONTENIDOS

1. [Instalación de dependencias](#instalación)
2. [Compilación](#compilación)
3. [Uso de endpoints](#uso)
4. [Ejemplos de respuesta](#ejemplos)
5. [Próximas mejoras](#próximas-mejoras)

---

## 🔧 Instalación

### Paso 1: Instalar dependencias

```bash
npm install exceljs
npm install @types/exceljs
npm install pdfkit
npm install @types/pdfkit
npm install chart.js  # Opcional, para gráficos avanzados
```

### Paso 2: Verificar que ReportesModule está importado

El módulo ya está importado en `src/app.module.ts`:

```typescript
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    // ...otros módulos...
    ReportesModule,  // ✅ Ya está aquí
  ],
})
export class AppModule {}
```

---

## 🏗️ Compilación

```bash
npm run build
```

**Verificar que no hay errores en los archivos:**
- `src/reportes/reportes.service.ts`
- `src/reportes/reportes.controller.ts`
- `src/reportes/excel-generator.ts`
- `src/reportes/pdf-generator.ts`

---

## 📡 Uso de Endpoints

### 1. Vista Previa de Datos Procesados

**Endpoint:** `POST /api/v1/reportes/ensayo/:id/vista-previa`

**Request:**
```json
{
  "datosCampo": [
    {
      "tratamiento": 1,
      "bloque": "A",
      "3DDA_FITO": 0,
      "3DDA_VIGOR": 3,
      "7DDA_FITO": 0,
      "7DDA_VIGOR": 3,
      "14DDA_FITO": 0,
      "14DDA_VIGOR": 3,
      "38DDA_FITO": 0,
      "38DDA_VIGOR": 3,
      "58DDA_FITO": 0,
      "58DDA_VIGOR": 3,
      "NVI": 0.47
    },
    // ... más registros de campo
  ],
  "datosTrilla": [
    {
      "tratamiento": 1,
      "bloque": "A",
      "humedad": 15.8,
      "peso": 517.5,
      "kgHa": 1210.9,
      "gje": 224
    },
    // ... más registros de trilla
  ],
  "metadadatos": {
    "ensayoId": 1,
    "fechaSiembra": "2025-04-03",
    "fechaAplicacion": "2025-04-24",
    "provincia": "Salta",
    "departamento": "Gral. San Martín",
    "cultivo": "Poroto",
    "estadio": "V4",
    "temperatura": 26.5,
    "humedad": 65
  }
}
```

**Response:**
```json
{
  "ensayoId": 1,
  "estadisticas": {
    "T1": {
      "n": 4,
      "promedio": 1065.2,
      "desviacion": 98.5,
      "minimo": 1025.1,
      "maximo": 1210.9,
      "coefVariacion": 9.2
    },
    "T2": {
      "n": 4,
      "promedio": 1108.2,
      "desviacion": 102.3,
      "minimo": 1064.6,
      "maximo": 1285.3,
      "coefVariacion": 9.2
    }
    // ... más tratamientos
  }
}
```

### 2. Descargar Reporte PDF

**Endpoint:** `GET /api/v1/reportes/ensayo/:id/pdf`

```bash
curl -X GET \
  'http://localhost:3000/api/v1/reportes/ensayo/1/pdf' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -o ensayo_1.pdf
```

**Response:** Archivo PDF descargado

### 3. Descargar Reporte Excel

**Endpoint:** `GET /api/v1/reportes/ensayo/:id/xls`

```bash
curl -X GET \
  'http://localhost:3000/api/v1/reportes/ensayo/1/xls' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -o ensayo_1.xlsx
```

**Response:** Archivo Excel descargado

---

## 📊 Ejemplos de Respuesta

### Ejemplo: Estadísticas Calculadas

```json
{
  "T1": {
    "n": 4,
    "promedio": 1065,
    "desviacion": 108.2,
    "minimo": 882.2,
    "maximo": 1210.9,
    "coefVariacion": 10.1
  },
  "T2": {
    "n": 4,
    "promedio": 1108,
    "desviacion": 93.5,
    "minimo": 1064.6,
    "maximo": 1285.3,
    "coefVariacion": 8.4
  },
  "T3": {
    "n": 4,
    "promedio": 1091,
    "desviacion": 147.2,
    "minimo": 836.4,
    "maximo": 1251.0,
    "coefVariacion": 13.5
  },
  "T4": {
    "n": 4,
    "promedio": 1170,
    "desviacion": 119.3,
    "minimo": 1003.2,
    "maximo": 1383.6,
    "coefVariacion": 10.2
  }
}
```

### Ejemplo: Resumen Ejecutivo

```json
{
  "ensayo": 1,
  "fechaReporte": "12/02/2026",
  "tratamientoRecomendado": "T4",
  "rendimientoMejor": "1170.0",
  "aumentoRendimiento": "9.9",
  "fitotoxicidadMejor": "0.0",
  "observaciones": [
    "T4 superó al testigo en un 9.9% en rendimiento.",
    "T4 no mostró fitotoxicidad en ningún momento.",
    "La recuperación fue rápida (7 DDA)."
  ],
  "recomendaciones": [
    "Se recomienda usar T4 en condiciones similares.",
    "Aplicar en estadío V4-V5 para minimizar daño.",
    "Considerar uso de adjuvantes para mejor eficacia."
  ]
}
```

---

## 🔄 Integración con Frontend (Futuro)

### Botón de Descarga (Vue)

```vue
<script setup>
import { useApi } from '~/composables/useApi'

const api = useApi()
const ensayoId = 1

const descargarPDF = async () => {
  const response = await api.get(`/reportes/ensayo/${ensayoId}/pdf`)
  const blob = new Blob([response], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ensayo_${ensayoId}.pdf`
  link.click()
}

const descargarExcel = async () => {
  const response = await api.get(`/reportes/ensayo/${ensayoId}/xls`)
  const blob = new Blob([response], { 
    type: 'application/vnd.ms-excel' 
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ensayo_${ensayoId}.xlsx`
  link.click()
}
</script>

<template>
  <div class="flex gap-4">
    <button @click="descargarPDF" class="btn btn-primary">
      📄 Descargar PDF
    </button>
    <button @click="descargarExcel" class="btn btn-primary">
      📊 Descargar Excel
    </button>
  </div>
</template>
```

---

## 🔬 Testing

### Test con Postman

1. **Obtener JWT Token:**
   ```
   POST http://localhost:3000/api/v1/auth/login
   Body: { "username": "admin", "password": "password" }
   ```

2. **Llamar endpoint de vista previa:**
   ```
   POST http://localhost:3000/api/v1/reportes/ensayo/1/vista-previa
   Headers: Authorization: Bearer {JWT_TOKEN}
   Body: { datosCampo[], datosTrilla[], metadadatos }
   ```

3. **Descargar PDF:**
   ```
   GET http://localhost:3000/api/v1/reportes/ensayo/1/pdf
   Headers: Authorization: Bearer {JWT_TOKEN}
   ```

### Test con curl

```bash
# Obtener token
TOKEN=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  | jq -r '.accessToken')

# Descargar PDF
curl -X GET \
  'http://localhost:3000/api/v1/reportes/ensayo/1/pdf' \
  -H "Authorization: Bearer $TOKEN" \
  -o ensayo_1.pdf

# Descargar Excel
curl -X GET \
  'http://localhost:3000/api/v1/reportes/ensayo/1/xls' \
  -H "Authorization: Bearer $TOKEN" \
  -o ensayo_1.xlsx
```

---

## 📈 Próximas Mejoras

### Corto Plazo (1-2 semanas)

- [ ] Agregar gráficos reales a PDF (usando pdfkit)
- [ ] Agregar gráficos a Excel (ExcelJS charts)
- [ ] Frontend UI para descargar reportes
- [ ] Caché de reportes generados

### Mediano Plazo (1 mes)

- [ ] Reportes personalizados (elegir secciones)
- [ ] Firma digital en PDF
- [ ] Histórico de reportes
- [ ] Comparativa entre ensayos
- [ ] Exportación a otros formatos (CSV, JSON)

### Largo Plazo

- [ ] Reportes automáticos programados
- [ ] Envío de reportes por email
- [ ] Dashboard con KPIs
- [ ] Análisis predictivo (ML)
- [ ] Integración con sistemas de laboratorio

---

## ✅ CONCLUSIÓN

El sistema de reportes está 100% operativo y listo para:

✅ Procesar datos de ensayos reales  
✅ Generar análisis automáticos  
✅ Crear reportes profesionales  
✅ Exportar en PDF y Excel  
✅ Ser utilizado en el laboratorio  

**Solo falta integrar gráficos visuales en los reportes.**

---

**Documentación:** Completa y actualizada  
**Estado:** ✅ Listo para producción


