# 🔍 DEBUG COMPLETO - Frontend + Backend

## Instrucciones Detalladas para Capturar Logs

He agregado logging en AMBOS lados (frontend y backend) para ver exactamente qué está pasando.

---

## 📋 Paso a Paso

### PASO 1: Compilar y Ejecutar Backend

```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
npm run build
npm start
```

**Deberías ver en la terminal**:
```
[Nest] ... - ... ... info [NestFactory] Nest application successfully started
```

### PASO 2: Abrir Navegador

```
http://localhost:3001/ensayos
```

### PASO 3: Abre DevTools del Navegador

- **Windows/Linux**: `F12`
- **Mac**: `Cmd + Option + I`
- Ve a la pestaña **Console**

### PASO 4: Selecciona Primera Fecha

1. Click en primer input de fecha
2. Selecciona: **31/08/2024**
3. Press Enter o click fuera

### PASO 5: Captura Logs del Navegador

En la consola del navegador, **deberías ver logs del FRONTEND** como:

```
=== FRONTEND: Parámetros enviados ===
dateStart ref value: 2024-08-31
dateEnd ref value: 
Parámetros completos: {page: 1, limit: 10, sort: 'nombreEnsayo', order: 'ASC', fechaSiembraStart: '2024-08-31'}
=====================================
```

**COPIA ESTO**

### PASO 6: Captura Logs del Backend

En la **TERMINAL donde ejecutaste npm start**, **deberías ver logs del BACKEND** como:

```
=== FILTRO FECHAS DEBUG ===
fechaSiembraStart: 2024-08-31
fechaSiembraEnd: undefined
=========================
Agregando condición fechaSiembraStart: 2024-08-31
SQL Query: SELECT "e"."ensayo_id" AS "e_id", ... WHERE ... AND e.fechaSiembra >= :fechaSiembraStart
Parámetros: { fechaSiembraStart: '2024-08-31' }
```

**COPIA ESTO**

### PASO 7: Selecciona Ambas Fechas Iguales

1. Click en segundo input de fecha
2. Selecciona: **31/08/2024**
3. Press Enter

### PASO 8: Captura Logs Nuevamente

**Console del Navegador (FRONTEND)**:
```
=== FRONTEND: Parámetros enviados ===
dateStart ref value: 2024-08-31
dateEnd ref value: 2024-08-31
Parámetros completos: {page: 1, limit: 10, sort: 'nombreEnsayo', order: 'ASC', fechaSiembraStart: '2024-08-31', fechaSiembraEnd: '2024-08-31'}
=====================================
```

**Terminal (BACKEND)**:
```
=== FILTRO FECHAS DEBUG ===
fechaSiembraStart: 2024-08-31
fechaSiembraEnd: 2024-08-31
=========================
Agregando condición fechaSiembraStart: 2024-08-31
Agregando condición fechaSiembraEnd: 2024-08-31
SQL Query: SELECT ... WHERE ... AND e.fechaSiembra >= :fechaSiembraStart AND e.fechaSiembra <= :fechaSiembraEnd
Parámetros: { fechaSiembraStart: '2024-08-31', fechaSiembraEnd: '2024-08-31' }
```

---

## 🎯 Información Crítica Que Necesito

Por favor, **copia y pega EXACTAMENTE**:

### Del Navegador (Console):
```
=== FRONTEND: Parámetros enviados ===
[... aquí van los logs ...]
```

### De la Terminal Backend:
```
=== FILTRO FECHAS DEBUG ===
[... aquí van los logs ...]
Agregando condición fechaSiembraStart: [...]
SQL Query: [...]
Parámetros: [...]
```

---

## ❓ Posibles Problemas a Identificar

Con estos logs podré determinar:

1. **¿El parámetro llega al backend?**
   - Si `fechaSiembraStart` en el backend es `undefined` → El frontend no lo está enviando
   - Si `fechaSiembraStart` tiene un valor → Sí llegó

2. **¿Se está agregando la condición WHERE?**
   - Si ves "Agregando condición" → Sí se agregó
   - Si NO ves ese mensaje → No se agregó

3. **¿La SQL query está correcta?**
   - Deberías ver: `e.fechaSiembra >= :fechaSiembraStart`
   - Si no está → Hay un problema en la construcción de la query

4. **¿Los parámetros están llegando a MySQL?**
   - El formato debe ser: `{ fechaSiembraStart: '2024-08-31' }`

---

## 📌 Importante

- Asegúrate que el backend esté **ejecutándose localmente** (`npm start`)
- Los logs del **FRONTEND aparecen en el navegador (F12 → Console)**
- Los logs del **BACKEND aparecen en la TERMINAL donde ejecutaste npm start**
- Copia **TODO** incluyendo formato y caracteres especiales


