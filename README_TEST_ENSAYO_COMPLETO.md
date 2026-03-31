# 🧪 Script de Prueba Completo — Ensayo Fungicida Soja

## 📋 Descripción

Este script SQL (`test_ensayo_completo.sql`) crea un ensayo completo desde cero con **todos los datos necesarios** para probar la funcionalidad completa del sistema TMS, incluyendo la generación de reportes PDF y Excel.

## 🎯 Qué Crea el Script

### 1. **Productos** (4 fungicidas)
- Amistar Xtra TEST (Bayer)
- Nativo TEST (Syngenta)
- Opera TEST (Laboratorio Principal)
- Comet TEST (Bayer)

### 2. **Protocolo** + 5 Tratamientos
- **T0**: Testigo sin aplicación
- **T1**: Amistar Xtra TEST 500 cc/ha
- **T2**: Nativo TEST 400 cc/ha
- **T3**: Opera TEST 750 cc/ha
- **T4**: Amistar Xtra + Comet (mezcla de tanque) ← **mejor tratamiento**

### 3. **Ensayo**
- **Nombre**: PRUEBA COMPLETA 2026 | Fungicida Soja - Campo San Martín
- **Código Labor**: PC-2026-001
- **Cultivo**: Soja DM 4.0i
- **Tipo**: FUNGICIDA (reutiliza tipo_ensayo_id = 6)
- **Diseño**: DBCA (Diseño Bloques Completos al Azar)
- **Ubicación**: Córdoba, General San Martín
- **Matriz**: 4 filas × 5 columnas

### 4. **4 Bloques** + 20 Parcelas
Randomización por bloque:
```
Bloque I:   T0  T1  T2  T3  T4
Bloque II:  T2  T0  T4  T1  T3
Bloque III: T3  T4  T0  T2  T1
Bloque IV:  T1  T3  T2  T4  T0
```

### 5. **Datos de Siembra** (20 registros)
- Fecha: 2026-11-05
- Densidad: 330,000 plantas/ha
- Germinación: 88.5% - 94.0%
- Vigor: 3-5 (escala 1-5)

### 6. **Aplicación Foliar** + 3 Momentos de Evaluación
- **Aplicación**: 2027-01-08, estadio R1, 22.5°C, 68% humedad
- **Momentos**:
  - D0 (Pre-aplicación)
  - 14 DAA (días después de aplicación)
  - 28 DAA

### 7. **Datos de Campo** (60 registros) + Mediciones (300)
Variables evaluadas (5 por momento):
- **Incidencia de Sclerotinia** (%)
- **Severidad de Sclerotinia** (%)
- **Fitotoxicidad** (escala 1-9)
- **NVI** (0-1)
- **Sanidad General** (0-100)

**Eficacia relativa**:
- T4 (mezcla): ~80% control
- T1 (Amistar): ~70% control
- T2 (Nativo): ~62% control
- T3 (Opera): ~58% control
- T0 (testigo): 0% control

### 8. **Datos de Cosecha** (20 registros completos)
Todos los campos poblados:
- kg/ha corregido a 13.5% humedad
- GIE (Grano Índice Ensayo)
- Gramaje por grano
- Granos por unidad de referencia
- % granos dañados, verdes, vanos
- Hojas, larvas, insectos benéficos por URF
- Altura de parcela
- Densidad final de plantas

**Rendimientos promedio por tratamiento**:
- T4: **3,575 kg/ha** (+38% vs testigo) ← MEJOR
- T1: 3,415 kg/ha (+32% vs testigo)
- T2: 3,283 kg/ha (+27% vs testigo)
- T3: 3,188 kg/ha (+23% vs testigo)
- T0: 2,563 kg/ha (testigo)

---

## 🚀 Cómo Ejecutar

### Opción 1: Desde el Host (Docker corriendo)

```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

docker exec -i tms-backend-mysql-1 \
  mysql -umyuser -pmypassword nest_db < test_ensayo_completo.sql
```

### Opción 2: Dentro del Contenedor MySQL

```bash
docker exec -it tms-backend-mysql-1 bash

mysql -umyuser -pmypassword nest_db
source /path/to/test_ensayo_completo.sql
```

### Opción 3: Copiar al Contenedor y Ejecutar

```bash
docker cp test_ensayo_completo.sql tms-backend-mysql-1:/tmp/

docker exec tms-backend-mysql-1 \
  mysql -umyuser -pmypassword nest_db -e "source /tmp/test_ensayo_completo.sql"
```

---

## ✅ Verificación Post-Ejecución

Después de ejecutar el script, verifica que se creó correctamente:

```sql
-- Verificar el ensayo
SELECT ensayo_id, nombre_ensayo, codigo_labor
FROM Ensayo
WHERE codigo_labor = 'PC-2026-001';

-- Verificar conteos
SELECT
  (SELECT COUNT(*) FROM Bloque WHERE ensayo_id_fk = <ensayo_id>) as bloques,
  (SELECT COUNT(*) FROM Parcela WHERE ensayo_id_fk = <ensayo_id>) as parcelas,
  (SELECT COUNT(*) FROM Datos_Siembra ds
     JOIN Parcela p ON p.parcela_id = ds.parcela_id_fk
     WHERE p.ensayo_id_fk = <ensayo_id>) as siembras,
  (SELECT COUNT(*) FROM Datos_Campo dc
     JOIN Parcela p ON p.parcela_id = dc.parcela_id_fk
     WHERE p.ensayo_id_fk = <ensayo_id>) as datos_campo,
  (SELECT COUNT(*) FROM Datos_Campo_Medicion dcm
     JOIN Datos_Campo dc ON dc.dato_campo_id = dcm.dato_campo_id_fk
     JOIN Parcela p ON p.parcela_id = dc.parcela_id_fk
     WHERE p.ensayo_id_fk = <ensayo_id>) as mediciones,
  (SELECT COUNT(*) FROM Datos_Cosecha dcos
     JOIN Parcela p ON p.parcela_id = dcos.parcela_id_fk
     WHERE p.ensayo_id_fk = <ensayo_id>) as cosechas;
```

**Resultado esperado**:
```
bloques: 4
parcelas: 20
siembras: 20
datos_campo: 60
mediciones: 300
cosechas: 20
```

---

## 📊 Generación de Reportes

Una vez ejecutado el script y verificado el `ensayo_id`, genera los reportes:

### Reporte PDF

```bash
# Desde navegador o curl
curl -X GET "http://localhost:3000/api/v1/reportes/pdf/<ensayo_id>" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  --output reporte_ensayo.pdf
```

O abre en navegador (si tienes sesión activa):
```
http://localhost:3000/api/v1/reportes/pdf/<ensayo_id>
```

### Reporte Excel

```bash
curl -X GET "http://localhost:3000/api/v1/reportes/excel/<ensayo_id>" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  --output reporte_ensayo.xlsx
```

O en navegador:
```
http://localhost:3000/api/v1/reportes/excel/<ensayo_id>
```

---

## 🔄 Idempotencia

El script **puede ejecutarse múltiples veces** sin problemas. La **Sección 0** limpia automáticamente todos los datos previos del ensayo `PC-2026-001` antes de insertar nuevos datos.

Esto permite:
- Corregir errores y re-ejecutar
- Actualizar datos de prueba
- Resetear a estado conocido

---

## 📝 Datos Generados para Reportes

El script está diseñado para que los reportes muestren:

### En PDF:
✅ Información completa del ensayo (ubicación, fechas, cultivo, protocolo)
✅ Tabla de tratamientos con productos y dosis
✅ Datos de aplicación (equipo, condiciones climáticas)
✅ Estadísticas de mediciones de campo por tratamiento y momento
✅ Gráficos de evolución de enfermedad (incidencia y severidad)
✅ Tabla de cosecha con rendimientos promedio por tratamiento
✅ Análisis estadístico (promedios, CV%, Duncan/Tukey si implementado)

### En Excel:
✅ Hoja "Ensayo" con metadatos
✅ Hoja "Tratamientos" con detalle de productos
✅ Hoja "Mediciones Campo" con datos crudos por parcela/momento
✅ Hoja "Cosecha" con todos los campos por parcela
✅ Hoja "Resumen Estadístico" con promedios y análisis
✅ Datos formateados y listos para análisis en software estadístico

---

## 🎨 Visualización Esperada en Reportes

### Gráfico de Incidencia de Sclerotinia
```
Incidencia (%)
80 |                                    ╭─ T0 (Testigo)
70 |                                ╭───╯
60 |                            ╭───╯
50 |                        ╭───╯
40 |                    ╭───╯
30 |              ╭─────┤─────────── T3 (Opera)
20 |          ╭───┤─────┤─────────── T2 (Nativo)
10 |      ╭───┤───┤─────┤─────────── T1 (Amistar)
 0 |──────┤───┤───┤─────┴─────────── T4 (Mezcla) ★
   └──────┴───┴───┴────────────────
        D0  14  28 DAA
```

### Tabla de Rendimientos
```
Tratamiento              kg/ha    vs Testigo   Ranking
────────────────────────────────────────────────────────
T4 (Amistar + Comet)    3,575    +38% ★★★    1º
T1 (Amistar Xtra)       3,415    +32% ★★      2º
T2 (Nativo)             3,283    +27% ★       3º
T3 (Opera)              3,188    +23%         4º
T0 (Testigo)            2,563      0%         5º
```

---

## 🐛 Troubleshooting

### Error: "Duplicate entry"
El script se ejecutó previamente. Esto es normal, la sección 0 limpia automáticamente. Si persiste:
```sql
DELETE FROM Ensayo WHERE codigo_labor = 'PC-2026-001';
```

### Error: "Unknown column in field list"
Verifica que la base de datos esté actualizada con las migraciones:
```bash
docker exec tms-backend-app-1 npm run migration:run
```

### Error: "Cannot find tipo_ensayo_id = 6"
El tipo de ensayo FUNGICIDA no existe. Verifica:
```sql
SELECT * FROM Tipo_Ensayo WHERE tipo_ensayo_id = 6;
```

### Error en reportes: "No se puede generar reporte"
1. Verifica que el ensayo existe
2. Confirma que hay datos de cosecha
3. Revisa logs del backend:
```bash
docker logs tms-backend-app-1 --tail 100
```

---

## 📚 Referencias

- **Entidades**: Ver `src/entities/` para estructura completa de datos
- **Reportes**: Ver `src/reportes/reportes.service.ts` para lógica de generación
- **API**: Swagger en `http://localhost:3000/docs`
- **AGENTS.md**: Documentación completa de arquitectura

---

## 🎯 Próximos Pasos

Después de ejecutar este script:

1. ✅ Verifica que el ensayo se creó correctamente
2. ✅ Genera el reporte PDF → debe mostrar toda la información de forma clara
3. ✅ Genera el reporte Excel → debe tener todas las hojas con datos
4. ✅ Revisa que los gráficos sean legibles y representativos
5. ✅ Verifica que las estadísticas sean correctas (promedios, CV%, etc.)

---

**Última actualización**: 2026-03-31
**Versión del script**: 1.0
**Autor**: Sistema TMS - Generación Automática

