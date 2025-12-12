### 3) Tipos de Ensayo, planificación (DDA) y modelo EAV de mediciones

Objetivo
- Catalogar Tipos de Ensayo y su planificación de evaluaciones (DDA) y vincularlos con variables/mediciones predefinidas, reutilizando el modelo EAV existente.

Decisiones de diseño
- Catálogo `Tipo_Ensayo` con `evaluacion_csv` para representar días como CSV (ej.: `3,7,14`).
- Tabla puente `Tipo_Ensayo_Variable` para definir, por cada tipo, el conjunto de variables (`Protocolo_Variable`) a medir, orden, obligatoriedad, y metadatos opcionales (`unidad_override`, `escala`, rangos).
- Tabla opcional `Tipo_Ensayo_EvaluacionDia` para normalizar los días en filas individuales (facilita queries), manteniendo `evaluacion_csv` como fuente principal para UI.
- El modelo EAV actual es suficiente para capturar todos los valores listados (porcentajes, escalas 1–9/1–5/0–100, conteos, longitudes, etc.), ya que `Datos_Campo_Medicion.valor` es `VARCHAR(255)`.

Archivos SQL
- `docs/tipo_ensayo.sql`: crea `Tipo_Ensayo`, `Tipo_Ensayo_Variable` y `Tipo_Ensayo_EvaluacionDia`. Incluye índices y restricciones.
- `docs/tipo_ensayo_seed.sql`: pobla el diccionario `Protocolo_Variable`, los tipos de ensayo y sus variables/orden/escala.

Orden de ejecución recomendado
1. `database.sql` (si aún no existe el esquema base) o confirma que existen `Protocolo_Variable` y tablas base.
2. `docs/tipo_ensayo.sql`
3. `docs/tipo_ensayo_seed.sql`

Ejemplos de consultas para dropdowns
- Tipos de ensayo activos:
  ```sql
  SELECT tipo_ensayo_id, nombre FROM Tipo_Ensayo WHERE activo = TRUE ORDER BY nombre;
  ```
- Variables por tipo (resuelve unidad efectiva):
  ```sql
  SELECT v.variable_id_fk, pv.nombre_variable,
         COALESCE(v.unidad_override, pv.unidad_medida) AS unidad,
         v.escala, v.orden, v.requerido
  FROM Tipo_Ensayo_Variable v
  JOIN Protocolo_Variable pv ON pv.variable_id = v.variable_id_fk
  WHERE v.tipo_ensayo_id_fk = ?
  ORDER BY v.orden;
  ```
- Días de evaluación (normalizados):
  ```sql
  SELECT dia FROM Tipo_Ensayo_EvaluacionDia WHERE tipo_ensayo_id_fk = ? ORDER BY dia;
  ```

Validaciones sugeridas (back y front)
- Aplicar validaciones de rango o escala según `escala` (por ejemplo `1-9`, `0-100`).
- Cuando `unidad_override` está definido, priorizarlo sobre `Protocolo_Variable.unidad_medida` para rótulos de UI.

Notas
- La unicidad `(tipo_ensayo_id_fk, variable_id_fk)` en `Tipo_Ensayo_Variable` permite `INSERT ... ON DUPLICATE KEY` para seed idempotente.
- En el futuro se podría permitir versiones/plantillas de tipos de ensayo si cambia la planificación.
