# 🔍 DEBUG - Filtros de Fecha

## Instrucciones para Capturar Logs

Se ha agregado logging detallado al backend para ver exactamente qué parámetros se están recibiendo y qué SQL se está generando.

### Paso 1: Compilar y Reiniciar Backend

```bash
# En la carpeta del backend
npm run build
npm start
```

### Paso 2: Abre el Navegador

```
http://localhost:3001/ensayos
```

### Paso 3: Abre la Consola del Backend

En la terminal donde ejecutaste `npm start`, deberías ver logs como:

```
=== FILTRO FECHAS DEBUG ===
fechaSiembraStart: undefined
fechaSiembraEnd: undefined
=========================
```

(Inicialmente vacío porque no seleccionaste fechas)

### Paso 4: Selecciona una Fecha

1. Haz click en el primer input de fecha
2. Selecciona: **31/08/2024**
3. Mira la **TERMINAL del backend**

Deberías ver algo como:

```
=== FILTRO FECHAS DEBUG ===
fechaSiembraStart: 2024-08-31
fechaSiembraEnd: undefined
=========================
Agregando condición fechaSiembraStart: 2024-08-31
SQL Query: SELECT ... WHERE ... AND e.fechaSiembra >= :fechaSiembraStart
Parámetros: { fechaSiembraStart: '2024-08-31' }
```

### Paso 5: Selecciona Ambas Fechas Iguales

1. Selecciona primer input: **31/08/2024**
2. Selecciona segundo input: **31/08/2024**
3. Mira la **TERMINAL del backend**

Deberías ver:

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

## 🎯 Información a Proporcionar

Una vez hayas ejecutado estos pasos, por favor **copia y pega exactamente** los logs que ves en la terminal, así podré:

1. Ver exactamente qué formato de fecha se está enviando
2. Ver la SQL query que se está generando
3. Identificar por qué no está filtrando correctamente

---

## 📝 Ejemplo de Logs Esperados

### Caso 1: Solo Fecha Inicio
```
=== FILTRO FECHAS DEBUG ===
fechaSiembraStart: 2024-08-31
fechaSiembraEnd: undefined
=========================
Agregando condición fechaSiembraStart: 2024-08-31
SQL Query: SELECT "e"."ensayo_id" AS "e_id", ... FROM "Ensayo" "e" ... WHERE e.fechaSiembra >= :fechaSiembraStart
Parámetros: { fechaSiembraStart: '2024-08-31' }
```

### Caso 2: Ambas Fechas Iguales
```
=== FILTRO FECHAS DEBUG ===
fechaSiembraStart: 2024-08-31
fechaSiembraEnd: 2024-08-31
=========================
Agregando condición fechaSiembraStart: 2024-08-31
Agregando condición fechaSiembraEnd: 2024-08-31
SQL Query: SELECT ... FROM "Ensayo" "e" ... WHERE e.fechaSiembra >= :fechaSiembraStart AND e.fechaSiembra <= :fechaSiembraEnd
Parámetros: { fechaSiembraStart: '2024-08-31', fechaSiembraEnd: '2024-08-31' }
```

---

## ⚠️ Notas Importantes

- Asegúrate de que el backend esté **corriendo localmente** (npm start)
- Los logs aparecerán en la **TERMINAL/CONSOLA del backend**, no en el navegador
- Copia los logs **COMPLETOS** incluyendo el SQL Query y Parámetros
- Esto nos ayudará a identificar dónde está el problema exactamente


